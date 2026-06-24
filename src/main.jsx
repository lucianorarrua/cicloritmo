import { render } from 'preact';
import { AppProvider } from './state/store.jsx';
import { App } from './App.jsx';
import './index.css';

render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('app')
);
