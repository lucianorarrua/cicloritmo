import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useEffect } from 'preact/hooks';
import { ROUTINES } from '../data/routines.js';
import { SCREENS } from '../data/schema.js';

const AppContext = createContext(null);

// ──────────────────────────────────────────────
//  LocalStorage persistence
// ──────────────────────────────────────────────
const STORAGE_KEYS = {
  customRoutines:    'cr_custom_routines',
  customRoutine:     'cr_custom_routine',
  soundOn:           'cr_sound_on',
  tickSoundOn:       'cr_tick_sound_on',
  countdownSoundOn:  'cr_countdown_sound_on',
  volume:            'cr_volume',
};

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function loadPersistedState() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }
  const ls = window.localStorage;
  return {
    customRoutines:    safeParse(ls.getItem(STORAGE_KEYS.customRoutines), []),
    customRoutine:     safeParse(ls.getItem(STORAGE_KEYS.customRoutine), null),
    soundOn:           ls.getItem(STORAGE_KEYS.soundOn) === null ? true : ls.getItem(STORAGE_KEYS.soundOn) === 'true',
    tickSoundOn:       ls.getItem(STORAGE_KEYS.tickSoundOn) === null ? true : ls.getItem(STORAGE_KEYS.tickSoundOn) === 'true',
    countdownSoundOn:  ls.getItem(STORAGE_KEYS.countdownSoundOn) === null ? true : ls.getItem(STORAGE_KEYS.countdownSoundOn) === 'true',
    volume:            ls.getItem(STORAGE_KEYS.volume) === null ? 0.8 : Number(ls.getItem(STORAGE_KEYS.volume)),
  };
}

const persisted = loadPersistedState();

const DEFAULT_CUSTOM_ROUTINE = {
  title: "Rutina Creada por Mí",
  category: "suave",
  description: "Rutina personalizada con intervalos ajustados por el usuario.",
  intervals: []
};

const initialState = {
  screen: SCREENS.SELECTOR,
  categoryFilter: 'all',
  selectedRoutineKey: null,
  activeRoutine: null,
  activeIntervalIndex: 0,
  activeIntervalTimeLeft: 0,
  activeRoutineTotalTime: 0,
  globalTimeElapsed: 0,
  isPaused: true,
  isWorkoutActive: false,
  soundOn:           persisted.soundOn ?? true,
  tickSoundOn:       persisted.tickSoundOn ?? true,
  countdownSoundOn:  persisted.countdownSoundOn ?? true,
  volume:            persisted.volume ?? 0.8,
  estimatedCalories: 0,
  estimatedDistance: 0,
  customRoutine:     persisted.customRoutine || { ...DEFAULT_CUSTOM_ROUTINE },
  customRoutines:    persisted.customRoutines || [],
};

// Helper: look up a routine by key across built-ins and saved custom routines
function findRoutineByKey(state, key) {
  if (key === 'custom') {
    return state.customRoutine;
  }
  // Saved custom routines use a "custom:..." key prefix
  if (typeof key === 'string' && key.indexOf('custom:') === 0) {
    const id = key.slice('custom:'.length);
    return state.customRoutines.find(r => r.id === id);
  }
  return ROUTINES[key];
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.category };

    case 'SELECT_ROUTINE': {
      const routine = findRoutineByKey(state, action.key);
      if (!routine) return state;
      const totalTime = routine.intervals.reduce((acc, c) => acc + c.duration, 0);
      return {
        ...state,
        selectedRoutineKey: action.key,
        activeRoutine: routine,
        activeRoutineTotalTime: totalTime,
        screen: SCREENS.PREWORKOUT,
      };
    }

    case 'SET_AUDIO_OPTIONS':
      return {
        ...state,
        tickSoundOn: action.tickSoundOn,
        countdownSoundOn: action.countdownSoundOn,
      };

    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn };

    case 'START_WORKOUT':
      return {
        ...state,
        screen: SCREENS.WORKOUT,
        activeIntervalIndex: 0,
        activeIntervalTimeLeft: 0,
        globalTimeElapsed: 0,
        estimatedCalories: 0,
        estimatedDistance: 0,
        isPaused: false,
        isWorkoutActive: true,
      };

    case 'PAUSE_WORKOUT':
      return { ...state, isPaused: true };

    case 'RESUME_WORKOUT':
      return { ...state, isPaused: false };

    case 'TICK': {
      if (state.isPaused || !state.activeRoutine) return state;
      const intervals = state.activeRoutine.intervals;
      const idx = state.activeIntervalIndex;
      const interval = intervals[idx];
      const newTimeLeft = state.activeIntervalTimeLeft - 1;
      const newElapsed = state.globalTimeElapsed + 1;

      if (newTimeLeft <= 0) {
        if (idx + 1 < intervals.length) {
          const next = intervals[idx + 1];
          return {
            ...state,
            activeIntervalIndex: idx + 1,
            activeIntervalTimeLeft: next.duration,
            globalTimeElapsed: newElapsed,
          };
        } else {
          return {
            ...state,
            screen: SCREENS.SUMMARY,
            isWorkoutActive: false,
            globalTimeElapsed: newElapsed,
          };
        }
      }

      return {
        ...state,
        activeIntervalTimeLeft: newTimeLeft,
        globalTimeElapsed: newElapsed,
      };
    }

    case 'SET_INTERVAL_TIME':
      return { ...state, activeIntervalTimeLeft: action.timeLeft };

    case 'LOAD_INTERVAL': {
      const interval = state.activeRoutine?.intervals[action.index];
      if (!interval) return state;
      return {
        ...state,
        activeIntervalIndex: action.index,
        activeIntervalTimeLeft: interval.duration,
      };
    }

    case 'NEXT_INTERVAL': {
      if (!state.activeRoutine) return state;
      const idx = state.activeIntervalIndex;
      const intervals = state.activeRoutine.intervals;
      if (idx + 1 < intervals.length) {
        return {
          ...state,
          activeIntervalIndex: idx + 1,
          activeIntervalTimeLeft: intervals[idx + 1].duration,
          globalTimeElapsed: state.globalTimeElapsed + state.activeIntervalTimeLeft,
        };
      }
      return {
        ...state,
        screen: SCREENS.SUMMARY,
        isWorkoutActive: false,
      };
    }

    case 'PREV_INTERVAL': {
      if (!state.activeRoutine || state.activeIntervalIndex <= 0) return state;
      const idx = state.activeIntervalIndex;
      const intervals = state.activeRoutine.intervals;
      const prevInterval = intervals[idx - 1];
      const timeAdjustment = prevInterval.duration + (prevInterval.duration - state.activeIntervalTimeLeft);
      return {
        ...state,
        activeIntervalIndex: idx - 1,
        activeIntervalTimeLeft: intervals[idx - 1].duration,
        globalTimeElapsed: Math.max(0, state.globalTimeElapsed - timeAdjustment),
      };
    }

    case 'STOP_WORKOUT':
      return {
        ...state,
        screen: SCREENS.SELECTOR,
        isWorkoutActive: false,
        isPaused: true,
        activeRoutine: null,
        activeIntervalIndex: 0,
        activeIntervalTimeLeft: 0,
        globalTimeElapsed: 0,
      };

    case 'FINISH_WORKOUT':
      return {
        ...state,
        screen: SCREENS.SUMMARY,
        isWorkoutActive: false,
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        estimatedDistance: state.estimatedDistance + action.distance,
        estimatedCalories: state.estimatedCalories + action.calories,
      };

    // ── Custom routine (editing area) ──
    case 'ADD_CUSTOM_INTERVAL':
      return {
        ...state,
        customRoutine: {
          ...state.customRoutine,
          intervals: [...state.customRoutine.intervals, action.interval],
        },
      };

    case 'REMOVE_CUSTOM_INTERVAL': {
      const filtered = state.customRoutine.intervals.filter((_, i) => i !== action.index);
      return {
        ...state,
        customRoutine: { ...state.customRoutine, intervals: filtered },
      };
    }

    case 'SET_CUSTOM_INTERVALS':
      return {
        ...state,
        customRoutine: { ...state.customRoutine, intervals: action.intervals },
      };

    case 'SET_CUSTOM_ROUTINE':
      return { ...state, customRoutine: action.routine };

    case 'SET_CUSTOM_ROUTINE_FIELD':
      return {
        ...state,
        customRoutine: { ...state.customRoutine, [action.field]: action.value },
      };

    case 'RESET_CUSTOM_ROUTINE':
      return { ...state, customRoutine: { ...DEFAULT_CUSTOM_ROUTINE } };

    // ── Saved custom routines (persisted) ──
    case 'SAVE_CUSTOM_ROUTINE': {
      const id = action.id || ('custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
      const routine = { ...state.customRoutine, id };
      return {
        ...state,
        customRoutines: [...state.customRoutines, routine],
      };
    }

    case 'DELETE_CUSTOM_ROUTINE':
      return {
        ...state,
        customRoutines: state.customRoutines.filter(r => r.id !== action.id),
      };

    case 'RESET_WORKOUT_STATE':
      return {
        ...state,
        activeIntervalIndex: 0,
        activeIntervalTimeLeft: 0,
        globalTimeElapsed: 0,
        estimatedCalories: 0,
        estimatedDistance: 0,
        isPaused: true,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist relevant state slices to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const ls = window.localStorage;
    ls.setItem(STORAGE_KEYS.customRoutines, JSON.stringify(state.customRoutines));
  }, [state.customRoutines]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const ls = window.localStorage;
    ls.setItem(STORAGE_KEYS.customRoutine, JSON.stringify(state.customRoutine));
  }, [state.customRoutine]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const ls = window.localStorage;
    ls.setItem(STORAGE_KEYS.soundOn, String(state.soundOn));
    ls.setItem(STORAGE_KEYS.tickSoundOn, String(state.tickSoundOn));
    ls.setItem(STORAGE_KEYS.countdownSoundOn, String(state.countdownSoundOn));
    ls.setItem(STORAGE_KEYS.volume, String(state.volume));
  }, [state.soundOn, state.tickSoundOn, state.countdownSoundOn, state.volume]);

  const actions = {
    setScreen: useCallback((screen) => dispatch({ type: 'SET_SCREEN', screen }), []),
    setCategoryFilter: useCallback((category) => dispatch({ type: 'SET_CATEGORY_FILTER', category }), []),
    selectRoutine: useCallback((key) => dispatch({ type: 'SELECT_ROUTINE', key }), []),
    setAudioOptions: useCallback((tickSoundOn, countdownSoundOn) =>
      dispatch({ type: 'SET_AUDIO_OPTIONS', tickSoundOn, countdownSoundOn }), []),
    toggleSound: useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []),
    startWorkout: useCallback(() => dispatch({ type: 'START_WORKOUT' }), []),
    pauseWorkout: useCallback(() => dispatch({ type: 'PAUSE_WORKOUT' }), []),
    resumeWorkout: useCallback(() => dispatch({ type: 'RESUME_WORKOUT' }), []),
    tick: useCallback(() => dispatch({ type: 'TICK' }), []),
    setIntervalTime: useCallback((timeLeft) => dispatch({ type: 'SET_INTERVAL_TIME', timeLeft }), []),
    loadInterval: useCallback((index) => dispatch({ type: 'LOAD_INTERVAL', index }), []),
    nextInterval: useCallback(() => dispatch({ type: 'NEXT_INTERVAL' }), []),
    prevInterval: useCallback(() => dispatch({ type: 'PREV_INTERVAL' }), []),
    stopWorkout: useCallback(() => dispatch({ type: 'STOP_WORKOUT' }), []),
    finishWorkout: useCallback(() => dispatch({ type: 'FINISH_WORKOUT' }), []),
    updateMetrics: useCallback((distance, calories) =>
      dispatch({ type: 'UPDATE_METRICS', distance, calories }), []),
    addCustomInterval: useCallback((interval) =>
      dispatch({ type: 'ADD_CUSTOM_INTERVAL', interval }), []),
    removeCustomInterval: useCallback((index) =>
      dispatch({ type: 'REMOVE_CUSTOM_INTERVAL', index }), []),
    setCustomIntervals: useCallback((intervals) =>
      dispatch({ type: 'SET_CUSTOM_INTERVALS', intervals }), []),
    setCustomRoutine: useCallback((routine) =>
      dispatch({ type: 'SET_CUSTOM_ROUTINE', routine }), []),
    setCustomRoutineField: useCallback((field, value) =>
      dispatch({ type: 'SET_CUSTOM_ROUTINE_FIELD', field, value }), []),
    resetCustomRoutine: useCallback(() => dispatch({ type: 'RESET_CUSTOM_ROUTINE' }), []),
    saveCustomRoutine: useCallback((id) => dispatch({ type: 'SAVE_CUSTOM_ROUTINE', id }), []),
    deleteCustomRoutine: useCallback((id) => dispatch({ type: 'DELETE_CUSTOM_ROUTINE', id }), []),
    resetWorkoutState: useCallback(() => dispatch({ type: 'RESET_WORKOUT_STATE' }), []),
  };

  return (
    <AppContext.Provider value={{ state, actions, SCREENS }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { SCREENS };
