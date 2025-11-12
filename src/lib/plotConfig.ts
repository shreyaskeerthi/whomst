/**
 * Theme configuration and helpers for data-driven Issue Map plotting
 */

export const THEME = {
  colors: {
    ink: '#0B1020',
    paper: '#F6F8FF',
    grid: '#E6EFFF',
    axis: '#9CA3AF',
    label: '#374151',
    labelMuted: '#6B7280',
    you: '#10B981',
    top: '#3A7CFF',
    other: '#6B7280',
    legendBg: 'rgba(255,255,255,0.75)',
    leaderLine: '#94A3B8',
    tooltipBg: '#111827',
    tooltipText: '#E5E7EB',
    focusRing: '#0EA5E9'
  },
  radii: {
    you: 8,
    top: 6,
    other: 5
  },
  padding: {
    top: 72,
    right: 72,
    bottom: 81,
    left: 81
  },
  font: {
    baseSize: 12,
    tickSize: 11,
    labelSize: 12,
    axisSize: 12
  },
  axisText: {
    xLeft: 'LEFT',
    xRight: 'RIGHT',
    xTitle: 'ECONOMIC',
    yLow: 'LIBERTARIAN',
    yHigh: 'AUTHORITARIAN'
  }
};

/**
 * Compute a nice extent that includes all values and expands to round numbers.
 * Ensures at least [-10, 10] range if data falls within that.
 */
export function niceExtent(values: number[], pad: number = 0.5): [number, number] {
  if (values.length === 0) return [-10, 10];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // If range is very tight, expand symmetrically
  if (range < 2) {
    const center = (min + max) / 2;
    return [Math.floor(center - 2), Math.ceil(center + 2)];
  }

  // Expand by padding factor
  const expandedMin = min - range * pad;
  const expandedMax = max + range * pad;

  // Round to nice numbers
  const niceMin = Math.floor(expandedMin);
  const niceMax = Math.ceil(expandedMax);

  // Ensure we cover at least [-10, 10] if data is within
  const finalMin = Math.min(niceMin, -10);
  const finalMax = Math.max(niceMax, 10);

  return [finalMin, finalMax];
}

/**
 * Generate nice tick values between min and max.
 * Defaults to target of 5 ticks but adjusts for nice spacing.
 */
export function niceTicks(min: number, max: number, target: number = 5): number[] {
  const range = max - min;
  const roughStep = range / (target - 1);

  // Find a nice step size (1, 2, 5, 10, 20, 50, etc.)
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / magnitude;

  let niceStep: number;
  if (residual <= 1) niceStep = magnitude;
  else if (residual <= 2) niceStep = 2 * magnitude;
  else if (residual <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  // Generate ticks
  const ticks: number[] = [];
  const start = Math.ceil(min / niceStep) * niceStep;

  for (let tick = start; tick <= max; tick += niceStep) {
    // Round to avoid floating point issues
    ticks.push(Math.round(tick * 100) / 100);
  }

  // Ensure we always have at least the endpoints and 0 if it's in range
  if (!ticks.includes(min)) ticks.unshift(min);
  if (!ticks.includes(max)) ticks.push(max);
  if (min < 0 && max > 0 && !ticks.includes(0)) {
    ticks.push(0);
    ticks.sort((a, b) => a - b);
  }

  return ticks;
}

/**
 * Create linear scale function
 */
export function createScale(
  domain: [number, number],
  range: [number, number]
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const scale = (r1 - r0) / (d1 - d0);

  return (value: number) => r0 + (value - d0) * scale;
}

/**
 * Check if two rectangular boxes overlap
 */
export function boxesOverlap(
  box1: { x: number; y: number; width: number; height: number },
  box2: { x: number; y: number; width: number; height: number },
  padding: number = 4
): boolean {
  return !(
    box1.x > box2.x + box2.width + padding ||
    box1.x + box1.width < box2.x - padding ||
    box1.y > box2.y + box2.height + padding ||
    box1.y + box1.height < box2.y - padding
  );
}

/**
 * Calculate spiral position for label collision avoidance
 */
export function spiralPosition(
  cx: number,
  cy: number,
  attempt: number
): { x: number; y: number } {
  const angle = (attempt * 30) * (Math.PI / 180);
  const distance = 6 * (1 + Math.floor(attempt / 4));

  return {
    x: cx + Math.cos(angle) * distance,
    y: cy - Math.sin(angle) * distance
  };
}
