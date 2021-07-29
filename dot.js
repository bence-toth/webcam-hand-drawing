const createRandomDot = () => {
  const { random, PI: π } = Math;
  return {
    x: random() * viewportWidth,
    y: random() * viewportHeight,
    d: random() * 2 * π,
    s: dotSpeed,
  };
};

let dot = createRandomDot();

const handleOverflow = ({ position, bottomBoundary, topBoundary }) => {
  if (position < bottomBoundary) {
    return topBoundary;
  }
  if (position > topBoundary) {
    return bottomBoundary;
  }
  return position;
};

const deviateCourse = (d) =>
  d + (Math.random() * dotCourseDeviation - dotCourseDeviation / 2);

const moveDot = ({ x, y, d, s }) => {
  const { sin, cos } = Math;
  return {
    x: handleOverflow({
      position: x + cos(d) * s,
      bottomBoundary: 0,
      topBoundary: viewportWidth,
    }),
    y: handleOverflow({
      position: y + sin(d) * s,
      bottomBoundary: 0,
      topBoundary: viewportHeight,
    }),
    d: deviateCourse(d),
    s,
  };
};

setInterval(() => {
  dot = moveDot(dot);
}, 1000 / maxFrameRate);

// Exposes:
// - dot
