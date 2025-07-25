/*- Componente -*/
const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      width       : '100%',
      padding     : '10px',
      borderRadius: '4px',
      background  : '#000000',
      color       : '#ffffff',
      fontWeight  : 500,
      fontSize    : '14px',
      border      : 'none',
      cursor      : 'pointer',
      marginTop   : '8px',
      ...props.style
    }}
  >
    {children}
  </button>
);

export default Button;