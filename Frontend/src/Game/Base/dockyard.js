import {
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
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

export async function createDockyard(
  scene,
  advancedTexture,
  dockyardData,
  setDockyardData,
  baseId
) {
  let dockyard;
  let dockyardMaterial = new StandardMaterial('dockyardMaterial', scene);
  dockyardMaterial.diffuseTexture = new Texture(
    '/assets/Buildings/textures/bluebits-spec.jpg'
  );

  let container = createGuiContainer(advancedTexture);

  SceneLoader.ImportMesh(
    '',
    '/assets/Buildings/',
    'dockyard.glb',
    scene,
    (newMeshes) => {
      dockyard = mergeImportedMesh(newMeshes);
      dockyard.name = 'DOCKYARD';
      container.linkWithMesh(dockyard);
      container.linkOffsetY = -140;
      dockyard.position = new Vector3(-10, 1.6, 1);
      dockyard.rotation.y = -6;
      dockyard.visibility = dockyardData.build ? 1 : 0.3;
      dockyard.scaling = new Vector3(1.5, 1, 1.7);
      dockyard.material = dockyardMaterial;
      dockyard.actionManager = new ActionManager(scene);
      dockyard.actionManager.registerAction(
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
    'Dockyard',
    60,
    1,
    2,
    1
  );

  var constructBtn = GUI.Button.CreateSimpleButton(
    'Construct',
    dockyardData.build ? 'Upgrade' : 'Build'
  );
  constructBtn.width = 0.4;
  constructBtn.height = 0.4;
  constructBtn.color = 'Orange';
  constructBtn.cornerRadius = 12;
  constructBtn.thickness = 1.5;
  container.addControl(constructBtn);
  // --- functional section ---

  constructBtn.onPointerClickObservable.add(function () {
    dockyardData.build ? startUpgrade() : startBuild();
  });

  let postBody = {
    buildingId: dockyardData.id,
    baseId,
  };

  function startUpgrade() {
    axios
      .post('api/v1/base/upgradeBuilding', postBody)
      .then((res) => {
        constructBtn.textBlock.text = 'Upgrading';
        let updateData = dockyardData;
        updateData.completeTime = res.data.completeTime;
        updateData.upgrade = true;
        setDockyardData(updateData);
        setCountDownTimer(
          calcRequiredTime(res.data.completeTime),
          container,
          finishUpgrade
        );
      })
      .catch((err) => console.error(err.response.data.message));
  }

  function finishUpgrade() {
    if (!dockyardData.upgrade) return;
    axios
      .post('api/v1/base/finishDockyardUpgrade', postBody)
      .then(() => {
        let newData = dockyardData;
        newData.upgrade = false;
        setDockyardData(newData);
        constructBtn.textBlock.text = 'Upgrade';
      })
      .then(() => updateResources())
      .catch((err) => console.error(err.response.data.message));
  }

  function startBuild() {
    axios
      .get(`api/v1/base/${baseId}/build/dockyard`)
      .then((res) => {
        setDockyardData(res.data);
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
    if (dockyardData.build) return;

    axios
      .post('api/v1/base/complete/dockyard', postBody)
      .then((res) => {
        if (res.status === 200) {
          let updateData = dockyardData;
          updateData.build = true;
          setDockyardData(updateData);
          changeBuildingOpacity(scene, 'DOCKYARD');
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
  if (new Date(dockyardData.completeTime) - new Date() > 0) {
    if (dockyardData.upgrade) constructBtn.textBlock.text = 'Upgrading';
    setCountDownTimer(
      calcRequiredTime(dockyardData.completeTime),
      container,
      dockyardData.upgrade ? finishUpgrade : finishBuild
    );
  } else {
    dockyardData.upgrade ? finishUpgrade() : finishBuild();
  }

  //Display required resources
  if (dockyardData.build) updateResources();
}
