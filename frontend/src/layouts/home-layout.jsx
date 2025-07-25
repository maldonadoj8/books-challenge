/*- Imports -*/
// Utilidades React.
import { Outlet } from 'react-router-dom';

/*- Componente -*/
const HomeLayout = () => {
  
  // Logout handler.
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  return <main 
  className='layout'>
    <div 
    style={{
      display      : 'flex',
      flexDirection: 'column',
      gap          : '16px',
      width        : '100%'
    }}>
      <button 
      onClick={handleLogout} 
      style={{
        alignSelf      : 'end',
        backgroundColor: '#ffffff',
        color          : '#000000',
        border         : '1px solid #DEE2E6',
        padding        : '10px 16px',
        borderRadius   : '4px',
        cursor         : 'pointer',
        fontSize       : '14px'
      }}>
        Cerrar sesión
      </button>

      {/* Oulet para rutas anidadas */}
      <Outlet />
    </div>
  </main>
};

export default HomeLayout;
