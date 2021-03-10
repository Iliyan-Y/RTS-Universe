import React from 'react';
import {
  ArcRotateCamera,
  Tools,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import '@babylonjs/loaders';

const Base = () => {
  let base;
  let dockyard;
  let spaceHotel;
  let stardustPit;

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
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 40;
    camera.setTarget(Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
  }

  const onSceneReady = (scene) => {
    setCamera(scene);
    var light = new HemisphericLight('light', new Vector3(0, 5, 0), scene);
    light.intensity = 0.7;
    base = MeshBuilder.CreateTorusKnot('base', { size: 0.5 }, scene);
    dockyard = MeshBuilder.CreateBox('dockyard', { size: 2 }, scene);

    spaceHotel = MeshBuilder.CreateCylinder('spaceHotel', { size: 1.4 }, scene);
    spaceHotel.scaling.y = 2;

    stardustPit = MeshBuilder.CreateTorus('stardustPit', { size: 1.5 }, scene);

    dockyard.position = new Vector3(-6, 0, 1);
    spaceHotel.position = new Vector3(5, 0, 2);
    stardustPit.position = new Vector3(-2, 0, -5);

    baseAction(scene);
    hotelAction(scene);
  };

  function baseAction(scene) {
    base.actionManager = new ActionManager(scene);
    base.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, function () {
        alert('Base clicked');
      })
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
