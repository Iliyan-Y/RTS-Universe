import * as GUI from '@babylonjs/gui';

export function createGuiContainer(advancedTexture) {
  var container = new GUI.Rectangle();
  container.width = 0.27;
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

export function resourceLabels(
  container,
  name,
  time,
  power,
  stardust,
  population
) {
  let resLabelLeft = '-36%';
  let resLabelTop = -20;

  var title = new GUI.TextBlock();
  title.text = name;
  title.top = '-35%';
  container.addControl(title);

  var reqLabel = new GUI.TextBlock();
  reqLabel.text = 'Requires';
  reqLabel.top = '-36%';
  reqLabel.left = '-36%';
  container.addControl(reqLabel);

  var timeLabel = new GUI.TextBlock();
  timeLabel.text = 'Time: ' + time;
  timeLabel.top = resLabelTop + '%';
  timeLabel.left = resLabelLeft;
  container.addControl(timeLabel);

  var powerLabel = new GUI.TextBlock();
  powerLabel.text = 'Pow: ' + power;
  powerLabel.top = (resLabelTop + 13).toString() + '%';
  powerLabel.left = resLabelLeft;
  container.addControl(powerLabel);

  var starLabel = new GUI.TextBlock();
  starLabel.text = 'Star: ' + stardust;
  starLabel.top = (resLabelTop + 2 * 13).toString() + '%';
  starLabel.left = resLabelLeft;
  container.addControl(starLabel);

  var popLabel = new GUI.TextBlock();
  popLabel.text = 'Pop: ' + population;
  popLabel.top = (resLabelTop + 3 * 13).toString() + '%';
  popLabel.left = resLabelLeft;
  container.addControl(popLabel);

  var closeBtn = GUI.Button.CreateSimpleButton('Close', 'X');
  closeBtn.width = 0.1;
  closeBtn.height = 0.2;
  closeBtn.color = 'red';
  closeBtn.cornerRadius = 5;
  closeBtn.thickness = 1.5;
  closeBtn.left = '45%';
  closeBtn.top = '-38%';
  container.addControl(closeBtn);
  closeBtn.onPointerClickObservable.add(function () {
    container.isVisible = false;
  });

  return [timeLabel, powerLabel, starLabel, popLabel, title];
}
