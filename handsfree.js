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

// exposes:
// - handsfreeControls
