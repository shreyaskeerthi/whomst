import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { MatchResult } from '../lib/score';
import {
  THEME,
  niceExtent,
  niceTicks,
  createScale,
  boxesOverlap,
  spiralPosition
} from '../lib/plotConfig';

interface Point {
  id: string;
  name: string;
  x: number;
  y: number;
  isTop: boolean;
  isUser?: boolean;
  match?: MatchResult;
}

interface IssueMapProps {
  user: { x: number; y: number };
  points: Point[];
  width?: number;
  height?: number;
}

interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
  pointX: number;
  pointY: number;
  label: string;
}

export const IssueMap: React.FC<IssueMapProps> = ({
  user,
  points,
  width: propWidth,
  height: propHeight
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isDesktop = window.innerWidth >= 1024;
        const aspectRatio = isDesktop ? 16 / 9 : 4 / 3;
        const newWidth = propWidth || Math.min(containerWidth, 800);
        const newHeight = propHeight || newWidth / aspectRatio;

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  const { width, height } = dimensions;
  const isMobile = width < 640;

  // Adjust theme for mobile
  const padding = isMobile
    ? { top: 54, right: 54, bottom: 72, left: 72 }
    : THEME.padding;
  const fontSize = isMobile ? THEME.font.baseSize - 1 : THEME.font.baseSize;
  const radii = isMobile
    ? { you: THEME.radii.you - 1, top: THEME.radii.top - 1, other: THEME.radii.other - 1 }
    : THEME.radii;

  // All points including user
  const allPoints = useMemo(() => {
    return [
      { ...user, id: 'user', name: 'You', isTop: false, isUser: true },
      ...points
    ];
  }, [user, points]);

  // Compute extents and scales
  const { xExtent, yExtent, sx, sy } = useMemo(() => {
    const xValues = allPoints.map(p => p.x);
    const yValues = allPoints.map(p => p.y);

    const xExtent = niceExtent(xValues);
    const yExtent = niceExtent(yValues);

    const sx = createScale(xExtent, [padding.left, width - padding.right]);
    const sy = createScale(yExtent, [height - padding.bottom, padding.top]);

    return { xExtent, yExtent, sx, sy };
  }, [allPoints, width, height, padding]);

  // Compute ticks
  const xTicks = useMemo(() => niceTicks(xExtent[0], xExtent[1], 5), [xExtent]);
  const yTicks = useMemo(() => niceTicks(yExtent[0], yExtent[1], 5), [yExtent]);

  // Add jitter to overlapping points
  const jitteredPoints = useMemo(() => {
    const coordMap = new Map<string, number>();
    return allPoints.map(point => {
      const key = `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
      const count = coordMap.get(key) || 0;
      coordMap.set(key, count + 1);

      const jitterX = count > 0 ? (Math.random() - 0.5) * 1.2 : 0;
      const jitterY = count > 0 ? (Math.random() - 0.5) * 1.2 : 0;

      return {
        ...point,
        displayX: point.x + jitterX,
        displayY: point.y + jitterY
      };
    });
  }, [allPoints]);

  // Collision-aware label placement
  const labelBoxes = useMemo(() => {
    const boxes: LabelBox[] = [];
    const labelHeight = fontSize + 4;

    jitteredPoints.forEach(point => {
      const cx = sx(point.displayX);
      const cy = sy(point.displayY);

      // Estimate label width
      const labelWidth = point.name.length * (fontSize * 0.6);

      let labelX = cx + 8;
      let labelY = cy - 8;

      // Check for collisions and adjust with spiral
      let attempts = 0;
      const maxAttempts = 60;

      const checkOverlap = (lx: number, ly: number) => {
        const testBox = { x: lx, y: ly, width: labelWidth, height: labelHeight };

        // Check against existing boxes
        if (boxes.some(box => boxesOverlap(testBox, box))) {
          return true;
        }

        // Check plot bounds
        if (
          lx < padding.left ||
          lx + labelWidth > width - padding.right ||
          ly < padding.top ||
          ly + labelHeight > height - padding.bottom
        ) {
          return true;
        }

        return false;
      };

      while (checkOverlap(labelX, labelY) && attempts < maxAttempts) {
        const spiral = spiralPosition(cx, cy, attempts);
        labelX = spiral.x;
        labelY = spiral.y;
        attempts++;
      }

      // Final clamp to bounds
      labelX = Math.max(
        padding.left + 2,
        Math.min(width - padding.right - labelWidth - 2, labelX)
      );
      labelY = Math.max(
        padding.top + 2,
        Math.min(height - padding.bottom - labelHeight - 2, labelY)
      );

      boxes.push({
        x: labelX,
        y: labelY,
        width: labelWidth,
        height: labelHeight,
        pointX: cx,
        pointY: cy,
        label: point.name
      });
    });

    return boxes;
  }, [jitteredPoints, sx, sy, width, height, padding, fontSize]);

  const handleMouseMove = (e: React.MouseEvent, point: Point) => {
    setHoveredPoint(point);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePointClick = (point: Point) => {
    setHighlightedId(point.id);
    setTimeout(() => setHighlightedId(null), 1000);

    if (point.isTop) {
      // Scroll to results
      const resultsEl = document.querySelector('[data-results]');
      resultsEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const exportToPNG = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const scale = (window.devicePixelRatio || 1) * 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'issue-map.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const legendItems = [
    { label: 'You', color: THEME.colors.you, radius: radii.you, strokeWidth: 2 },
    { label: 'Top 3', color: THEME.colors.top, radius: radii.top, strokeWidth: 1.5 },
    { label: 'Others', color: THEME.colors.other, radius: radii.other, strokeWidth: 1 }
  ];

  return (
    <div ref={containerRef} className="w-full bg-tavern-paper rounded-lg sheet grain">
      <h2 className="text-2xl font-display font-bold text-tavern-ink uppercase tracking-wide mb-2">
        Issue Map
      </h2>
      <p className="text-sm font-sans text-gray-600 mb-6">
        Your position and candidate positions based on policy similarity. Closer = more aligned.
      </p>

      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="mx-auto rounded-xl"
          style={{ border: `1px solid ${THEME.colors.grid}`, borderRadius: '12px' }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Background gradient and grain */}
          <defs>
            <radialGradient id="plotGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#F9FAFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#F3F6FF" stopOpacity="1" />
            </radialGradient>
            <filter id="grainFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend mode="multiply" in="SourceGraphic" />
            </filter>
          </defs>
          <rect x="0" y="0" width={width} height={height} fill="url(#plotGradient)" rx="12" />
          <rect x="0" y="0" width={width} height={height} fill="white" opacity="0.02" filter="url(#grainFilter)" rx="12" />

          {/* Grid lines */}
          {xTicks
            .filter(t => t !== 0)
            .map(tick => (
              <line
                key={`xgrid-${tick}`}
                x1={sx(tick)}
                y1={padding.top}
                x2={sx(tick)}
                y2={height - padding.bottom}
                stroke={THEME.colors.grid}
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />
            ))}
          {yTicks
            .filter(t => t !== 0)
            .map(tick => (
              <line
                key={`ygrid-${tick}`}
                x1={padding.left}
                y1={sy(tick)}
                x2={width - padding.right}
                y2={sy(tick)}
                stroke={THEME.colors.grid}
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />
            ))}

          {/* Zero lines (thicker) */}
          {xExtent[0] < 0 && xExtent[1] > 0 && (
            <line
              x1={sx(0)}
              y1={padding.top}
              x2={sx(0)}
              y2={height - padding.bottom}
              stroke={THEME.colors.axis}
              strokeWidth="1.5"
            />
          )}
          {yExtent[0] < 0 && yExtent[1] > 0 && (
            <line
              x1={padding.left}
              y1={sy(0)}
              x2={width - padding.right}
              y2={sy(0)}
              stroke={THEME.colors.axis}
              strokeWidth="1.5"
            />
          )}

          {/* Tick labels */}
          {xTicks.map(tick => (
            <text
              key={`xtick-${tick}`}
              x={sx(tick)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize={THEME.font.tickSize}
              fontFamily="IBM Plex Mono, monospace"
              fill={THEME.colors.labelMuted}
            >
              {tick}
            </text>
          ))}
          {yTicks.map(tick => (
            <text
              key={`ytick-${tick}`}
              x={padding.left - 20}
              y={sy(tick)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={THEME.font.tickSize}
              fontFamily="IBM Plex Mono, monospace"
              fill={THEME.colors.labelMuted}
            >
              {tick}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={padding.left}
            y={height - 20}
            textAnchor="start"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fontVariant="small-caps"
            fill={THEME.colors.label}
          >
            {THEME.axisText.xLeft}
          </text>
          <text
            x={width / 2}
            y={height - 20}
            textAnchor="middle"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            fontVariant="small-caps"
            fill={THEME.colors.label}
          >
            {THEME.axisText.xTitle}
          </text>
          <text
            x={width - padding.right}
            y={height - 20}
            textAnchor="end"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fontVariant="small-caps"
            fill={THEME.colors.label}
          >
            {THEME.axisText.xRight}
          </text>

          <text
            x={10}
            y={sy(3)}
            textAnchor="start"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fontVariant="small-caps"
            fill={THEME.colors.label}
            dominantBaseline="middle"
          >
            {THEME.axisText.yHigh}
          </text>
          <text
            x={10}
            y={sy(-3)}
            textAnchor="start"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fontVariant="small-caps"
            fill={THEME.colors.label}
            dominantBaseline="middle"
          >
            {THEME.axisText.yLow}
          </text>

          {/* Points and labels */}
          {jitteredPoints.map((point, idx) => {
            const cx = sx(point.displayX);
            const cy = sy(point.displayY);
            const isHighlighted = highlightedId === point.id;
            const isHovered = hoveredPoint?.id === point.id;
            const shouldDim = hoveredPoint && hoveredPoint.id !== point.id;

            let radius = point.isUser
              ? radii.you
              : point.isTop
              ? radii.top
              : radii.other;
            if (isHighlighted) radius *= 1.3;
            if (isHovered) radius *= 1.15;

            const fill = point.isUser
              ? THEME.colors.you
              : point.isTop
              ? THEME.colors.top
              : THEME.colors.other;

            const strokeWidth = point.isUser ? 2 : point.isTop ? 1.5 : 1;
            const labelColor = point.isUser
              ? '#059669'
              : point.isTop
              ? '#1F3A8A'
              : THEME.colors.labelMuted;

            const opacity = shouldDim ? 0.6 : 1;

            const labelBox = labelBoxes[idx];
            const needsLeader =
              labelBox && Math.hypot(labelBox.x - cx, labelBox.y - cy) > 10;

            return (
              <g key={point.id}>
                {/* Leader line - only show when label is shown */}
                {needsLeader && (point.isUser || isHovered) && (
                  <line
                    x1={cx}
                    y1={cy}
                    x2={labelBox.x}
                    y2={labelBox.y + fontSize / 2}
                    stroke={THEME.colors.leaderLine}
                    strokeWidth="0.75"
                    opacity={opacity}
                    style={{ transition: 'opacity 0.2s ease' }}
                  />
                )}

                {/* Hit area for accessibility */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseMove={e => handleMouseMove(e, point)}
                  onClick={() => handlePointClick(point)}
                  tabIndex={0}
                  aria-label={point.name}
                  style={{ outline: 'none' }}
                  onFocus={e => {
                    const sibling = e.currentTarget.nextElementSibling;
                    if (sibling) {
                      sibling.setAttribute('stroke', THEME.colors.focusRing);
                      sibling.setAttribute('stroke-width', '3');
                    }
                  }}
                  onBlur={e => {
                    const sibling = e.currentTarget.nextElementSibling;
                    if (sibling) {
                      sibling.setAttribute('stroke', 'white');
                      sibling.setAttribute('stroke-width', String(strokeWidth));
                    }
                  }}
                />

                {/* Actual point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={fill}
                  stroke="white"
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  style={{ transition: 'all 0.2s ease' }}
                  pointerEvents="none"
                />

                {/* Label - only show for user or when hovered */}
                {labelBox && (point.isUser || isHovered) && (
                  <text
                    x={labelBox.x}
                    y={labelBox.y + fontSize}
                    fontSize={fontSize}
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight={point.isUser || point.isTop ? 700 : 600}
                    fill={labelColor}
                    opacity={opacity}
                    style={{ transition: 'opacity 0.2s ease' }}
                    pointerEvents="none"
                  >
                    {point.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          {!isMobile && (
            <foreignObject
              x={width - padding.right - 145}
              y={padding.top + 10}
              width="145"
              height="85"
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  padding: '12px',
                  width: '100%',
                  height: '100%'
                }}
              >
                {legendItems.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: i < legendItems.length - 1 ? '8px' : '0'
                    }}
                  >
                    <div
                      style={{
                        width: `${item.radius * 2}px`,
                        height: `${item.radius * 2}px`,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        border: `${item.strokeWidth}px solid white`,
                        flexShrink: 0
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'IBM Plex Mono, monospace',
                        color: THEME.colors.label
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </foreignObject>
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && hoveredPoint.match && (() => {
          // Get top 3 best and worst topics
          const topicEntries = Object.entries(hoveredPoint.match.topicScores)
            .sort((a, b) => b[1] - a[1]);
          const bestTopics = topicEntries.slice(0, 3).map(([topic]) => topic);
          const worstTopics = topicEntries.slice(-3).reverse().map(([topic]) => topic);

          return (
            <div
              className="absolute rounded-lg shadow-xl p-3 max-w-xs z-10 text-xs pointer-events-none"
              style={{
                left: Math.min(tooltipPos.x + 20, width - 200),
                top: tooltipPos.y - 80,
                backgroundColor: THEME.colors.tooltipBg,
                color: THEME.colors.tooltipText,
                transition: 'all 0.2s ease'
              }}
            >
              <div className="font-semibold mb-1">{hoveredPoint.name}</div>
              <div className="text-gray-300">
                <span className="text-green-400">Align on:</span>{' '}
                {bestTopics.join(', ')}
              </div>
              <div className="text-gray-300 mt-1">
                <span className="text-red-400">Differ on:</span>{' '}
                {worstTopics.join(', ')}
              </div>
              <div className="text-gray-400 mt-1">
                Score: {hoveredPoint.match.normalizedScore.toFixed(1)}/10
              </div>
            </div>
          );
        })()}
      </div>

      {/* Mobile legend */}
      {isMobile && (
        <div className="mt-4 flex justify-center gap-4 text-xs">
          {legendItems.map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: item.radius * 2,
                  height: item.radius * 2,
                  backgroundColor: item.color,
                  border: `${item.strokeWidth}px solid white`
                }}
              />
              <span className="font-mono">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Export button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={exportToPNG}
          className="px-4 py-2 text-sm font-mono text-white transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #3A7CFF 0%, #0B5CFF 100%)',
            borderRadius: '2px',
            border: 'none'
          }}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
};
