import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import axios from 'axios';

export async function createHotel(
  scene,
  advancedTexture,
  hotelData,
  setHotelData
) {
  let container = createGuiContainer();
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

  function createGuiContainer() {
    var container = new GUI.Rectangle();
    container.width = 0.2;
    container.height = 0.1;
    container.cornerRadius = 10;
    container.color = 'Orange';
    container.thickness = 1;
    container.isVisible = false;
    advancedTexture.addControl(container);
    return container;
  }

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
          setCountDownTimer(calcRequiredTime(res.data.completeTime));
        })
        .catch((err) => console.error(err.response.data.message));
      constructBtn.textBlock.text = 'Building';
    }
  });

  function calcRequiredTime(completeTime) {
    let convertedTime = new Date(completeTime);
    return Math.round((convertedTime - new Date()) / 1000) + 1;
  }

  function setCountDownTimer(time) {
    var timeToCount = time; // seconds
    var countDown = new GUI.TextBlock('text', new String(timeToCount));
    countDown.top = '33%';
    container.addControl(countDown);

    var timer = window.setInterval(() => {
      timeToCount--;
      countDown.text = new String(timeToCount);

      if (timeToCount === 0) {
        window.clearInterval(timer);
        constructBtn.textBlock.text = 'Upgrade';
        completeTheBuild();
        countDown.dispose();
      }
    }, 1000);
  }

  function completeTheBuild() {
    let body = {
      buildingId: 1,
      baseId: 1,
    };
    axios
      .post('api/v1/base/complete/hotel', body)
      .then((res) => {
        if (res.status === 200) {
          changeOpacity();
        }
      })
      .catch((err) => console.error(err.response.data.message));
  }

  function changeOpacity() {
    scene.meshes.forEach((mesh) => {
      if (mesh.name === 'hotel') {
        mesh.visibility = 1;
      }
    });
  }

  if (new Date(hotelData.completeTime) - new Date() > 0) {
    setCountDownTimer(calcRequiredTime(hotelData.completeTime));
  } else {
    completeTheBuild();
  }
}

// scene.meshes.forEach((mesh) => {
//   if (mesh.name === 'hotel') {
//     mesh.visibility = 1;
//   }
// });

// function hotelAction(scene) {
//   spaceHotel.actionManager = new ActionManager(scene);
//   spaceHotel.actionManager.registerAction(
//     new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
//       alert('Space Hotel clicked');
//     })
//   );
// }
