/*- Componente -*/
const TextField = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div 
  style={{ 
    display      : 'flex',
    flexDirection: 'column',
    gap          : '4px'
  }}>
    
    {/* Label */}
    {
      label && 
        <label 
        className="subtitle">
          {label}
        </label>
    }
    
    {/* Input */}
    <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      padding     : '10px',
      borderRadius: '4px',
      border      : '1px solid #ddd',
      fontSize    : '14x',
      outline     : 'none',
      background  : '#ffffff',
      marginBottom: '4px'
    }} />
  </div>
);

export default TextField;