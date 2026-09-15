import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIMonthlyTrendPoint } from '../../types/sst';

interface KPITrendLineChartProps {
  history?: KPIMonthlyTrendPoint[];
  monthlyGrowth?: number;
  polaridade?: 'MENOR_MELHOR' | 'MAIOR_MELHOR';
  statusColor?: string;
  unidadeMedida?: string;
  kpiId?: string;
}

export const KPITrendLineChart: React.FC<KPITrendLineChartProps> = ({
  history = [],
  monthlyGrowth,
  polaridade = 'MENOR_MELHOR',
  unidadeMedida = '',
  kpiId = 'trend'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ mes: string; valor: number; x: number; y: number } | null>(null);

  if (!history || history.length < 2) {
    return null;
  }

  // Determine if the monthly growth or decline is positive/favorable for safety
  // For 'MENOR_MELHOR' (e.g. accidents, frequency rate): decline (< 0) is good (green), growth (> 0) is bad (red)
  // For 'MAIOR_MELHOR' (e.g. inspection compliance, days without accidents): growth (> 0) is good (green), decline (< 0) is bad (red)
  const isPositiveGrowth = (monthlyGrowth ?? 0) > 0;
  const isNegativeGrowth = (monthlyGrowth ?? 0) < 0;
  const isNeutral = (monthlyGrowth ?? 0) === 0;

  let isFavorable = false;
  if (polaridade === 'MENOR_MELHOR') {
    isFavorable = isNegativeGrowth;
  } else {
    isFavorable = isPositiveGrowth;
  }

  const badgeColorClass = isNeutral
    ? 'bg-slate-800 text-slate-300 border-slate-700'
    : isFavorable
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

  const strokeColor = isNeutral
    ? '#94a3b8'
    : isFavorable
    ? '#10b981'
    : '#f43f5e';

  const gradientId = `trend-gradient-${kpiId}`;

  // Dimensions
  const width = 160;
  const height = 44;
  const paddingX = 8;
  const paddingTop = 6;
  const paddingBottom = 8;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const values = history.map((p) => p.valor);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1)) * innerWidth;
    const y = range === 0
      ? paddingTop + innerHeight / 2
      : paddingTop + innerHeight - ((item.valor - minVal) / range) * innerHeight;
    return { ...item, x, y };
  });

  // Build SVG path
  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    // Catmull-Rom or bezier smoothing
    const prev = points[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  // Fill area path (closing at bottom)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const fillD = `${pathD} L ${lastPoint.x} ${height - 2} L ${firstPoint.x} ${height - 2} Z`;

  const growthLabel = monthlyGrowth !== undefined
    ? `${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}% mês`
    : 'estável';

  return (
    <div className="w-full my-2 pt-2 pb-1 px-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
      {/* Mini header: Growth rate badge and 6-month context */}
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-slate-400 font-medium tracking-tight">
          Tendência (6m)
        </span>
        <div
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${badgeColorClass}`}
          title={`Crescimento/decréscimo no último mês: ${growthLabel}`}
        >
          {isPositiveGrowth ? (
            <TrendingUp className="w-2.5 h-2.5 shrink-0" />
          ) : isNegativeGrowth ? (
            <TrendingDown className="w-2.5 h-2.5 shrink-0" />
          ) : (
            <Minus className="w-2.5 h-2.5 shrink-0" />
          )}
          <span>{growthLabel}</span>
        </div>
      </div>

      {/* SVG Sparkline Chart */}
      <div className="relative w-full overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-11 overflow-visible block"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Baseline reference */}
          <line
            x1={paddingX}
            y1={height - 3}
            x2={width - paddingX}
            y2={height - 3}
            stroke="#334155"
            strokeDasharray="2 2"
            strokeWidth={0.7}
          />

          {/* Area fill */}
          <path d={fillD} fill={`url(#${gradientId})`} />

          {/* Trend line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points */}
          {points.map((pt, idx) => {
            const isLast = idx === points.length - 1;
            const isHovered = hoveredPoint?.mes === pt.mes;

            return (
              <g
                key={pt.mes}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
              >
                {/* Larger transparent target for easy touch/hover */}
                <circle cx={pt.x} cy={pt.y} r={8} fill="transparent" />

                {/* Highlight ring for current month */}
                {isLast && !isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={5}
                    fill={strokeColor}
                    fillOpacity={0.25}
                    className="animate-ping"
                  />
                )}

                {/* Visible dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : isLast ? 3.5 : 2}
                  fill={isHovered ? '#ffffff' : strokeColor}
                  stroke="#090d16"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute -top-7 pointer-events-none z-20 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-white font-mono shadow-md whitespace-nowrap transform -translate-x-1/2"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
            }}
          >
            <span className="text-amber-400 font-bold">{hoveredPoint.mes}:</span>{' '}
            {hoveredPoint.valor}{' '}
            <span className="text-[9px] text-slate-400">{unidadeMedida}</span>
          </div>
        )}
      </div>

      {/* Axis Labels (first, middle, last month) */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono px-1">
        <span>{history[0].mes}</span>
        <span className="text-slate-500 text-[8px]">histórico mensal</span>
        <span className="text-slate-200 font-semibold">{history[history.length - 1].mes}</span>
      </div>
    </div>
  );
};
