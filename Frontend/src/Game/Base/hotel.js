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
  resourceLabels,
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
  let [timeLabel, powerLabel, starLabel, popLabel] = resourceLabels(
    container,
    'Space Hotel',
    60,
    2,
    1,
    0
  );

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
        updateData.upgrade = true;
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
        let newData = hotelData;
        newData.upgrade = false;
        setHotelData(newData);
        constructBtn.textBlock.text = 'Upgrade';
      })
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
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
        constructBtn.textBlock.text = 'Building';
      })
      .catch((err) => console.error(err.response.data.message));
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
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
  }

  function updateResources() {
    axios
      .get('api/v1/buildings/getCost/' + postBody.buildingId)
      .then((res) => {
        timeLabel.text = 'Time: ' + res.data.TIME * 60;
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

  //Display required resources
  if (hotelData.build) updateResources();
}
