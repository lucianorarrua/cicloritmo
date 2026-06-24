import { useApp, SCREENS } from './state/store.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Selector } from './screens/Selector.jsx';
import { PreWorkout } from './screens/PreWorkout.jsx';
import { Creator } from './screens/Creator.jsx';
import { Workout } from './screens/Workout.jsx';
import { Summary } from './screens/Summary.jsx';
import { StopModal } from './components/StopModal.jsx';

export function App() {
  const { state } = useApp();
  const { screen, isWorkoutActive } = state;

  return (
    <div class="min-h-screen flex flex-col justify-between">
      {!isWorkoutActive && <Header />}

      <main class={`flex-grow w-full max-w-4xl mx-auto px-4 py-2 flex flex-col ${isWorkoutActive ? 'justify-between' : 'justify-center'}`}>
        {screen === SCREENS.SELECTOR && <Selector />}
        {screen === SCREENS.PREWORKOUT && <PreWorkout />}
        {screen === SCREENS.CREATOR && <Creator />}
        {screen === SCREENS.WORKOUT && <Workout />}
        {screen === SCREENS.SUMMARY && <Summary />}
      </main>

      {!isWorkoutActive && <Footer />}

      <StopModal />
    </div>
  );
}
