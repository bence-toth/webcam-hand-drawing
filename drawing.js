let lines = [];

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.canvas.width = viewportWidth;
context.canvas.height = viewportHeight;

const getDiagonalLength = (width, height) => (width ** 2 + height ** 2) ** 0.5;

const viewportDiagonal = getDiagonalLength(viewportWidth, viewportHeight);

const draw = () => {
  if (!isHandsfreePaused) {
    // Clear canvas
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    // Delete lines too old
    const now = Date.now();
    lines = lines.filter((line) => now - line.timestamp < maxLineAge);

    // Render remaining lines
    lines.forEach((line) => {
      // Set path coordinates
      context.beginPath();
      context.moveTo(line.from.x, line.from.y);
      context.lineTo(line.to.x, line.to.y);

      // Set alpha
      const age = now - line.timestamp;
      const alpha = (maxLineAge - age) / maxLineAge;
      context.strokeStyle = `hsla(${line.hue}, 100%, 50%, ${(
        alpha * line.alpha
      ).toFixed(4)})`;

      // Set thickness
      const length = getDiagonalLength(
        line.from.x - line.to.x,
        line.from.y - line.to.y
      );
      const proportionalLength = length / viewportDiagonal;
      const thickness =
        minThickness + proportionalLength * (maxThickness - minThickness);
      context.lineWidth = thickness;

      // Draw stroke
      context.stroke();
    });
  }
};

const initDrawing = () => {
  handsfreeControls.start();
  setInterval(() => {
    window.requestAnimationFrame(draw);
  }, 1000 / maxFrameRate);
};

initDrawing();
