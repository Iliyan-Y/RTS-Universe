import React from 'react';
import {
  ArcRotateCamera,
  Tools,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  Color3,
  StandardMaterial,
  PointerEventTypes,
  Texture,
  Mesh,
} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import '@babylonjs/loaders';

const Base = () => {
  let dockyard;
  let spaceHotel;
  let stardustPit;
  let selected = null;
  let base;

  function setCamera(scene) {
    var camera = new ArcRotateCamera(
      'camera',
      Tools.ToRadians(125),
      Tools.ToRadians(60),
      25,
      new Vector3(0, 3, -5),
      scene
    );
    camera.upperBetaLimit = Tools.ToRadians(75);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 30;
    camera.setTarget(Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
  }

  const onSceneReady = (scene) => {
    setCamera(scene);
    var light = new HemisphericLight('light', new Vector3(0, 5, 0), scene);
    light.intensity = 0.7;
    createBase(scene);

    dockyard = MeshBuilder.CreateBox('dockyard', { size: 2 }, scene);
    dockyard.material = new StandardMaterial('box_mat', scene);

    spaceHotel = MeshBuilder.CreateCylinder('spaceHotel', { size: 1.4 }, scene);
    spaceHotel.scaling.y = 2;

    stardustPit = MeshBuilder.CreateTorus('stardustPit', { size: 1.5 }, scene);

    dockyard.position = new Vector3(-6, 0, 1);
    spaceHotel.position = new Vector3(5, 0, 2);
    stardustPit.position = new Vector3(-2, 0, -5);

    hotelAction(scene);

    //on click select element
    selectElement(scene);
  };

  function selectElement(scene) {
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

  function createBase(scene) {
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
        let noRootMesh = [];
        newMeshes.forEach((mesh) => {
          if (mesh.name != '__root__') {
            noRootMesh.push(mesh);
          }
        });
        base = Mesh.MergeMeshes(noRootMesh);
        base.name = 'base';
        base.material = baseMaterial;
        base.scaling.y = 1.5;
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

  function hotelAction(scene) {
    spaceHotel.actionManager = new ActionManager(scene);
    spaceHotel.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
        alert('Space Hotel clicked');
      })
    );
  }

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene) => {
    // if (box !== undefined) {
    //   var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //   const rpm = 10;
    //   box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    // }
  };

  return (
    <div>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </div>
  );
};

export default Base;
