/*- Imports -*/
// React hooks.
import { useState } from 'react';

// Componentes comunes.
import TextField from '../../../../common/components/textfield';
import Button from '../../../../common/components/button';
import Modal from '../../../../common/components/modal';

// APIs.
import { createAuthor } from '../apis';

/*- Componente -*/
const AddAuthorModal = ({ isOpen, onClose, onAuthorAdded }) => {
  
  // Datos del formulario.
  const [formData, setFormData] = useState({
    name     : '',
    birthDate: ''
  });

  // Errores en la validacion del formulario.
  const [errors, setErrors] = useState({});

  // La peticion esta en proceso?.
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Validacion del formulario basada en el backend.
   * @returns {boolean} true si no se encuentran errores.
   */
  const validateForm = () => {
    // Agrega errores encontrados.
    const newErrors = {};

    // Validacion del nombre
    if(!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'; 
    } 
    else if(formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'El nombre debe tener entre 2 y 100 caracteres';
    }

    // Validacion de la fecha de nacimiento.
    if(!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    } 
    else {
      const date = new Date(formData.birthDate);
      if(isNaN(date.getTime())) {
        newErrors.birthDate = 'La fecha de nacimiento debe ser una fecha valida';
      }
    }
    // Establece el estado para errores por campo.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handler para evento onChange de los inputs. */
  const handleOnChangeInputs = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reinicia los errores para el campo modificado.
    if(errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /** Handler para el evento onSubmit del formulario */
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // si no se valida el formulario correctamente.
    if(!validateForm()) {
      return;
    }
    // Inicia proceso de carga de la peticion.
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      await createAuthor(formData, token);
      // Resetear formulario y errores.
      setFormData({ name: '', birthDate: '' });
      setErrors({});
      // Ejecutar callback para evento onAutorAdded.
      if(onAuthorAdded) {
        onAuthorAdded();
      }
      window.showToast("Autor creado", { duration: 3000 });
      // Cerrar modal.
      onClose();
    } 
    catch(error) {
      window.showToast("Error al crear autor", { duration: 3000 });
      console.error('Error al crear autor:', error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  /** Handler para eventos de elemento de cierre de modal */
  const handleClose = () => {
    setFormData({ name: '', birthDate: '' });
    setErrors({});
    onClose();
  };

  // Si no se esta mostrando.
  if(!isOpen) { return null; }

  /*- JSX -*/
  return (
    <Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Crear un autor"
    isLoading={isLoading}>
      
      {/* Formulario */}
      <form 
      onSubmit={handleOnSubmit} 
      style={{
        display      : 'flex',
        flexDirection: 'column',
        gap          : '16px'
      }}>

        <TextField
        label="Nombre *"
        type="text"
        value={formData.name}
        onChange={(e) => handleOnChangeInputs('name', e.target.value)}
        placeholder="Ingresa el nombre del autor"/>
        {
          errors.name && 
            <span style={errorMessage}>{errors.name}</span>
        }

        <TextField
        label="Fecha de Nacimiento *"
        type="date"
        value={formData.birthDate}
        onChange={(e) => handleOnChangeInputs('birthDate', e.target.value)}/>
        { 
          errors.birthDate && 
            <span style={errorMessage}>{errors.birthDate}</span>
        }

        <div 
        style={{
          display  : 'flex',
          gap      : '12px',
          marginTop: '20px'
        }}>
          <Button
          type="button"
          onClick={handleClose}
          disabled={isLoading} 
          style={{
            backgroundColor: '#ffffff',
            color          : '#000000',
            border         : '1px solid #DEE2E6'
          }}>
            Cancelar
          </Button>
          
          <Button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#000000',
            color          : '#ffffff'
          }}>
            {isLoading ? 'Creando...' : 'Crear Autor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Estilos del formulario.
const errorMessage = {
  color       : 'red',
  fontSize    : '12px',
  marginTop   : '-12px',
  marginBottom: '8px'
};

export default AddAuthorModal;