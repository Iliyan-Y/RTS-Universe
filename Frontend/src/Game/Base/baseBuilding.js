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
import * as GUI from '@babylonjs/gui';

export async function createBaseBuilding(scene, advancedTexture) {
  var rect1 = new GUI.Rectangle();
  rect1.width = 0.2;
  rect1.height = 0.1;
  rect1.cornerRadius = 10;
  rect1.color = 'Orange';
  rect1.thickness = 1;
  advancedTexture.addControl(rect1);

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

      rect1.linkWithMesh(base);
      rect1.linkOffsetY = -90;

      base.actionManager = new ActionManager(scene);
      base.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            let visible = !rect1.isVisible;
            rect1.isVisible = visible;
          }
        )
      );
    }
  );
}
