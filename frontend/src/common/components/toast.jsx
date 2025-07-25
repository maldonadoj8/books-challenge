/*- Imports -*/
// Utilidades React.
import { useEffect, useState } from "react";

/*- Componente -*/
export default function Toast() {
  // Estado para mostrar toast.
  const [toast, setToast] = useState(null);

  // Al montar el componente.
  useEffect(() => {
    // Agrega funcion al objeto global.
    window.showToast = (message, options = {}) => {
      setToast({
        message,
        duration: options.duration || 3000,
      });
    };
    // Funcion de limpieza.
    return () => {
      window.showToast = undefined;
    };
  }, []);

  // Al mostrar el toast.
  useEffect(() => {
    if(!toast) { return; }
    // Inicia timer para ocultar toast.
    const timer = setTimeout(() => {
      setToast(null);
    }, toast.duration);
    // Funcion de limpieza.
    return () => {
      clearTimeout(timer); 
    }
  }, [toast]);

  // Si no se esta mostrando.
  if(!toast) { return null; }

  /*- JSX -*/
  return (
    <div
    style={{
      alignItems    : 'center',
      background    : '#000000',
      borderRadius  : "8px",
      bottom        : "24px",
      boxShadow     : "0 2px 8px rgba(0,0,0,0.08)",
      color         : '#ffffff',
      display       : 'flex',
      fontSize      : "14px",
      fontWeight    : 500,
      justifyContent: 'center',
      left          : "50%",
      minWidth      : "200px",
      opacity       : toast ? 1 : 0,
      padding       : "12px 20px",
      position      : "fixed",
      transform     : "translateX(-50%)",
      transition    : "opacity 0.3s",
      zIndex        : 9999,
    }}
    role="alert">
      {toast.message}
    </div>
  );
}
