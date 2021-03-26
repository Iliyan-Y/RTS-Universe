import React, { useEffect, useState } from 'react';
import {
  ArcRotateCamera,
  Tools,
  Vector3,
  HemisphericLight,
} from '@babylonjs/core';
import SceneComponent from './SceneComponent';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import axios from 'axios';

import { createBaseBuilding } from './baseBuilding';
import { createDockyard } from './dockyard';
import { createHotel } from './hotel';
import { createStardustPit } from './stardustPit';
import { selectElement } from '../helpers';
import { createSkyBox } from './skyBox';

const Base = () => {
  let [baseData, setBaseData] = useState(null);
  let [hotelData, setHotelData] = useState({ build: false });
  let [dockyard, setDockyard] = useState({ build: false });
  let [stardustPit, setStardustPit] = useState({ build: false });
  let [sceneReady, setSceneReady] = useState();
  let [reload, setReaLoad] = useState(true);

  useEffect(() => {
    getBaseData();
    return console.log('clean');
  }, []);

  function getBaseData() {
    axios
      .get('api/v1/base/1')
      .then((res) => {
        setBaseData(res.data);
        getBuildingsData(res.data.buildings);
        setReaLoad(!reload);
      })
      .catch((err) => console.log(err.message));
  }

  function getBuildingsData(buildings) {
    if (buildings.length > 0) {
      buildings.forEach((building) => {
        if (building.type === 'SPACE_HOTEL') {
          setHotelData(building);
        }
        if (building.type === 'DOCKYARD') {
          setDockyard(building);
        }
        if (building.type === 'STARDUST_PIT') {
          setStardustPit(building);
        }
      });
    }
  }

  function setCamera(scene) {
    var camera = new ArcRotateCamera(
      'camera',
      Tools.ToRadians(125),
      Tools.ToRadians(60),
      25,
      new Vector3(0, 1, 3),
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
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    var light = new HemisphericLight('light', new Vector3(30, 9, 0), scene);
    light.intensity = 0.7;
    await createBaseBuilding(scene, advancedTexture);
    await createDockyard(scene);
    await createHotel(scene, advancedTexture, hotelData, setHotelData);
    await createStardustPit(scene);
    await createSkyBox(scene);
    //setSceneReady(scene);
    //on click select element
    //selectElement(scene);
  };

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
      <button onClick={() => console.log(baseData)}>Debug</button>
      <SceneComponent
        antialias
        reload={reload}
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </div>
  );
};

export default Base;
