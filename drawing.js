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

initDrawing();
