import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { mergeImportedMesh } from '../helpers';

export async function createDockyard(scene) {
  let dockyard;
  let dockyardMaterial = new StandardMaterial('dockyardMaterial', scene);
  dockyardMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/foil.jpg'
  );

  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'dockyard.obj',
    scene,
    (newMeshes) => {
      dockyard = mergeImportedMesh(newMeshes);
      dockyard.name = 'dockyard';
      dockyard.material = dockyardMaterial;
      dockyard.position = new Vector3(-8, 0, 1);
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
