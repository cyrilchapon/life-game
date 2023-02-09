export const createTicker = (frequency: number, callback: FrameRequestCallback) => {
  let startTime: number | null = null;
  let previousTime: number | null = null;
  let animationFrameId: number | null = null;

  const animationTick: FrameRequestCallback = (time) => {
    startTime ??= time;
    previousTime ??= time;

    const elapsed = time - previousTime;

    if (elapsed >= frequency) {
      callback(time);
      previousTime = time;
    }

    animationFrameId = requestAnimationFrame(animationTick);
  };

  const startAnimation = () => {
    if (animationFrameId == null) {
      startTime = null;
      previousTime = null;
      animationFrameId = requestAnimationFrame(animationTick);
    }
  };

  const stopAnimation = () => {
    if (animationFrameId != null) {
      cancelAnimationFrame(animationFrameId)
      startTime = null;
      previousTime = null;
      animationFrameId = null;
    }
  };

  const setFrequency = (newFrequency: number) => {
    frequency = newFrequency
  }

  return {
    start: startAnimation,
    stop: stopAnimation,
    setFrequency,
    _tick: animationTick
  }
}
