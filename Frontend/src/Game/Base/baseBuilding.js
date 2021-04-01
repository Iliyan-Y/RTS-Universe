import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { mergeImportedMesh } from '../helpers';
import * as GUI from '@babylonjs/gui';
import axios from 'axios';

import {
  createGuiContainer,
  calcRequiredTime,
  setCountDownTimer,
  resourceLabels,
} from './GuiElements';

export async function createBaseBuilding(
  scene,
  advancedTexture,
  baseData,
  setBaseData
) {
  let base;
  let baseMaterial = new StandardMaterial('baseMaterial', scene);
  baseMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/Hull.jpg'
  );

  let container = createGuiContainer(advancedTexture);

  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'base.glb',
    scene,
    (newMeshes) => {
      base = mergeImportedMesh(newMeshes);
      base.name = 'BASE';
      base.material = baseMaterial;
      base.position.z = 1.2;
      container.linkWithMesh(base);
      container.linkOffsetY = -90;
      base.actionManager = new ActionManager(scene);
      base.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          function () {
            let visible = !container.isVisible;
            container.isVisible = visible;
          }
        )
      );
    }
  );

  // ---- Gui Elements Section ----
  let [timeLabel, powerLabel, starLabel, popLabel, title] = resourceLabels(
    container,
    'Base Level: ' + baseData.level,
    120,
    3,
    3,
    3
  );

  var constructBtn = GUI.Button.CreateSimpleButton('Construct', 'Upgrade');
  constructBtn.width = 0.4;
  constructBtn.height = 0.4;
  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);

  // --- functional section ---
  constructBtn.onPointerClickObservable.add(function () {
    startUpgrade();
  });

  function startUpgrade() {
    axios
      .get(`api/v1/base/${baseData.id}/upgrade`)
      .then((res) => {
        constructBtn.textBlock.text = 'Upgrading';
        baseData.upgrading = true; // required  for the finish fn
        setBaseData(res.data);
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishUpgrade
        );
      })
      .catch((err) => console.error(err.response.data.message));
  }

  function finishUpgrade() {
    if (!baseData.upgrading) return;
    axios
      .get(`api/v1/base/${baseData.id}/completeUpgrade`)
      .then(() => {
        let newData = baseData;
        newData.upgrading = false;
        newData.level += 1;
        title.text = 'Base Level: ' + newData.level;
        setBaseData(newData);
        constructBtn.textBlock.text = 'Upgrade';
      })
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
  }

  function updateResources() {
    axios
      .get('api/v1/base/' + baseData.id + '/getCost')
      .then((res) => {
        timeLabel.text = 'Time: ' + res.data.TIME * 60;
        powerLabel.text = powerLabel.text.slice(0, -1) + res.data.POWER;
        starLabel.text = starLabel.text.slice(0, -1) + res.data.STARDUST;
        popLabel.text = popLabel.text.slice(0, -1) + res.data.POPULATION;
      })
      .catch((err) => console.error(err.response.data.message));
  }

  // On load set the initial timer if required
  if (new Date(baseData.completeTime) - new Date() > 0) {
    if (baseData.upgrading) constructBtn.textBlock.text = 'Upgrading';
    setCountDownTimer(
      calcRequiredTime(baseData.completeTime),
      container,
      finishUpgrade
    );
  } else {
    finishUpgrade();
  }
  updateResources();
}
