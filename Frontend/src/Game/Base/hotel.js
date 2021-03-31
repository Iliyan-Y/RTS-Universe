import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import axios from 'axios';

import {
  createGuiContainer,
  calcRequiredTime,
  setCountDownTimer,
  changeBuildingOpacity,
} from './GuiElements';

export async function createHotel(
  scene,
  advancedTexture,
  hotelData,
  setHotelData,
  baseId
) {
  let container = createGuiContainer(advancedTexture);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'hotel.obj',
    scene,
    (newMeshes) => {
      container.linkWithMesh(newMeshes[12]);
      container.linkOffsetY = -90;
      newMeshes.forEach((mesh) => {
        mesh.scaling = new Vector3(0.03, 0.03, 0.04);
        mesh.name = 'SPACE_HOTEL';
        mesh.visibility = hotelData.build ? 1 : 0.3;
        mesh.position = new Vector3(8, 3, -2);
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(
            { trigger: ActionManager.OnPickUpTrigger },
            function () {
              let visible = !container.isVisible;
              container.isVisible = visible;
            }
          )
        );
      });
    }
  );

  // ---- Gui Elements Section ----
  var label = new GUI.TextBlock();
  label.text = 'Space Hotel';
  label.top = '-35%';
  container.addControl(label);

  let initialCost = [
    { name: 'Star: ', req: 1 },
    { name: 'Pow: ', req: 2 },
    { name: 'Pop: ', req: 0 },
    { name: 'Time: ', req: 1 },
  ];

  var timeLabel = new GUI.TextBlock();
  timeLabel.text = 'Time: 60';
  timeLabel.top = '-34%';
  timeLabel.left = '-35%';
  container.addControl(timeLabel);

  var powerLabel = new GUI.TextBlock();
  powerLabel.text = 'Pow: 2';
  powerLabel.top = (-34 + 13).toString() + '%';
  powerLabel.left = '-35%';
  container.addControl(powerLabel);

  var starLabel = new GUI.TextBlock();
  starLabel.text = 'Star: 1';
  starLabel.top = (-34 + 2 * 13).toString() + '%';
  starLabel.left = '-35%';
  container.addControl(starLabel);

  var popLabel = new GUI.TextBlock();
  popLabel.text = 'Pop: 0';
  popLabel.top = (-34 + 3 * 13).toString() + '%';
  popLabel.left = '-35%';
  container.addControl(popLabel);

  // function displayCost(resources) {
  //   resources.forEach((resource, index) => {});
  // }
  var closeBtn = GUI.Button.CreateSimpleButton('Close', 'X');
  closeBtn.width = 0.1;
  closeBtn.height = 0.2;
  closeBtn.color = 'red';
  closeBtn.cornerRadius = 5;
  closeBtn.thickness = 1.5;
  closeBtn.left = '45%';
  closeBtn.top = '-38%';

  container.addControl(closeBtn);
  closeBtn.onPointerClickObservable.add(function () {
    container.isVisible = false;
  });

  var constructBtn = GUI.Button.CreateSimpleButton(
    'Construct',
    hotelData.build ? 'Upgrade' : 'Build'
  );
  constructBtn.width = 0.4;
  constructBtn.height = 0.4;
  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);

  // --- functional section ---
  constructBtn.onPointerClickObservable.add(function () {
    hotelData.build ? startUpgrade() : startBuild();
  });

  let postBody = {
    buildingId: hotelData.id,
    baseId,
  };

  function startUpgrade() {
    axios
      .post('api/v1/base/upgradeBuilding', postBody)
      .then((res) => {
        constructBtn.textBlock.text = 'Upgrading';
        let updateData = hotelData;
        updateData.completeTime = res.data.completeTime;
        setHotelData(updateData);
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishUpgrade
        );
      })
      .catch((err) => console.error(err.response.data.message));
  }

  function finishUpgrade() {
    if (!hotelData.upgrade) return;
    axios
      .post('api/v1/base/finishHotelUpgrade', postBody)
      .then(() => {
        constructBtn.textBlock.text = 'Upgrade';
      })
      .catch((err) => console.error(err.response.data.message));
    updateResources();
  }

  function startBuild() {
    axios
      .get(`api/v1/base/${baseId}/build/hotel`)
      .then((res) => {
        setHotelData(res.data);
        postBody.buildingId = res.data.id;
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishBuild
        );
      })
      .catch((err) => console.error(err.response.data.message));
    constructBtn.textBlock.text = 'Building';
  }

  function finishBuild() {
    if (hotelData.build) return;

    axios
      .post('api/v1/base/complete/hotel', postBody)
      .then((res) => {
        if (res.status === 200) {
          let updateData = hotelData;
          updateData.build = true;
          setHotelData(updateData);
          changeBuildingOpacity(scene, 'SPACE_HOTEL');
          constructBtn.textBlock.text = 'Upgrade';
        }
      })
      .catch((err) => console.error(err.response.data.message));
    updateResources();
  }

  function updateResources() {
    axios
      .get('api/v1/buildings/getCost/' + hotelData.id)
      .then((res) => {
        timeLabel.text = timeLabel.text.slice(0, -2) + res.data.TIME * 60;
        powerLabel.text = powerLabel.text.slice(0, -1) + res.data.POWER;
        starLabel.text = starLabel.text.slice(0, -1) + res.data.STARDUST;
        popLabel.text = popLabel.text.slice(0, -1) + res.data.POPULATION;
      })
      .catch((err) => console.error(err.response.data.message));
  }

  // On load set the initial timer if required
  if (new Date(hotelData.completeTime) - new Date() > 0) {
    if (hotelData.upgrade) constructBtn.textBlock.text = 'Upgrading';
    setCountDownTimer(
      calcRequiredTime(hotelData.completeTime),
      container,
      hotelData.upgrade ? finishUpgrade : finishBuild
    );
  } else {
    hotelData.upgrade ? finishUpgrade() : finishBuild();
  }

  // Display required resources
  if (hotelData.build) {
    updateResources();
  }
}
