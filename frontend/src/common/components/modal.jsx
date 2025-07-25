/*- Componente -*/
const Modal = ({ isOpen, onClose, title, children, isLoading = false,
showCloseButton = true }) => {
  // Si no se esta mostrando
  if(!isOpen) { return null; }

  /** Handler para evento onClick del overlay del modal */
  const handleOnClickOverlay = (e) => {
    if(e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  /*- JSX -*/
  return (
    // Overlay
    <div 
    onClick={handleOnClickOverlay} 
    style={{
      position       : 'fixed',
      top            : 0,
      left           : 0,
      right          : 0,
      bottom         : 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display        : 'flex',
      justifyContent : 'center',
      alignItems     : 'center',
      zIndex         : 1000
    }}>

      {/* Modal */}
      <div 
      style={{
        backgroundColor: 'white',
        borderRadius   : '8px',
        padding        : '24px',
        minWidth       : '400px',
        maxWidth       : '500px',
        width          : '90%',
        maxHeight      : '90vh',
        overflow       : 'auto',
        boxShadow      : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>

        {/* Contenido */}
        <div 
        style={{
          display       : 'flex',
          justifyContent: 'space-between',
          alignItems    : 'center',
          marginBottom  : '20px',
          borderBottom  : '1px solid #eee',
          paddingBottom : '12px'
        }}>

          {/* Titulo */}
          <h2 
          style={{ margin: 0 }}>
            {title}
          </h2>

          {/* Botton para cerrar */}
          {
            showCloseButton && 
              <button 
              disabled={isLoading}
              onClick={onClose}
              style={{
                background    : 'none',
                border        : 'none',
                fontSize      : '24px',
                cursor        : 'pointer',
                color         : '#000000',
                padding       : '0',
                width         : '30px',
                height        : '30px',
                display       : 'flex',
                alignItems    : 'center',
                justifyContent: 'center'
              }}>
                ×
              </button>
          }
        </div>

        {/* Body */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
