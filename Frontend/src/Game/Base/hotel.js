import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
  Color3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { mergeImportedMesh } from '../helpers';

export async function createHotel(scene) {
  let hotel;
  let hotelMaterial = new StandardMaterial('hotelMaterial', scene);
  //hotelMaterial.diffuseTexture = new Texture(
  //   '/assets/Buildings/textures/brushedMetal.jpg'
  // );
  // hotelMaterial.diffuseColor = new Color3(0.6, 0.7, 0.7);
  hotelMaterial.diffuseColor = new Color3(1, 0, 0);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'hotel.obj',
    scene,
    (newMeshes) => {
      newMeshes.forEach((mesh) => {
        mesh.scaling = new Vector3(0.03, 0.03, 0.04);
        mesh.name = 'hotel';
        mesh.position = new Vector3(8, 3, -2);
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(
          new ExecuteCodeAction(
            { trigger: ActionManager.OnPickUpTrigger },
            function () {
              alert('Hotel selected');
            }
          )
        );
      });
    }
  );
}

// function hotelAction(scene) {
//   spaceHotel.actionManager = new ActionManager(scene);
//   spaceHotel.actionManager.registerAction(
//     new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
//       alert('Space Hotel clicked');
//     })
//   );
// }
