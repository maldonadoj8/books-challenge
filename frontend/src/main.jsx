/*- Imports -*/

// Utilidades React.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Estilos.
import './styles/app.css'

// Componentes.
import Toast from './common/components/toast';

// Componente principal App.
import App from './app';

/*- Raiz -*/
createRoot(
  document.getElementById('root')).render(
    <StrictMode>
      <App />
      <Toast />
    </StrictMode>,
);