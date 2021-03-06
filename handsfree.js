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
        const line1 = {
          from: convertLandmarkToCoordinates(hands[0]),
          to: convertLandmarkToCoordinates(hands[1]),
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 1,
        };
        const line2 = {
          from: convertLandmarkToCoordinates(hands[0]),
          to: dots[0],
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        const line3 = {
          from: dots[0],
          to: convertLandmarkToCoordinates(hands[1]),
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        const line4 = {
          from: convertLandmarkToCoordinates(hands[0]),
          to: dots[1],
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        const line5 = {
          from: dots[1],
          to: convertLandmarkToCoordinates(hands[1]),
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        const line6 = {
          from: convertLandmarkToCoordinates(hands[0]),
          to: dots[2],
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        const line7 = {
          from: dots[2],
          to: convertLandmarkToCoordinates(hands[1]),
          timestamp: now,
          hue: calculateHue(now, hueShiftSpeed),
          alpha: 0.035,
        };
        lines.push(line1, line2, line3, line4, line5, line6, line7);
      }
    });
    handsfree.start();
  },
  pause: () => handsfree.pause(),
  unpause: () => handsfree.unpause(),
};

// exposes:
// - handsfreeControls
