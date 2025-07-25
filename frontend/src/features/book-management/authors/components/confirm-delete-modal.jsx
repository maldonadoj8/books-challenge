/**- Componente -*/
const ConfirmDeleteModal = ({ open, onCancel, onConfirm, 
message = '¿Estás completamente seguro?', 
description = 'Esta acción no se puede deshacer. Se eliminará el elemento de manera permanente de todos nuestros registros.' }) => {
  if (!open) return null;
  return (
    <div style={{
      position      : 'fixed',
      top           : 0,
      left          : 0,
      width         : '100vw',
      height        : '100vh',
      background    : 'rgba(0,0,0,0.2)',
      display       : 'flex',
      alignItems    : 'center',
      justifyContent: 'center',
      zIndex        : 1000
    }}>
      <div style={{
        background  : 'white',
        borderRadius: 8,
        boxShadow   : '0 2px 16px rgba(0,0,0,0.15)',
        padding     : 32,
        minWidth    : 320,
        maxWidth    : 360,
        textAlign   : 'center'
      }}>
        <h3 
        style={{ 
          fontWeight  : 600,
          fontSize    : 18,
          marginBottom: 12
        }}>
          {message}
        </h3>
        <div 
        style={{ 
          color       : '#000000',
          fontSize    : 15,
          marginBottom: 24
        }}>
          {description}
        </div>
        <div 
        style={{ 
          display       : 'flex',
          justifyContent: 'center',
          gap           : 16
        }}>
          <button
            onClick={onCancel}
            style={{
              padding     : '8px 20px',
              borderRadius: 6,
              border      : '1px solid #ddd',
              background  : '#ffffff',
              color       : '#000000',
              fontWeight  : 500,
              cursor      : 'pointer'
            }}
          >Cancelar</button>
          <button
            onClick={onConfirm}
            style={{
              padding     : '8px 20px',
              borderRadius: 6,
              border      : 'none',
              background  : 'red',
              color       : '#ffffff',
              fontWeight  : 500,
              cursor      : 'pointer'
            }}
          >Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
