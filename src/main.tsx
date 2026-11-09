import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/andika/400.css';
import '@fontsource/andika/700.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './styles/global.css';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
