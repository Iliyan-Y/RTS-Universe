import {
  MeshBuilder,
  StandardMaterial,
  CubeTexture,
  Color3,
  Texture,
} from '@babylonjs/core';

export async function createSkyBox(scene) {
  var skyBox = MeshBuilder.CreateBox('skyBox', { size: 180 }, scene);
  var skyboxMaterial = new StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    '/assets/CosmosSkyBox/space',
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skyBox.material = skyboxMaterial;
}
