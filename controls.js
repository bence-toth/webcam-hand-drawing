// Controls
let isHandsfreePaused = false;
const pauseButton = document.getElementById("pauseButton");

const togglePausedState = () => {
  if (isHandsfreePaused) {
    handsfreeControls.unpause();
    pauseButton.textContent = "Pause";
  } else {
    handsfreeControls.pause();
    pauseButton.textContent = "Continue";
  }
  isHandsfreePaused = !isHandsfreePaused;
};

const handlePauseButtonClick = () => {
  pauseButton.addEventListener("click", togglePausedState);
};

const initControls = () => {
  handlePauseButtonClick();
};

const maxLineAge = 3000;
const minThickness = 1;
const maxThickness = 5;

initControls();

// exposes:
// - isHandsfreePaused
// - maxLineAge
// - minThickness
// - maxThickness
