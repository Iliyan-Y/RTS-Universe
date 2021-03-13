import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { mergeImportedMesh } from '../helpers';

export async function createHotel(scene) {
  let hotel;
  let hotelMaterial = new StandardMaterial('hotelMaterial', scene);
  hotelMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/brushedMetal.jpg'
  );
  //baseMaterial.diffuseColor = new Color3(0.6, 0.7, 0.7);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'hotel.glb',
    scene,
    (newMeshes) => {
      console.log(newMeshes.length);
      hotel = mergeImportedMesh(newMeshes);
      hotel.name = 'hotel';
      hotel.material = hotelMaterial;
      hotel.scaling = new Vector3(0.03, 0.03, 0.04);
      hotel.position = new Vector3(10, 3, -2);
      hotel.actionManager = new ActionManager(scene);
      hotel.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            alert('Hotel selected');
          }
        )
      );
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
