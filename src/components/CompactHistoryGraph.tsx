import React from 'react';
import { BASELINE_MG_DL, HistoryPoint } from '../model/glucoseModel';

interface CompactHistoryGraphProps {
  history: HistoryPoint[];
  currentGlucoseMgDl: number;
  lastActionLabel: string;
}

const W = 860;
const H = 112;
const MARGIN = { top: 12, right: 20, bottom: 22, left: 46 };
const PW = W - MARGIN.left - MARGIN.right;
const PH = H - MARGIN.top - MARGIN.bottom;

export const CompactHistoryGraph: React.FC<CompactHistoryGraphProps> = ({
  history,
  currentGlucoseMgDl,
  lastActionLabel,
}) => {
  const maxVal = Math.max(
    180,
    ...history.map((pt) => pt.glucoseMgDl + 15)
  );
  const yMin = 0;
  const yMax = Math.ceil(maxVal / 20) * 20;

  const yScale = (val: number) =>
    MARGIN.top + ((yMax - val) / (yMax - yMin)) * PH;

  const count = history.length;
  const xScale = (idx: number) => {
    if (count <= 1) return MARGIN.left + 12;
    return MARGIN.left + (idx / (count - 1)) * PW;
  };

  const yBaseline = yScale(BASELINE_MG_DL);
  const yTargetTop = yScale(110);
  const yTargetBottom = yScale(70);

  const pathD = history
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(pt.glucoseMgDl).toFixed(1)}`)
    .join(' ');

  const lastPt = history[history.length - 1];
  const lastX = xScale(history.length - 1);
  const lastY = yScale(lastPt.glucoseMgDl);

  const ticks = [0, 70, 110, yMax];

  return (
    <section
      aria-label="Blood glucose history graph"
      className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5"
    >
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xs font-semibold text-slate-900">
            Blood Glucose Trace (Simulated Classroom Model)
          </h3>
          <span className="text-[11px] text-slate-600">
            · Last action: {lastActionLabel}
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
          Current: {currentGlucoseMgDl} mg/dL
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full select-none"
        role="img"
        aria-label={`Line graph of simulated blood glucose over recent changes, currently at ${currentGlucoseMgDl} mg/dL`}
      >
        {/* Target Balance Band 70-110 mg/dL */}
        <rect
          x={MARGIN.left}
          y={yTargetTop}
          width={PW}
          height={Math.max(1, yTargetBottom - yTargetTop)}
          fill="#ecfdf5"
        />

        {/* Y Grid Ticks */}
        {ticks.map((tick) => {
          const y = yScale(tick);
          const isBaseline = tick === BASELINE_MG_DL;
          return (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                y1={y}
                x2={MARGIN.left + PW}
                y2={y}
                stroke={isBaseline ? '#64748b' : '#e2e8f0'}
                strokeWidth={isBaseline ? 1.25 : 1}
                strokeDasharray={isBaseline ? '4 3' : undefined}
              />
              <text
                x={MARGIN.left - 6}
                y={y + 3.5}
                textAnchor="end"
                className="fill-slate-600 font-mono text-[10px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + PH}
          stroke="#64748b"
          strokeWidth="1.25"
        />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + PH}
          x2={MARGIN.left + PW}
          y2={MARGIN.top + PH}
          stroke="#64748b"
          strokeWidth="1.25"
        />

        <text
          x={MARGIN.left + 6}
          y={yBaseline - 4}
          className="fill-slate-600 text-[9px] font-medium"
        >
          70 mg/dL Baseline
        </text>

        {/* Trace Line */}
        {history.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="#0369a1"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {history.map((pt, i) => (
          <circle
            key={pt.index}
            cx={xScale(i)}
            cy={yScale(pt.glucoseMgDl)}
            r={i === history.length - 1 ? 4 : 2.5}
            fill={i === history.length - 1 ? '#ffffff' : '#0369a1'}
            stroke="#0369a1"
            strokeWidth={i === history.length - 1 ? 2.5 : 1}
          />
        ))}

        {/* Current readout label near latest point */}
        <text
          x={Math.min(MARGIN.left + PW - 6, lastX + 8)}
          y={Math.max(MARGIN.top + 10, lastY - 6)}
          textAnchor={lastX > MARGIN.left + PW - 60 ? 'end' : 'start'}
          className="fill-slate-900 font-mono text-[10px] font-semibold"
        >
          {lastPt.glucoseMgDl}
        </text>

        <text
          x={MARGIN.left + PW / 2}
          y={H - 5}
          textAnchor="middle"
          className="fill-slate-600 text-[10px]"
        >
          Simulation Events (Reset to Restart Trace)
        </text>
      </svg>
    </section>
  );
};
