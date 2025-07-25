/*- Imports -*/
// Utilidades React.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes.
import Button from '../../../../common/components/button';
import TextField from '../../../../common/components/textfield';

// APIs.
import { login } from '../apis';

/*- Componente -*/
const AuthView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /*- Handlers -*/
  /**
   * Handler para el evento on submit del formulario
   * @param e - Evento disparado.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      localStorage.setItem('jwt', res.data.token);
      navigate('/libros');
    } 
    catch(err) {
      window.showToast("Credenciales invalidas", { duration: 3000 });
      console.error(err);
    }
  };

  /*- JSX -*/
  return (
    <div 
    className="grid" 
    style={{
      width: '100%'
    }}>
      <div 
      className="offset-md-1 offset-lg-4 col-4 col-md-6 col-lg-4" 
      style={{
        alignItems    : 'center',
        display       : 'flex',
        flexDirection : 'column',
        gap           : '32px',
        justifyContent: 'center'
      }}>

        {/* Titulos */}
        <div 
        style={{
          alignItems    : 'center',
          display       : 'flex',
          flexDirection : 'column',
          gap           : '8px',
          justifyContent: 'center'
        }}>
          <h2>Bienvenido de nuevo</h2>
          <h3 className='text-secondary'>Inicia sesión con tu cuente</h3>
        </div>

        {/* Formulario */}
        <form 
        onSubmit={handleSubmit} 
        style={{
          display      : 'flex',
          flexDirection: 'column',
          gap          : '8px',
          width        : '100%'
        }}>

          <TextField 
          type="text" 
          placeholder="m@example.com" 
          label={'Usuario'} 
          value={username} 
          onChange={e => setUsername(e.target.value)} />

          <TextField 
          type="password" 
          label={'Contraseña'} 
          value={password} 
          onChange={e => setPassword(e.target.value)} />

          <Button 
          type="submit">
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;