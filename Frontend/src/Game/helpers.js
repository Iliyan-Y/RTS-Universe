import { Mesh } from '@babylonjs/core';

export function mergeImportedMesh(newMeshes) {
  let noRootMesh = [];
  newMeshes.forEach((mesh) => {
    if (mesh.name != '__root__') {
      noRootMesh.push(mesh);
    }
  });
  return Mesh.MergeMeshes(noRootMesh);
}
