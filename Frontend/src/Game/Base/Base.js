import React from 'react';
import {
  ArcRotateCamera,
  Tools,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  PointerEventTypes,
} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import '@babylonjs/loaders';

import { createBaseBuilding } from './baseBuilding';
import { createDockyard } from './dockyard';
import { createHotel } from './hotel';
import { createStardustPit } from './stardustPit';

const Base = () => {
  let selected = null;

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

  const onSceneReady = async (scene) => {
    setCamera(scene);
    var light = new HemisphericLight('light', new Vector3(0, 5, 0), scene);
    light.intensity = 0.7;
    await createBaseBuilding(scene);
    await createDockyard(scene);
    await createHotel(scene);
    await createStardustPit(scene);

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
