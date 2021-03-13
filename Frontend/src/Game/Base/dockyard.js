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

export async function createDockyard(scene) {
  let dockyard;
  let dockyardMaterial = new StandardMaterial('dockyardMaterial', scene);
  dockyardMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/bluebits-spec.jpg'
  );
  //dockyardMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'dockyard.glb',
    scene,
    (newMeshes) => {
      dockyard = mergeImportedMesh(newMeshes);
      dockyard.name = 'dockyard';
      dockyard.position = new Vector3(-10, 1.6, 1);
      dockyard.rotation.y = -6;
      dockyard.scaling = new Vector3(1.5, 1, 1.7);
      dockyard.material = dockyardMaterial;
      dockyard.actionManager = new ActionManager(scene);
      dockyard.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            alert('Dockyard selected');
          }
        )
      );
    }
  );
}
