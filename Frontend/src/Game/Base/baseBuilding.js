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

export async function createBaseBuilding(scene) {
  let base;
  let baseMaterial = new StandardMaterial('baseMaterial', scene);
  baseMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/Hull.jpg'
  );
  //baseMaterial.diffuseColor = new Color3(0.6, 0.7, 0.7);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'base.glb',
    scene,
    (newMeshes) => {
      base = mergeImportedMesh(newMeshes);
      base.name = 'base';
      base.material = baseMaterial;
      base.position.z = 1.2;
      base.actionManager = new ActionManager(scene);
      base.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            alert('Base selected');
          }
        )
      );
    }
  );
}
