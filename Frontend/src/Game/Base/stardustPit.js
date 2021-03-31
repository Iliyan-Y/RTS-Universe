import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { mergeImportedMesh } from '../helpers';

export async function createStardustPit(scene) {
  let stardustPit;
  let stardustPitMaterial = new StandardMaterial('pitMaterial', scene);
  stardustPitMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/grid.jpg'
  );

  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'pit.obj',
    scene,
    (newMeshes) => {
      stardustPit = mergeImportedMesh(newMeshes);
      stardustPit.name = 'stardustPit';
      stardustPit.material = stardustPitMaterial;
      stardustPit.position.z = -10;
      stardustPit.actionManager = new ActionManager(scene);
      stardustPit.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            alert('Stardust Pit selected');
          }
        )
      );
    }
  );
}
