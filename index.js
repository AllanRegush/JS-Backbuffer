var canvas = document.getElementById('gameCanvas');
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var gameStateMemory = new ArrayBuffer(8);
var gameState = new Float32Array(gameStateMemory);

var backbuff = new ArrayBuffer(imageData.data.length);
var backbuff8 = new Uint8ClampedArray(backbuff);
var backbuff32 = new Uint32Array(backbuff);

var secondsPassed;
var oldTimeStamp = 0;
var fps;

document.addEventListener('keypress', logKey);

function logKey(e) {
  switch(e.key) {
    case 'w': {
      gameState[0] -= 4;
    } break;
    case 's': {
      gameState[0] += 4;
    } break;
    case 'a': {
      gameState[1] -= 4;
    } break;
    case 'd': {
      gameState[1] += 4;
    } break;
  }
}

window.onload = function() {
  //const fps = 60;
  //setInterval(main, 1000/fps);
  timeStamp = new Date().getTime();
  window.requestAnimationFrame(main);
}

function main() {

  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Calculate fps
  fps = Math.round(1 / secondsPassed);
  update();
  render();
  window.requestAnimationFrame(main);
}

function update() {
  console.log(gameState[0]);
}

function drawRectangle(startX, startY, endX, endY, R, G, B, A) {
  for (let y = startY; y < endY; ++y) {
    for (let x = startX; x < endX; ++x) {
      backbuff32[y * canvasWidth + x] =
              (A << 24) |    // alpha
              (B << 16) |    // blue
              (G <<  8) |    // green
               R;            // red
    }
  }
}

function drawPoint(x, y, R, G, B, A) {
  backbuff32[y * canvasWidth + x] =
              (A << 24) |    // alpha
              (B << 16) |    // blue
              (G <<  8) |    // green
               R;            // red
}

function drawCircle(centerX, centerY, radius, R,G,B,A) {
  const diameter = radius * 2;

  let x = radius - 1;
  let y = 0;
  let tx = 1;
  let ty = 1;
  let error = tx - diameter;
  while (x >= y) {
    drawPoint(centerX + x, centerX - y, R, G, B, A);
    drawPoint(centerX + x, centerX + y, R, G, B, A);
    drawPoint(centerX - x, centerX - y, R, G, B, A);
    drawPoint(centerX - x, centerX + y, R, G, B, A);
    drawPoint(centerX + y, centerX - x, R, G, B, A);
    drawPoint(centerX + y, centerX + x, R, G, B, A);
    drawPoint(centerX - y, centerX - x, R, G, B, A);
    drawPoint(centerX - y, centerX + x, R, G, B, A);

    if (error <= 0) {
      ++y;
      error += ty;
      ty += 2;
    }

    if (error > 0) {
      --x;
      tx += 2;
      error += (tx - diameter);
    }
  }
}

function render() {
  drawRectangle(0, 0, canvasWidth, canvasHeight, 0, 0, Math.floor(gameState[0]), 255);
  drawRectangle(Math.floor(gameState[1]), Math.floor(gameState[0]) + 30, Math.floor(gameState[1]) + 100, Math.floor(gameState[0]) + 50, 255, 0, 0, 255);
  drawCircle(100, 100, 5, 255, 0, 0, 255);
  imageData.data.set(backbuff8);

  ctx.putImageData(imageData, 0, 0);
}

