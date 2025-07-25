/*- Imports -*/

// Utilidades React.
import './styles/app.css';

// Router
import AppRouter from './routing/app-router';

/*- Componente -*/
function App() {

  // JSX.
  return <div className="container">
    <AppRouter />
  </div>;
}

export default App;