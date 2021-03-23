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
  setHotelData
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
        mesh.name = 'hotel';
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

  var label = new GUI.TextBlock();
  label.text = 'Space Hotel';
  label.top = '-35%';
  container.addControl(label);

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
  constructBtn.width = 0.35;
  constructBtn.height = 0.35;
  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);

  constructBtn.onPointerClickObservable.add(function () {
    if (!hotelData.build) {
      axios
        .get('api/v1/base/1/build/hotel')
        .then((res) => {
          setHotelData(res.data);
          setCountDownTimer(
            calcRequiredTime(res.data.completeTime),
            container,
            onFinish
          );
        })
        .catch((err) => console.error(err.response.data.message));
      constructBtn.textBlock.text = 'Building';
    }
  });

  function onFinish() {
    constructBtn.textBlock.text = 'Upgrade';
    completeTheBuild();
  }

  function completeTheBuild() {
    let body = {
      buildingId: 1,
      baseId: 1,
    };
    if (!hotelData.build) {
      axios
        .post('api/v1/base/complete/hotel', body)
        .then((res) => {
          if (res.status === 200) {
            changeBuildingOpacity(scene, 'hotel');
          }
        })
        .catch((err) => console.error(err.response.data.message));
    }
  }

  // set the initial timer if required
  if (new Date(hotelData.completeTime) - new Date() > 0) {
    setCountDownTimer(
      calcRequiredTime(hotelData.completeTime),
      container,
      onFinish
    );
  } else {
    completeTheBuild();
  }
}
