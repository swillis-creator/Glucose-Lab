import React from 'react';
import { RotateCcw, Syringe } from 'lucide-react';
import {
  BASELINE_MG_DL,
  EXERCISE_OPTIONS,
  ExerciseOption,
  FOOD_OPTIONS,
  FeelingState,
  FoodOption,
  GlucoseStatus,
  getGlucoseFeeling,
  getGlucoseStatus,
} from '../model/glucoseModel';

interface ControlPanelProps {
  bloodGlucoseMgDl: number;
  vesselCount: number;
  cellStoredCount: number;
  statusMessage: string;
  onAddFood: (food: FoodOption) => void;
  onExercise: (exercise: ExerciseOption) => void;
  onReleaseInsulin: () => void;
  onReset: () => void;
}

function StatusLabel({ status }: { status: GlucoseStatus }) {
  if (status === 'Elevated') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 whitespace-nowrap">
        <span aria-hidden="true">▲</span>
        <span>Elevated (&gt;110 mg/dL)</span>
      </span>
    );
  }
  if (status === 'Low') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 whitespace-nowrap">
        <span aria-hidden="true">▼</span>
        <span>Low (&lt;70 mg/dL)</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 whitespace-nowrap">
      <span aria-hidden="true">●</span>
      <span>Balanced (70–110 mg/dL)</span>
    </span>
  );
}

function PersonFeelingFace({
  feelingState,
  label,
}: {
  feelingState: FeelingState;
  label: string;
}) {
  const faceGradientId = `face-grad-${feelingState}`;
  const topColor =
    feelingState === 'happy'
      ? '#fde047'
      : feelingState === 'neutral'
        ? '#fcd34d'
        : '#fbbf24';
  const bottomColor =
    feelingState === 'happy'
      ? '#f59e0b'
      : feelingState === 'neutral'
        ? '#f59e0b'
        : '#fb7185';

  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        role="img"
        aria-label={`Person feeling indicator: ${label}`}
        className="shrink-0"
      >
        <defs>
          <radialGradient id={faceGradientId} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor={topColor} />
            <stop offset="100%" stopColor={bottomColor} />
          </radialGradient>
        </defs>

        {/* Face circle */}
        <circle
          cx="24"
          cy="24"
          r="21"
          fill={`url(#${faceGradientId})`}
          stroke="#92400e"
          strokeWidth="1.5"
        />

        {/* Expressive eyes matching reference style */}
        <circle cx="17" cy="19" r="5.2" fill="#ffffff" />
        <circle cx="31" cy="19" r="5.2" fill="#ffffff" />
        <circle cx="17" cy="19.5" r="2.6" fill="#1e293b" />
        <circle cx="31" cy="19.5" r="2.6" fill="#1e293b" />

        {/* Mouth: happy smile (70-100), straight line (55-69 / 101-140), frown (<55 / >140) */}
        {feelingState === 'happy' && (
          <path
            d="M 15.5 29 Q 24 37.5 32.5 29"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {feelingState === 'neutral' && (
          <line
            x1="16"
            y1="32"
            x2="32"
            y2="32"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {feelingState === 'frown' && (
          <path
            d="M 15.5 35 Q 24 27 32.5 35"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className="text-[10px] font-semibold text-slate-800 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  bloodGlucoseMgDl,
  vesselCount,
  cellStoredCount,
  statusMessage,
  onAddFood,
  onExercise,
  onReleaseInsulin,
  onReset,
}) => {
  const status = getGlucoseStatus(bloodGlucoseMgDl);
  const feeling = getGlucoseFeeling(bloodGlucoseMgDl);

  const meterColor =
    feeling.state === 'frown'
      ? 'border-rose-300 bg-rose-50/60'
      : feeling.state === 'neutral'
        ? 'border-amber-300 bg-amber-50/60'
        : 'border-emerald-300 bg-emerald-50/50';

  return (
    <aside
      aria-label="Blood glucose controls"
      className="flex flex-col justify-between gap-2.5 rounded-lg border border-slate-300 bg-white p-3"
    >
      {/* 1. Blood Glucose Reading & Live Status */}
      <section aria-label="Blood glucose reading">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold tracking-wide text-slate-600">
            Blood Glucose Reading
          </h2>
          <span className="font-mono text-[11px] text-slate-500 tabular-nums">
            Baseline {BASELINE_MG_DL} mg/dL
          </span>
        </div>

        <div
          className={`mt-1.5 flex items-center justify-between gap-3 rounded-md border px-3 py-2 ${meterColor}`}
        >
          <div className="min-w-0 flex-1">
            <div className="font-mono text-3xl font-bold tracking-tight text-slate-950 tabular-nums">
              {bloodGlucoseMgDl}{' '}
              <span className="text-sm font-medium text-slate-600">mg/dL</span>
            </div>
            <div className="mt-0.5">
              <StatusLabel status={status} />
            </div>
            <div className="mt-1 flex items-center gap-2.5 font-mono text-[11px] text-slate-700 tabular-nums">
              <span>In vessel: {vesselCount}</span>
              <span aria-hidden="true">·</span>
              <span>In cells: {cellStoredCount}</span>
            </div>
          </div>

          <PersonFeelingFace
            feelingState={feeling.state}
            label={feeling.label}
          />
        </div>

        <p
          role="status"
          aria-live="polite"
          className="mt-2 min-h-[38px] rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs leading-snug text-slate-800"
        >
          {statusMessage}
        </p>
      </section>

      {/* 2. Food Buttons */}
      <section aria-label="Choose food to digest">
        <div className="flex items-baseline justify-between gap-2 border-t border-slate-200 pt-2">
          <h2 className="text-sm font-semibold text-slate-900">Add Food</h2>
          <span className="text-[11px] text-slate-600">
            Classroom model values
          </span>
        </div>

        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {FOOD_OPTIONS.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => onAddFood(food)}
              aria-label={`Add ${food.name}, plus ${food.incrementMgDl} milligrams per deciliter classroom model value`}
              className="flex min-h-[38px] items-center justify-between gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-left transition-colors hover:border-amber-600 hover:bg-amber-50/70 active:bg-amber-100/70"
            >
              <span className="truncate text-xs font-medium text-slate-900">
                {food.name}
              </span>
              <span className="font-mono text-xs font-semibold text-amber-800 tabular-nums shrink-0">
                +{food.incrementMgDl}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Exercise Buttons */}
      <section aria-label="Exercise options that use blood glucose">
        <div className="flex items-baseline justify-between gap-2 border-t border-slate-200 pt-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Exercise (uses glucose)
          </h2>
          <span className="text-[11px] text-slate-600">Muscle uptake</span>
        </div>

        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {EXERCISE_OPTIONS.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onExercise(exercise)}
              aria-label={`${exercise.name}, minus ${exercise.decrementMgDl} milligrams per deciliter into muscle cells`}
              className="flex min-h-[38px] items-center justify-between gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-left transition-colors hover:border-teal-600 hover:bg-teal-50/70 active:bg-teal-100/70"
            >
              <span className="truncate text-xs font-medium text-slate-900">
                {exercise.name}
              </span>
              <span className="font-mono text-xs font-semibold text-teal-800 tabular-nums shrink-0">
                -{exercise.decrementMgDl}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Release Insulin & Reset Controls */}
      <section
        aria-label="Pancreas and reset controls"
        className="space-y-1.5 border-t border-slate-200 pt-2"
      >
        <div>
          <button
            type="button"
            onClick={onReleaseInsulin}
            className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800 active:bg-sky-900 whitespace-nowrap"
          >
            <Syringe className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Release Insulin</span>
          </button>
          <p className="mt-1 text-center text-[11px] text-slate-600">
            Pancreas signal: up to -20 mg/dL per click (limited by vessel glucose)
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 active:bg-slate-200 whitespace-nowrap"
        >
          <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Reset to 70 mg/dL</span>
        </button>
      </section>
    </aside>
  );
};
