import { Mesh, PointerEventTypes } from '@babylonjs/core';

export function mergeImportedMesh(newMeshes) {
  let noRootMesh = [];
  newMeshes.forEach((mesh) => {
    if (mesh.name != '__root__') {
      noRootMesh.push(mesh);
    }
  });
  return Mesh.MergeMeshes(noRootMesh);
}

export function selectElement(scene) {
  let selected = null;
  scene.onPointerObservable.add((event) => {
    if (selected) {
      // selected.material.diffuseColor = new Color3(0.8, 0.8, 0.8);
      // selected.visibility = 1;
      selected = null;
    }
    if (
      event.pickInfo.hit &&
      event.pickInfo.pickedMesh &&
      event.event.button === 0
    ) {
      selected = event.pickInfo.pickedMesh;
      // selected.material.diffuseColor = Color3.Green();
      // selected.visibility = 0.1;
      console.log(selected.name);
    }
  }, PointerEventTypes.POINTERDOWN);
}
