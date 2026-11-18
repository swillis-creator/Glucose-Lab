/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  ExerciseOption,
  FoodOption,
  SimulationState,
  createInitialSimulationState,
  enqueueFoodParticles,
  stepSimulation,
  triggerExerciseUptake,
  triggerInsulinRelease,
} from './model/glucoseModel';
import { BloodstreamStage } from './components/BloodstreamStage';
import { CompactHistoryGraph } from './components/CompactHistoryGraph';
import { ControlPanel } from './components/ControlPanel';

export default function App() {
  const initialNow = typeof performance !== 'undefined' ? performance.now() : 0;
  const simRef = useRef<SimulationState>(createInitialSimulationState(initialNow));
  const [sim, setSim] = useState<SimulationState>(() => simRef.current);
  const [nowMs, setNowMs] = useState<number>(initialNow);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const frame = (timestamp: number) => {
      const next = stepSimulation(simRef.current, timestamp, reducedMotion);
      simRef.current = next;
      setSim(next);
      setNowMs(timestamp);
      rafId = window.requestAnimationFrame(frame);
    };
    rafId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleAddFood = (food: FoodOption) => {
    const now = performance.now();
    const next = enqueueFoodParticles(simRef.current, food, now, reducedMotion);
    simRef.current = next;
    setSim(next);
    setNowMs(now);
  };

  const handleExercise = (exercise: ExerciseOption) => {
    const now = performance.now();
    const next = triggerExerciseUptake(
      simRef.current,
      exercise,
      now,
      reducedMotion
    );
    simRef.current = next;
    setSim(next);
    setNowMs(now);
  };

  const handleReleaseInsulin = () => {
    const now = performance.now();
    const next = triggerInsulinRelease(simRef.current, now, reducedMotion);
    simRef.current = next;
    setSim(next);
    setNowMs(now);
  };

  const handleReset = () => {
    const now = performance.now();
    const fresh = createInitialSimulationState(now);
    simRef.current = fresh;
    setSim(fresh);
    setNowMs(now);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900">
      <a
        href="#simulator-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to simulator workspace
      </a>

      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-[1340px] items-center justify-between gap-6 px-4 py-2.5">
          <span className="text-base font-bold tracking-tight text-slate-950 whitespace-nowrap shrink-0">
            Glucose Lab: Back to Balance
          </span>

          <div className="hidden items-center gap-3 text-xs text-slate-600 sm:flex">
            <span>Single-screen bloodstream simulator</span>
            <span aria-hidden="true">·</span>
            <span>Simulated classroom model values</span>
          </div>
        </div>
      </header>

      <main
        id="simulator-workspace"
        className="mx-auto max-w-[1340px] px-4 py-3"
      >
        <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[336px_1fr]">
          {/* Compact Left Panel: Reading, Food Buttons, Exercise, Release Insulin, Reset */}
          <ControlPanel
            bloodGlucoseMgDl={sim.bloodGlucoseMgDl}
            vesselCount={sim.vesselCount}
            cellStoredCount={sim.cellStoredCount}
            statusMessage={sim.statusMessage}
            onAddFood={handleAddFood}
            onExercise={handleExercise}
            onReleaseInsulin={handleReleaseInsulin}
            onReset={handleReset}
          />

          {/* Large Right Interactive Bloodstream + Compact Secondary Trace */}
          <div className="flex min-w-0 flex-col gap-3">
            <BloodstreamStage sim={sim} nowMs={nowMs} />
            <CompactHistoryGraph
              history={sim.history}
              currentGlucoseMgDl={sim.bloodGlucoseMgDl}
              lastActionLabel={sim.lastActionLabel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
