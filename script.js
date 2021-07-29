let isHandsfreePaused = false;

const handsfree = new Handsfree({ showDebug: false, hands: true });
handsfree.start();

let lines = [];

handsfree.use("drawLine", (data) => {
  if (data?.hands?.multiHandedness?.length > 1) {
    const now = Date.now();
    const colorIndex = Math.floor(now / 500) % 6;
    const line = {
      from: {
        x: (1 - data?.hands?.landmarks[0][21]?.x) * context.canvas.width,
        y: data?.hands?.landmarks[0][21]?.y * context.canvas.height,
      },
      to: {
        x: (1 - data?.hands?.landmarks[1][21]?.x) * context.canvas.width,
        y: data?.hands?.landmarks[1][21]?.y * context.canvas.height,
      },
      timestamp: now,
      hue: Math.floor(now / 50) % 360,
    };
    lines.push(line);
  }
});

document.getElementById("stopButton").addEventListener("click", () => {
  if (isHandsfreePaused) {
    handsfree.unpause();
    document.getElementById("stopButton").textContent = "Stop";
  } else {
    handsfree.pause();
    document.getElementById("stopButton").textContent = "Start";
  }
  isHandsfreePaused = !isHandsfreePaused;
});

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const diagonal = (width ** 2 + height ** 2) ** 0.5;
context.canvas.width = width;
context.canvas.height = height;

const maxLineAge = 3000;
const minThickness = 1;
const maxThickness = 5;

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

setInterval(() => {
  window.requestAnimationFrame(draw);
}, 1000 / 60);
