const handsfree = new Handsfree({ showDebug: false, hands: true });

const convertLandmarkToCoordinates = (landmark) => {
  const { x, y } = landmark ?? {};
  return {
    x: (1 - x) * viewportWidth,
    y: y * viewportHeight,
  };
};

const calculateHue = (timestamp, hueShiftSpeed) =>
  Math.floor((timestamp * hueShiftSpeed) / 1000) % 360;

const handsfreeControls = {
  start: () => {
    handsfree.use("recordLine", (data) => {
      if (data?.hands?.multiHandedness?.length > 1) {
        const now = Date.now();
        const hands = [
          data?.hands?.landmarks[0][21],
          data?.hands?.landmarks[1][21],
        ];
        const line = {
          from: convertLandmarkToCoordinates(hands[0]),
          to: convertLandmarkToCoordinates(hands[1]),
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
        };
        lines.push(line);
      }
    });
    handsfree.start();
  },
  pause: () => handsfree.pause(),
  unpause: () => handsfree.unpause(),
};

// exposes:
// - handsfreeControls
