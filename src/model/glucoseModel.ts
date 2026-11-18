export interface FoodOption {
  id: string;
  name: string;
  incrementMgDl: number;
}

export const FOOD_OPTIONS: FoodOption[] = [
  { id: 'banana', name: 'Banana', incrementMgDl: 30 },
  { id: 'pasta', name: 'Pasta', incrementMgDl: 60 },
  { id: 'candy_bar', name: 'Candy Bar', incrementMgDl: 90 },
  { id: 'hamburger', name: 'Hamburger', incrementMgDl: 45 },
  { id: 'soda', name: 'Soda (20 oz)', incrementMgDl: 75 },
  { id: 'apple', name: 'Apple', incrementMgDl: 20 },
  { id: 'rice_bowl', name: 'Rice Bowl', incrementMgDl: 70 },
  { id: 'no_carb_snack', name: 'No-Carb Snack', incrementMgDl: 5 },
];

export interface ExerciseOption {
  id: string;
  name: string;
  decrementMgDl: number;
}

export const EXERCISE_OPTIONS: ExerciseOption[] = [
  { id: 'walk_15', name: 'Walk 15 min', decrementMgDl: 10 },
  { id: 'jog_15', name: 'Jog 15 min', decrementMgDl: 20 },
  { id: 'run_15', name: 'Run 15 min', decrementMgDl: 35 },
];

export const MUSCLE_CELL_INDICES = [0, 1] as const;

export const BASELINE_MG_DL = 70;
export const MG_DL_PER_PARTICLE = 5;
export const BASELINE_PARTICLE_COUNT = BASELINE_MG_DL / MG_DL_PER_PARTICLE; // 14 particles
export const INSULIN_UPTAKE_PARTICLES = 4; // 20 mg/dL per insulin click
export const TARGET_MIN_MG_DL = 70;
export const TARGET_MAX_MG_DL = 110;

export type GlucoseStatus = 'Balanced' | 'Elevated' | 'Low';

export function getGlucoseStatus(glucoseMgDl: number): GlucoseStatus {
  if (glucoseMgDl > TARGET_MAX_MG_DL) return 'Elevated';
  if (glucoseMgDl < TARGET_MIN_MG_DL) return 'Low';
  return 'Balanced';
}

export type FeelingState = 'happy' | 'neutral' | 'frown';

export interface GlucoseFeeling {
  state: FeelingState;
  label: string;
}

export function getGlucoseFeeling(glucoseMgDl: number): GlucoseFeeling {
  if (glucoseMgDl >= 70 && glucoseMgDl <= 100) {
    return { state: 'happy', label: 'Feels Good' };
  }
  if (
    (glucoseMgDl >= 55 && glucoseMgDl <= 69) ||
    (glucoseMgDl >= 101 && glucoseMgDl <= 140)
  ) {
    return {
      state: 'neutral',
      label: glucoseMgDl < 70 ? 'Feels Slightly Low' : 'Feels Slightly High',
    };
  }
  return {
    state: 'frown',
    label: glucoseMgDl < 55 ? 'Feels Too Low' : 'Feels Too High',
  };
}

export type ParticlePhase =
  | 'entering'
  | 'in_vessel'
  | 'exiting_to_cell'
  | 'inside_cell';

export interface GlucoseParticle {
  id: number;
  phase: ParticlePhase;
  x: number;
  y: number;
  vx: number;
  bobOffset: number;
  // For 'entering' phase
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  enterStartMs: number;
  enterDurationMs: number;
  // For insulin-claimed uptake
  claimedForUptake: boolean;
  targetCellIndex: number;
  uptakeStartMs: number;
  exitStartX: number;
  exitStartY: number;
  exitDurationMs: number;
  // For 'inside_cell' storage display
  cellRestX: number;
  cellRestY: number;
  cellEnteredMs: number;
  cellHoldDurationMs: number;
  opacity: number;
}

export interface InsulinSignalParticle {
  id: number;
  startX: number;
  startY: number;
  receptorX: number;
  receptorY: number;
  x: number;
  y: number;
  spawnMs: number;
  travelDurationMs: number;
  dockDurationMs: number;
  cellIndex: number;
  docked: boolean;
  opacity: number;
}

export interface HistoryPoint {
  index: number;
  elapsedSec: number;
  glucoseMgDl: number;
}

export interface CellGeometry {
  index: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  receptorX: number;
  receptorY: number;
  gateX: number;
  gateY: number;
}

export const VESSEL_BOUNDS = {
  left: 44,
  right: 816,
  top: 84,
  bottom: 196,
  innerTop: 100,
  innerBottom: 180,
  inletX: 90,
  inletY: 44,
  pancreasX: 742,
  pancreasY: 54,
};

export const BODY_CELLS: CellGeometry[] = [
  {
    index: 0,
    label: 'Muscle Cell 1',
    x: 48,
    y: 226,
    width: 226,
    height: 126,
    receptorX: 118,
    receptorY: 222,
    gateX: 202,
    gateY: 210,
  },
  {
    index: 1,
    label: 'Muscle Cell 2',
    x: 317,
    y: 226,
    width: 226,
    height: 126,
    receptorX: 387,
    receptorY: 222,
    gateX: 471,
    gateY: 210,
  },
  {
    index: 2,
    label: 'Liver Cell',
    x: 586,
    y: 226,
    width: 226,
    height: 126,
    receptorX: 656,
    receptorY: 222,
    gateX: 740,
    gateY: 210,
  },
];

export interface SimulationState {
  nextId: number;
  startedAtMs: number;
  lastTickMs: number;
  particles: GlucoseParticle[];
  insulinSignals: InsulinSignalParticle[];
  gateOpenUntilMs: [number, number, number];
  bloodGlucoseMgDl: number;
  vesselCount: number;
  cellStoredCount: number;
  statusMessage: string;
  history: HistoryPoint[];
  lastActionLabel: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function createInitialSimulationState(nowMs: number): SimulationState {
  const particles: GlucoseParticle[] = [];
  for (let i = 0; i < BASELINE_PARTICLE_COUNT; i++) {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const x = 105 + col * 102 + (row % 2) * 44;
    const y = 118 + row * 40 + ((i * 17) % 15) - 7;
    particles.push({
      id: i + 1,
      phase: 'in_vessel',
      x,
      y,
      vx: 16 + ((i * 7) % 10),
      bobOffset: i * 0.9,
      startX: x,
      startY: y,
      targetX: x,
      targetY: y,
      enterStartMs: nowMs,
      enterDurationMs: 0,
      claimedForUptake: false,
      targetCellIndex: 0,
      uptakeStartMs: 0,
      exitStartX: x,
      exitStartY: y,
      exitDurationMs: 480,
      cellRestX: x,
      cellRestY: y,
      cellEnteredMs: 0,
      cellHoldDurationMs: 2400,
      opacity: 1,
    });
  }

  return {
    nextId: BASELINE_PARTICLE_COUNT + 1,
    startedAtMs: nowMs,
    lastTickMs: nowMs,
    particles,
    insulinSignals: [],
    gateOpenUntilMs: [0, 0, 0],
    bloodGlucoseMgDl: BASELINE_MG_DL,
    vesselCount: BASELINE_PARTICLE_COUNT,
    cellStoredCount: 0,
    statusMessage:
      'Starting at 70 mg/dL baseline. Click a food or Release Insulin.',
    history: [{ index: 0, elapsedSec: 0, glucoseMgDl: BASELINE_MG_DL }],
    lastActionLabel: 'Baseline',
  };
}

export function enqueueFoodParticles(
  state: SimulationState,
  food: FoodOption,
  nowMs: number,
  reducedMotion: boolean
): SimulationState {
  const count = Math.max(1, Math.round(food.incrementMgDl / MG_DL_PER_PARTICLE));
  const newParticles: GlucoseParticle[] = [];
  let nextId = state.nextId;

  const staggerMs = reducedMotion ? 30 : 85;
  const enterDuration = reducedMotion ? 120 : 420;

  for (let i = 0; i < count; i++) {
    const id = nextId++;
    const startX = VESSEL_BOUNDS.inletX + ((i % 3) - 1) * 10;
    const startY = VESSEL_BOUNDS.inletY;
    const targetX = 110 + ((id * 67) % 630);
    const targetY = 108 + ((id * 29) % 64);

    newParticles.push({
      id,
      phase: 'entering',
      x: startX,
      y: startY,
      vx: 16 + ((id * 5) % 10),
      bobOffset: id * 0.7,
      startX,
      startY,
      targetX,
      targetY,
      enterStartMs: nowMs + i * staggerMs,
      enterDurationMs: enterDuration,
      claimedForUptake: false,
      targetCellIndex: 0,
      uptakeStartMs: 0,
      exitStartX: targetX,
      exitStartY: targetY,
      exitDurationMs: reducedMotion ? 120 : 480,
      cellRestX: 0,
      cellRestY: 0,
      cellEnteredMs: 0,
      cellHoldDurationMs: reducedMotion ? 1800 : 2400,
      opacity: 1,
    });
  }

  return {
    ...state,
    nextId,
    particles: [...state.particles, ...newParticles],
    statusMessage: `Glucose from digested food entered the bloodstream. (+${food.incrementMgDl} mg/dL from ${food.name})`,
    lastActionLabel: `${food.name} (+${food.incrementMgDl})`,
  };
}

export function triggerInsulinRelease(
  state: SimulationState,
  nowMs: number,
  reducedMotion: boolean
): SimulationState {
  const availableVessel = state.particles.filter(
    (p) => p.phase === 'in_vessel' && !p.claimedForUptake
  );

  let nextId = state.nextId;
  const travelDuration = reducedMotion ? 120 : 380;
  const dockDuration = reducedMotion ? 1100 : 1450;

  // Always animate insulin signals from pancreas to cell-surface receptors
  const newInsulinSignals: InsulinSignalParticle[] = BODY_CELLS.map((cell, idx) => ({
    id: nextId++,
    startX: VESSEL_BOUNDS.pancreasX,
    startY: VESSEL_BOUNDS.pancreasY,
    receptorX: cell.receptorX,
    receptorY: cell.receptorY,
    x: VESSEL_BOUNDS.pancreasX,
    y: VESSEL_BOUNDS.pancreasY,
    spawnMs: nowMs + idx * (reducedMotion ? 20 : 55),
    travelDurationMs: travelDuration,
    dockDurationMs: dockDuration,
    cellIndex: cell.index,
    docked: false,
    opacity: 1,
  }));

  if (availableVessel.length === 0) {
    return {
      ...state,
      nextId,
      insulinSignals: [...state.insulinSignals, ...newInsulinSignals],
      statusMessage:
        'Insulin signals reached cell receptors, but no glucose is left in the bloodstream to take in.',
      lastActionLabel: 'Release Insulin (0 mg/dL available)',
    };
  }

  const takeCount = Math.min(INSULIN_UPTAKE_PARTICLES, availableVessel.length);
  const uptakeMgDl = takeCount * MG_DL_PER_PARTICLE;

  // Pick particles already in the vessel, preferring ones closer to the lower half
  const sortedCandidates = [...availableVessel].sort((a, b) => b.y - a.y);
  const claimedIds = new Set<number>();
  const claimedTargets = new Map<
    number,
    { cellIndex: number; uptakeStartMs: number; cellRestX: number; cellRestY: number }
  >();

  for (let i = 0; i < takeCount; i++) {
    const p = sortedCandidates[i];
    const cellIndex = i % BODY_CELLS.length;
    const cell = BODY_CELLS[cellIndex];
    claimedIds.add(p.id);
    const slotOffset = Math.floor(i / BODY_CELLS.length);
    const cellRestX = cell.x + 56 + ((p.id * 37 + slotOffset * 48) % 120);
    const cellRestY = cell.y + 44 + ((p.id * 23) % 44);
    claimedTargets.set(p.id, {
      cellIndex,
      uptakeStartMs: nowMs + (reducedMotion ? 140 : 400) + i * (reducedMotion ? 40 : 120),
      cellRestX,
      cellRestY,
    });
  }

  const updatedParticles = state.particles.map((p) => {
    const claim = claimedTargets.get(p.id);
    if (!claim) return p;
    return {
      ...p,
      claimedForUptake: true,
      targetCellIndex: claim.cellIndex,
      uptakeStartMs: claim.uptakeStartMs,
      cellRestX: claim.cellRestX,
      cellRestY: claim.cellRestY,
    };
  });

  const gateDuration = reducedMotion ? 1200 : 1850;
  const gateOpenUntilMs: [number, number, number] = [
    Math.max(state.gateOpenUntilMs[0], nowMs + gateDuration),
    Math.max(state.gateOpenUntilMs[1], nowMs + gateDuration),
    Math.max(state.gateOpenUntilMs[2], nowMs + gateDuration),
  ];

  return {
    ...state,
    nextId,
    particles: updatedParticles,
    insulinSignals: [...state.insulinSignals, ...newInsulinSignals],
    gateOpenUntilMs,
    statusMessage: `Insulin signals cells to take in glucose. (-${uptakeMgDl} mg/dL moving into cells)`,
    lastActionLabel: `Release Insulin (-${uptakeMgDl})`,
  };
}

export function triggerExerciseUptake(
  state: SimulationState,
  exercise: ExerciseOption,
  nowMs: number,
  reducedMotion: boolean
): SimulationState {
  const availableVessel = state.particles.filter(
    (p) => p.phase === 'in_vessel' && !p.claimedForUptake
  );

  if (availableVessel.length === 0) {
    return {
      ...state,
      statusMessage:
        'No free-floating glucose left in the bloodstream for muscle cells to take in.',
      lastActionLabel: `${exercise.name} (0 mg/dL available)`,
    };
  }

  const requestedParticles = Math.max(
    1,
    Math.round(exercise.decrementMgDl / MG_DL_PER_PARTICLE)
  );
  const takeCount = Math.min(requestedParticles, availableVessel.length);
  const uptakeMgDl = takeCount * MG_DL_PER_PARTICLE;

  // Prefer free-floating glucose particles closest to the muscle cells (left/center lower vessel)
  const sortedCandidates = [...availableVessel].sort((a, b) => b.y - a.y);
  const claimedTargets = new Map<
    number,
    { cellIndex: number; uptakeStartMs: number; cellRestX: number; cellRestY: number }
  >();

  for (let i = 0; i < takeCount; i++) {
    const p = sortedCandidates[i];
    const cellIndex = MUSCLE_CELL_INDICES[i % MUSCLE_CELL_INDICES.length];
    const cell = BODY_CELLS[cellIndex];
    const slotOffset = Math.floor(i / MUSCLE_CELL_INDICES.length);
    const cellRestX = cell.x + 50 + ((p.id * 37 + slotOffset * 42) % 130);
    const cellRestY = cell.y + 44 + ((p.id * 23) % 44);

    claimedTargets.set(p.id, {
      cellIndex,
      uptakeStartMs:
        nowMs + (reducedMotion ? 60 : 140) + i * (reducedMotion ? 30 : 85),
      cellRestX,
      cellRestY,
    });
  }

  const updatedParticles = state.particles.map((p) => {
    const claim = claimedTargets.get(p.id);
    if (!claim) return p;
    return {
      ...p,
      claimedForUptake: true,
      targetCellIndex: claim.cellIndex,
      uptakeStartMs: claim.uptakeStartMs,
      cellRestX: claim.cellRestX,
      cellRestY: claim.cellRestY,
    };
  });

  // Exercise directly opens muscle cell gates (cells 0 and 1), leaving liver cell (2) unchanged
  const gateDuration = reducedMotion ? 1100 : 1650;
  const gateOpenUntilMs: [number, number, number] = [
    Math.max(state.gateOpenUntilMs[0], nowMs + gateDuration),
    Math.max(state.gateOpenUntilMs[1], nowMs + gateDuration),
    state.gateOpenUntilMs[2],
  ];

  return {
    ...state,
    particles: updatedParticles,
    gateOpenUntilMs,
    statusMessage: `Muscle cells take in glucose during ${exercise.name}. (-${uptakeMgDl} mg/dL moved into muscle cells)`,
    lastActionLabel: `${exercise.name} (-${uptakeMgDl})`,
  };
}

export function stepSimulation(
  state: SimulationState,
  nowMs: number,
  reducedMotion: boolean
): SimulationState {
  const dtSec = Math.min(0.05, Math.max(0, (nowMs - state.lastTickMs) / 1000));
  let changed = false;

  const nextParticles: GlucoseParticle[] = [];
  let vesselCount = 0;
  let cellStoredCount = 0;

  for (const p of state.particles) {
    if (p.phase === 'entering') {
      changed = true;
      if (nowMs < p.enterStartMs) {
        nextParticles.push({ ...p, opacity: 0 });
        continue;
      }
      const rawT =
        p.enterDurationMs <= 0
          ? 1
          : (nowMs - p.enterStartMs) / p.enterDurationMs;
      const t = Math.min(1, Math.max(0, rawT));
      const eased = easeOutCubic(t);
      const x = p.startX + (p.targetX - p.startX) * eased;
      const y = p.startY + (p.targetY - p.startY) * eased;

      if (t >= 1) {
        vesselCount++;
        nextParticles.push({
          ...p,
          phase: 'in_vessel',
          x: p.targetX,
          y: p.targetY,
          opacity: 1,
        });
      } else {
        nextParticles.push({
          ...p,
          x,
          y,
          opacity: Math.min(1, t * 3),
        });
      }
      continue;
    }

    if (p.phase === 'in_vessel') {
      if (p.claimedForUptake) {
        changed = true;
        const cell = BODY_CELLS[p.targetCellIndex];
        if (nowMs >= p.uptakeStartMs) {
          // Crosses out of the vessel toward the cell membrane gate!
          nextParticles.push({
            ...p,
            phase: 'exiting_to_cell',
            exitStartX: p.x,
            exitStartY: p.y,
            opacity: 1,
          });
        } else {
          // Gently steer toward the open cell gate while waiting for insulin dock
          const steerRate = Math.min(1, dtSec * 4.5);
          const x = p.x + (cell.gateX - p.x) * steerRate;
          const y = p.y + (VESSEL_BOUNDS.innerBottom - 6 - p.y) * steerRate;
          vesselCount++;
          nextParticles.push({ ...p, x, y, opacity: 1 });
        }
        continue;
      }

      vesselCount++;
      if (!reducedMotion && dtSec > 0) {
        changed = true;
        let x = p.x + p.vx * dtSec;
        if (x > VESSEL_BOUNDS.right - 14) {
          x = VESSEL_BOUNDS.left + 14;
        }
        const bob = Math.sin(nowMs / 750 + p.bobOffset) * 8;
        const baseTargetY = Math.max(
          VESSEL_BOUNDS.innerTop,
          Math.min(VESSEL_BOUNDS.innerBottom, p.targetY + bob)
        );
        nextParticles.push({
          ...p,
          x,
          y: baseTargetY,
          opacity: 1,
        });
      } else {
        nextParticles.push({ ...p, opacity: 1 });
      }
      continue;
    }

    if (p.phase === 'exiting_to_cell') {
      changed = true;
      const cell = BODY_CELLS[p.targetCellIndex];
      const rawT =
        p.exitDurationMs <= 0 ? 1 : (nowMs - p.uptakeStartMs) / p.exitDurationMs;
      const t = Math.min(1, Math.max(0, rawT));

      let x: number;
      let y: number;
      if (t < 0.45) {
        // First half: cross from vessel through cell gate at membrane
        const subT = easeInOutQuad(t / 0.45);
        x = p.exitStartX + (cell.gateX - p.exitStartX) * subT;
        y = p.exitStartY + (cell.y + 16 - p.exitStartY) * subT;
      } else {
        // Second half: enter cell cytoplasm and settle
        const subT = easeOutCubic((t - 0.45) / 0.55);
        x = cell.gateX + (p.cellRestX - cell.gateX) * subT;
        y = cell.y + 16 + (p.cellRestY - (cell.y + 16)) * subT;
      }

      if (t >= 1) {
        cellStoredCount++;
        nextParticles.push({
          ...p,
          phase: 'inside_cell',
          x: p.cellRestX,
          y: p.cellRestY,
          cellEnteredMs: nowMs,
          opacity: 1,
        });
      } else {
        nextParticles.push({ ...p, x, y, opacity: 1 });
      }
      continue;
    }

    // phase === 'inside_cell'
    changed = true;
    const elapsedInCell = nowMs - p.cellEnteredMs;
    if (elapsedInCell >= p.cellHoldDurationMs) {
      // Consumed/stored after visible pause inside cell
      continue;
    }
    const fadeStart = p.cellHoldDurationMs - 550;
    const opacity =
      elapsedInCell > fadeStart
        ? Math.max(0, 1 - (elapsedInCell - fadeStart) / 550)
        : 1;
    cellStoredCount++;
    nextParticles.push({ ...p, opacity });
  }

  // Update insulin signal diamonds (travel from pancreas to receptor, dock briefly, fade)
  const nextInsulinSignals: InsulinSignalParticle[] = [];
  for (const sig of state.insulinSignals) {
    changed = true;
    if (nowMs < sig.spawnMs) {
      nextInsulinSignals.push({ ...sig, opacity: 0 });
      continue;
    }
    const travelElapsed = nowMs - sig.spawnMs;
    if (travelElapsed < sig.travelDurationMs) {
      const t = easeOutCubic(travelElapsed / sig.travelDurationMs);
      nextInsulinSignals.push({
        ...sig,
        x: sig.startX + (sig.receptorX - sig.startX) * t,
        y: sig.startY + (sig.receptorY - sig.startY) * t,
        docked: false,
        opacity: 1,
      });
      continue;
    }

    const dockElapsed = travelElapsed - sig.travelDurationMs;
    if (dockElapsed < sig.dockDurationMs) {
      const fadeStart = sig.dockDurationMs - 350;
      const opacity =
        dockElapsed > fadeStart
          ? Math.max(0, 1 - (dockElapsed - fadeStart) / 350)
          : 1;
      nextInsulinSignals.push({
        ...sig,
        x: sig.receptorX,
        y: sig.receptorY,
        docked: true,
        opacity,
      });
    }
  }

  const nextGlucoseMgDl = vesselCount * MG_DL_PER_PARTICLE;
  let nextHistory = state.history;
  if (nextGlucoseMgDl !== state.bloodGlucoseMgDl) {
    const elapsedSec = Math.round(((nowMs - state.startedAtMs) / 1000) * 10) / 10;
    nextHistory = [
      ...state.history.slice(-39),
      {
        index: state.history[state.history.length - 1].index + 1,
        elapsedSec,
        glucoseMgDl: nextGlucoseMgDl,
      },
    ];
  }

  if (
    !changed &&
    nextGlucoseMgDl === state.bloodGlucoseMgDl &&
    nextInsulinSignals.length === state.insulinSignals.length
  ) {
    return { ...state, lastTickMs: nowMs };
  }

  return {
    ...state,
    lastTickMs: nowMs,
    particles: nextParticles,
    insulinSignals: nextInsulinSignals,
    bloodGlucoseMgDl: nextGlucoseMgDl,
    vesselCount,
    cellStoredCount,
    history: nextHistory,
  };
}
