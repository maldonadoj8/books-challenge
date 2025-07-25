/*- Imports -*/

// Utilidades React router.
import { Navigate, useLocation } from 'react-router-dom';

// Verifica autenticacion JWT.
const isAuthenticated = () => {
  return !!localStorage.getItem('jwt');
};

/*- Componente -*/
const AuthGate = ({ children, requireAuth = true }) => {
  // Hook para redireccion.
  const location = useLocation();

  // Verifica autenticacion.
  const loggedIn = isAuthenticated();

  // Requiere autenticacion y no esta logeado.
  if(requireAuth && !loggedIn) {
    // Sin sesion, se redirige a login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No requiere autenticacion y esta logeado.
  if(!requireAuth && loggedIn) {
    // Sin sesion, se redirige a libros.
    return <Navigate to="/libros" replace />;
  }
  return children;
};

export default AuthGate;
