import * as GUI from '@babylonjs/gui';

export function createGuiContainer(advancedTexture) {
  var container = new GUI.Rectangle();
  container.width = 0.25;
  container.height = 0.2;
  container.cornerRadius = 10;
  container.color = 'Orange';
  container.thickness = 1;
  container.isVisible = false;
  advancedTexture.addControl(container);
  return container;
}

export function calcRequiredTime(completeTime) {
  let convertedTime = new Date(completeTime);
  return Math.round((convertedTime - new Date()) / 1000) + 1;
}

export function setCountDownTimer(time, container, onFinish) {
  var timeToCount = time; // seconds
  var countDown = new GUI.TextBlock('text', new String(timeToCount));
  countDown.top = '33%';
  container.addControl(countDown);

  var timer = window.setInterval(() => {
    timeToCount--;
    countDown.text = new String(timeToCount);

    if (timeToCount === 0) {
      window.clearInterval(timer);
      onFinish();
      countDown.dispose();
    }
  }, 1000);
}

export function changeBuildingOpacity(scene, meshName) {
  scene.meshes.forEach((mesh) => {
    if (mesh.name === meshName) {
      mesh.visibility = 1;
    }
  });
}
