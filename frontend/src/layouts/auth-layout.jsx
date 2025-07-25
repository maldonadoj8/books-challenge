/*- Imports -*/
// Utilidades React.
import { Outlet } from 'react-router-dom';

/*- Componente -*/
const AuthLayout = () => (
  <main 
  className='layout'>

    {/* Oulet para rutas anidadas */}
    <Outlet />
  </main>
);

export default AuthLayout;
