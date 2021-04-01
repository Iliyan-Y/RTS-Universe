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
  changeBuildingOpacity,
  resourceLabels,
} from './GuiElements';

export async function createStardustPit(
  scene,
  advancedTexture,
  stardustPitData,
  setStardustPitData,
  baseId
) {
  let stardustPit;
  let stardustPitMaterial = new StandardMaterial('pitMaterial', scene);
  stardustPitMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/grid.jpg'
  );

  let container = createGuiContainer(advancedTexture);

  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'pit.obj',
    scene,
    (newMeshes) => {
      stardustPit = mergeImportedMesh(newMeshes);
      stardustPit.name = 'STARDUST_PIT';
      stardustPit.material = stardustPitMaterial;
      stardustPit.position.z = -10;
      container.linkWithMesh(stardustPit);
      container.linkOffsetY = -90;
      stardustPit.visibility = stardustPitData.build ? 1 : 0.3;
      stardustPit.actionManager = new ActionManager(scene);
      stardustPit.actionManager.registerAction(
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
  let [timeLabel, powerLabel, starLabel, popLabel] = resourceLabels(
    container,
    'Stardust Pit',
    60,
    2,
    1,
    2
  );

  var constructBtn = GUI.Button.CreateSimpleButton(
    'Construct',
    stardustPitData.build ? 'Upgrade' : 'Build'
  );
  constructBtn.width = 0.4;
  constructBtn.height = 0.4;
  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);

  // --- functional section ---
  constructBtn.onPointerClickObservable.add(function () {
    stardustPitData.build ? startUpgrade() : startBuild();
  });

  let postBody = {
    buildingId: stardustPitData.id,
    baseId,
  };

  function startUpgrade() {
    axios
      .post('api/v1/base/upgradeBuilding', postBody)
      .then((res) => {
        constructBtn.textBlock.text = 'Upgrading';
        let updateData = stardustPitData;
        updateData.completeTime = res.data.completeTime;
        updateData.upgrade = true;
        setStardustPitData(updateData);
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishUpgrade
        );
      })
      .catch((err) => console.error(err.response.data.message));
  }

  function finishUpgrade() {
    if (!stardustPitData.upgrade) return;
    axios
      .post('api/v1/base/finishPitUpgrade', postBody)
      .then(() => {
        let newData = stardustPitData;
        newData.upgrade = false;
        setStardustPitData(newData);
        constructBtn.textBlock.text = 'Upgrade';
      })
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
  }

  function startBuild() {
    axios
      .get(`api/v1/base/${baseId}/build/pit`)
      .then((res) => {
        setStardustPitData(res.data);
        postBody.buildingId = res.data.id;
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishBuild
        );
      })
      .catch((err) => console.error(err.response.data.message));
    constructBtn.textBlock.text = 'Building';
  }

  function finishBuild() {
    if (stardustPitData.build) return;

    axios
      .post('api/v1/base/complete/pit', postBody)
      .then((res) => {
        if (res.status === 200) {
          let updateData = stardustPitData;
          updateData.build = true;
          setStardustPitData(updateData);
          changeBuildingOpacity(scene, 'STARDUST_PIT');
          constructBtn.textBlock.text = 'Upgrade';
        }
      })
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
  }

  function updateResources() {
    axios
      .get('api/v1/buildings/getCost/' + postBody.buildingId)
      .then((res) => {
        timeLabel.text = 'Time: ' + res.data.TIME * 60;
        powerLabel.text = powerLabel.text.slice(0, -1) + res.data.POWER;
        starLabel.text = starLabel.text.slice(0, -1) + res.data.STARDUST;
        popLabel.text = popLabel.text.slice(0, -1) + res.data.POPULATION;
      })
      .catch((err) => console.error(err.response.data.message));
  }

  // On load set the initial timer if required
  if (new Date(stardustPitData.completeTime) - new Date() > 0) {
    if (stardustPitData.upgrade) constructBtn.textBlock.text = 'Upgrading';
    setCountDownTimer(
      calcRequiredTime(stardustPitData.completeTime),
      container,
      stardustPitData.upgrade ? finishUpgrade : finishBuild
    );
  } else {
    stardustPitData.upgrade ? finishUpgrade() : finishBuild();
  }

  //Display required resources
  if (stardustPitData.build) updateResources();
}
