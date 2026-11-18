import React from 'react';
import {
  BODY_CELLS,
  MG_DL_PER_PARTICLE,
  SimulationState,
  VESSEL_BOUNDS,
} from '../model/glucoseModel';

interface BloodstreamStageProps {
  sim: SimulationState;
  nowMs: number;
}

function hexagonPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function diamondPoints(cx: number, cy: number, rx: number, ry: number): string {
  return `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;
}

export const BloodstreamStage: React.FC<BloodstreamStageProps> = ({
  sim,
  nowMs,
}) => {
  return (
    <section
      aria-label="Interactive bloodstream and body cells model"
      className="flex flex-col rounded-lg border border-slate-300 bg-white p-3.5"
    >
      {/* Top Legend & Particle Shape Key */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Bloodstream &amp; Nearby Body Cells
          </h2>
          <p className="text-[11px] text-slate-600">
            Classroom model view · Insulin opens all cells; exercise pushes glucose directly into muscle cells
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-800">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <polygon
                points={hexagonPoints(8, 8, 6)}
                fill="#f59e0b"
                stroke="#92400e"
                strokeWidth="1.5"
              />
            </svg>
            <span className="font-medium">
              Glucose ({MG_DL_PER_PARTICLE} mg/dL each)
            </span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <polygon
                points={diamondPoints(8, 8, 5.5, 6.5)}
                fill="#0284c7"
                stroke="#075985"
                strokeWidth="1.5"
              />
            </svg>
            <span className="font-medium">Insulin Signal (cell surface)</span>
          </div>
        </div>
      </div>

      {/* Main Bloodstream & Cells SVG */}
      <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-slate-50/70">
        <svg
          viewBox="0 0 860 366"
          className="block h-auto w-full select-none"
          role="img"
          aria-label={`Interactive bloodstream showing ${sim.vesselCount} glucose particles in the blood vessel (${sim.bloodGlucoseMgDl} mg/dL) and ${sim.cellStoredCount} glucose particles inside nearby body cells.`}
        >
          <defs>
            <linearGradient id="vesselPlasma" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="50%" stopColor="#fff1f2" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>
            <linearGradient id="cellCytoplasm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0fdfa" />
              <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          {/* Top Region: Digestion Inlet (left) & Pancreas Source (right) */}
          <g>
            {/* Digested food inlet pipe */}
            <path
              d="M 68 12 L 68 52 Q 68 82 100 84 L 120 84 L 120 58 Q 110 58 110 46 L 110 12 Z"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <text
              x="124"
              y="26"
              className="fill-amber-900 text-[11px] font-semibold"
            >
              From Digested Food
            </text>
            <text
              x="124"
              y="40"
              className="fill-slate-600 text-[10px]"
            >
              (Glucose enters vessel here)
            </text>
            {/* Arrow down inside inlet */}
            <path
              d="M 89 18 L 89 56 M 83 49 L 89 58 L 95 49"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pancreas source badge */}
            <rect
              x="646"
              y="10"
              width="184"
              height="40"
              rx="8"
              fill="#e0f2fe"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            <text
              x="738"
              y="27"
              textAnchor="middle"
              className="fill-sky-950 text-[11px] font-semibold"
            >
              Pancreas
            </text>
            <text
              x="738"
              y="41"
              textAnchor="middle"
              className="fill-sky-800 text-[10px]"
            >
              Releases Insulin Signals
            </text>
            <path
              d="M 738 50 L 738 74 M 733 67 L 738 75 L 743 67"
              fill="none"
              stroke="#0369a1"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Bloodstream / Blood Vessel */}
          <g>
            <rect
              x={VESSEL_BOUNDS.left}
              y={VESSEL_BOUNDS.top}
              width={VESSEL_BOUNDS.right - VESSEL_BOUNDS.left}
              height={VESSEL_BOUNDS.bottom - VESSEL_BOUNDS.top}
              rx="14"
              fill="url(#vesselPlasma)"
            />

            {/* Top Vessel Wall Boundary */}
            <line
              x1={VESSEL_BOUNDS.left + 8}
              y1={VESSEL_BOUNDS.top}
              x2={VESSEL_BOUNDS.right - 8}
              y2={VESSEL_BOUNDS.top}
              stroke="#be123c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Bottom Vessel Wall Boundary */}
            <line
              x1={VESSEL_BOUNDS.left + 8}
              y1={VESSEL_BOUNDS.bottom}
              x2={VESSEL_BOUNDS.right - 8}
              y2={VESSEL_BOUNDS.bottom}
              stroke="#be123c"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Subtle flow direction arrows inside plasma */}
            {[170, 340, 510, 680].map((fx) => (
              <path
                key={fx}
                d={`M ${fx} 134 L ${fx + 10} 142 L ${fx} 150`}
                fill="none"
                stroke="#fda4af"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Explicit Bloodstream & Vessel Wall labels */}
            <text
              x={VESSEL_BOUNDS.left + 16}
              y={VESSEL_BOUNDS.top - 7}
              className="fill-rose-900 text-[11px] font-semibold"
            >
              Vessel Wall (Upper Boundary)
            </text>
            <text
              x={430}
              y={102}
              textAnchor="middle"
              className="fill-rose-900/80 text-[12px] font-semibold tracking-wide"
            >
              BLOODSTREAM (BLOOD VESSEL)
            </text>
            <text
              x={VESSEL_BOUNDS.left + 16}
              y={VESSEL_BOUNDS.bottom + 14}
              className="fill-rose-900 text-[11px] font-semibold"
            >
              Vessel Wall (Lower Boundary)
            </text>
          </g>

          {/* Extracellular Space Label */}
          <text
            x="430"
            y="214"
            textAnchor="middle"
            className="fill-slate-600 text-[10px] font-medium"
          >
            Cell Surface Space (Insulin signals bind here)
          </text>

          {/* Three Nearby Body Cells */}
          {BODY_CELLS.map((cell) => {
            const isGateOpen = sim.gateOpenUntilMs[cell.index] > nowMs;
            return (
              <g key={cell.index}>
                {/* Cell body & Cell Boundary (Membrane) */}
                <rect
                  x={cell.x}
                  y={cell.y}
                  width={cell.width}
                  height={cell.height}
                  rx="22"
                  fill="url(#cellCytoplasm)"
                  stroke="#0f766e"
                  strokeWidth="3"
                />

                {/* Cell Boundary Label */}
                <text
                  x={cell.x + cell.width / 2}
                  y={cell.y + cell.height - 12}
                  textAnchor="middle"
                  className="fill-teal-950 text-[12px] font-semibold"
                >
                  {cell.label}
                </text>
                <text
                  x={cell.x + 14}
                  y={cell.y + cell.height - 12}
                  className="fill-teal-800 text-[9px] font-medium"
                >
                  Cell Boundary
                </text>

                {/* Insulin Receptor notch on cell surface */}
                <path
                  d={`M ${cell.receptorX - 11} ${cell.y - 6} L ${cell.receptorX - 7} ${cell.y + 4} L ${cell.receptorX + 7} ${cell.y + 4} L ${cell.receptorX + 11} ${cell.y - 6}`}
                  fill="#e0f2fe"
                  stroke="#0369a1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <text
                  x={cell.receptorX}
                  y={cell.y + 20}
                  textAnchor="middle"
                  className="fill-sky-900 text-[10px] font-semibold"
                >
                  Insulin Receptor
                </text>

                {/* Glucose Transporter Channel bridging Vessel Wall -> Cell Membrane */}
                <rect
                  x={cell.gateX - 14}
                  y={VESSEL_BOUNDS.bottom - 2}
                  width="28"
                  height={cell.y - VESSEL_BOUNDS.bottom + 8}
                  rx="4"
                  fill={isGateOpen ? '#dcfce7' : '#e2e8f0'}
                  stroke={isGateOpen ? '#059669' : '#64748b'}
                  strokeWidth="1.75"
                />
                {!isGateOpen && (
                  <line
                    x1={cell.gateX - 12}
                    y1={(VESSEL_BOUNDS.bottom + cell.y) / 2 + 2}
                    x2={cell.gateX + 12}
                    y2={(VESSEL_BOUNDS.bottom + cell.y) / 2 + 2}
                    stroke="#475569"
                    strokeWidth="3"
                  />
                )}
                <text
                  x={cell.gateX}
                  y={cell.y + 20}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold ${
                    isGateOpen ? 'fill-emerald-800' : 'fill-slate-600'
                  }`}
                >
                  {isGateOpen ? 'Gate OPEN' : 'Gate Closed'}
                </text>
              </g>
            );
          })}

          {/* Insulin Signal Particles (Diamonds at cell surface) */}
          {sim.insulinSignals.map((sig) => (
            <g key={`ins-${sig.id}`} opacity={sig.opacity}>
              <polygon
                points={diamondPoints(sig.x, sig.y, 7, 8.5)}
                fill="#0284c7"
                stroke="#075985"
                strokeWidth="1.75"
              />
              {sig.docked && (
                <circle
                  cx={sig.x}
                  cy={sig.y}
                  r="12"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.25"
                  opacity={0.5}
                />
              )}
            </g>
          ))}

          {/* Glucose Particles (Golden Hexagons) */}
          {sim.particles.map((p) => {
            if (p.opacity <= 0.01) return null;
            const inCell = p.phase === 'inside_cell';
            const exiting = p.phase === 'exiting_to_cell';
            return (
              <g key={`glu-${p.id}`} opacity={p.opacity}>
                {inCell && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="11"
                    fill="#fef3c7"
                    stroke="#0f766e"
                    strokeWidth="1"
                    opacity={0.7}
                  />
                )}
                <polygon
                  points={hexagonPoints(p.x, p.y, 7)}
                  fill={exiting ? '#fbbf24' : '#f59e0b'}
                  stroke={inCell ? '#065f46' : '#92400e'}
                  strokeWidth="1.6"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};
