// Frequently used globals
const width = window.innerWidth;
const height = window.innerHeight;

// Handsfree
const handsfree = new Handsfree({ showDebug: false, hands: true });
const handsfreeControls = {
  start: () => {
    handsfree.use("recordLine", (data) => {
      if (data?.hands?.multiHandedness?.length > 1) {
        const now = Date.now();
        const line = {
          from: {
            x: (1 - data?.hands?.landmarks[0][21]?.x) * width,
            y: data?.hands?.landmarks[0][21]?.y * height,
          },
          to: {
            x: (1 - data?.hands?.landmarks[1][21]?.x) * width,
            y: data?.hands?.landmarks[1][21]?.y * height,
          },
          timestamp: now,
          hue: Math.floor(now / 50) % 360,
        };
        lines.push(line);
      }
    });
    handsfree.start();
  },
  pause: handsfree.pause,
  unpause: handsfree.unpause,
};

// Controls
let isHandsfreePaused = false;
const pauseButton = document.getElementById("pauseButton");
const handlePauseButtonClick = () => {
  pauseButton.addEventListener("click", () => {
    if (isHandsfreePaused) {
      handsfreeControls.unpause();
      pauseButton.textContent = "Pause";
    } else {
      handsfreeControls.pause();
      pauseButton.textContent = "Continue";
    }
    isHandsfreePaused = !isHandsfreePaused;
  });
};

const initControls = () => {
  handlePauseButtonClick();
};

const maxLineAge = 3000;
const minThickness = 1;
const maxThickness = 5;

// Drawing
let lines = [];

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.canvas.width = width;
context.canvas.height = height;

const diagonal = (width ** 2 + height ** 2) ** 0.5;

const draw = () => {
  if (!isHandsfreePaused) {
    context.clearRect(0, 0, width, height);
    const now = Date.now();
    lines
      .filter((line) => now - line.timestamp < maxLineAge)
      .forEach((line) => {
        const age = now - line.timestamp;
        const alpha = (maxLineAge - age) / maxLineAge;
        const length =
          ((line.from.x - line.to.x) ** 2 + (line.from.y - line.to.y) ** 2) **
          0.5;
        const proportionalLength = length / diagonal;
        const thickness =
          minThickness + proportionalLength * (maxThickness - minThickness);
        context.beginPath();
        context.moveTo(line.from.x, line.from.y);
        context.lineTo(line.to.x, line.to.y);
        context.strokeStyle = `hsla(${line.hue}, 100%, 50%, ${alpha.toFixed(
          4
        )})`;
        context.lineWidth = thickness;
        context.stroke();
      });
  }
};

const initDrawing = () => {
  handsfreeControls.start();
  setInterval(() => {
    window.requestAnimationFrame(draw);
  }, 1000 / 60);
};

// Init

const init = () => {
  initControls();
  initDrawing();
};

init();
