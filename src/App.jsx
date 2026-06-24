import { useApp, SCREENS } from './state/store.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Selector } from './screens/Selector.jsx';
import { PreWorkout } from './screens/PreWorkout.jsx';
import { Creator } from './screens/Creator.jsx';
import { Workout } from './screens/Workout.jsx';
import { Summary } from './screens/Summary.jsx';
import { StopModal } from './components/StopModal.jsx';

const SCREEN_MAP = {
  [SCREENS.SELECTOR]: Selector,
  [SCREENS.PREWORKOUT]: PreWorkout,
  [SCREENS.CREATOR]: Creator,
  [SCREENS.WORKOUT]: Workout,
  [SCREENS.SUMMARY]: Summary,
};

export function App() {
  const { state } = useApp();
  const { screen, isWorkoutActive } = state;

  const ActiveScreen = SCREEN_MAP[screen] || Selector;

  if (isWorkoutActive) {
    return (
      <div class="fixed inset-0 flex flex-col bg-clay-canvas" style="top: 0; bottom: 0; left: 0; right: 0;">
        <div class="flex-1 flex flex-col min-h-0 screen-enter" key={screen}>
          <ActiveScreen />
        </div>
        <StopModal />
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-clay-canvas flex flex-col">
      <Header />
      <main class="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 flex flex-col justify-center">
        <div class="screen-enter flex-1 flex flex-col" key={screen}>
          <ActiveScreen />
        </div>
      </main>
      <Footer />
      <StopModal />
    </div>
  );
}
