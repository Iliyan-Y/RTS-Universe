import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';

export async function createHotel(
  scene,
  advancedTexture,
  hotelState,
  setHotelState
) {
  let guiContainer = createGui(advancedTexture, hotelState, setHotelState);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'hotel.obj',
    scene,
    (newMeshes) => {
      guiContainer.linkWithMesh(newMeshes[12]);
      guiContainer.linkOffsetY = -90;
      newMeshes.forEach((mesh) => {
        mesh.scaling = new Vector3(0.03, 0.03, 0.04);
        mesh.name = 'hotel';
        mesh.position = new Vector3(8, 3, -2);
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(
            { trigger: ActionManager.OnPickUpTrigger },
            function () {
              let visible = !guiContainer.isVisible;
              guiContainer.isVisible = visible;
            }
          )
        );
      });
    }
  );
}

function createGui(advancedTexture, hotelState, setHotelState) {
  var container = new GUI.Rectangle();
  container.width = 0.2;
  container.height = 0.1;
  container.cornerRadius = 10;
  container.color = 'Orange';
  container.thickness = 1;
  container.isVisible = false;
  advancedTexture.addControl(container);

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
    hotelState.isBuild ? 'Upgrade' : 'Build'
  );
  constructBtn.width = 0.35;
  constructBtn.height = 0.35;

  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);
  constructBtn.onPointerClickObservable.add(function () {
    if (!hotelState.isBuild) {
      setHotelState({ isBuild: true });
      constructBtn.textBlock.text = 'Upgrade';
    }
  });

  return container;
}

// function hotelAction(scene) {
//   spaceHotel.actionManager = new ActionManager(scene);
//   spaceHotel.actionManager.registerAction(
//     new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
//       alert('Space Hotel clicked');
//     })
//   );
// }
