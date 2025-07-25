/*- Imports -*/
// React hooks.
import { useState, useEffect } from 'react';

// Componentes comunes.
import TextField from '../../../../common/components/textfield';
import Button from '../../../../common/components/button';
import Modal from '../../../../common/components/modal';

// APIs.
import { createBook } from '../apis';
import { getAuthors } from '../../authors/apis';

/*- Componente -*/
const AddBookModal = ({ isOpen, onClose, onBookAdded }) => {

  // Datos del formulario.
  const [formData, setFormData] = useState({
    title    : '',
    isbn     : '',
    authorId : '',
    pageCount: ''
  });

  // Autores.
  const [authors, setAuthors] = useState([]);

  // Errores en la validacion del formulario.
  const [errors, setErrors] = useState({});

  // La peticion esta en proceso?.
  const [isLoading, setIsLoading] = useState(false);

  /** Peticion par cargar autores. */
  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await getAuthors(token);
      setAuthors(Array.isArray(res.data.authors) ? res.data.authors : []);
    } 
    catch(error) {
      console.error('Error al cargar autores:', error);
      setAuthors([]);
    }
  };

  /**
   * Validacion del formulario basada en el backend.
   * @returns {boolean} true si no se encuentran errores.
   */
  const validateForm = () => {
    // Agrega errores encontrados.
    const newErrors = {};

    // Validacion del titulo
    if(!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } 
    else if(formData.title.length < 2 || formData.title.length > 50) {
      newErrors.title = 'El título debe tener entre 2 y 50 caracteres';
    }

    // Validacion del ISBN
    if(!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es requerido';
    } 
    else if (formData.isbn.length < 10 || formData.isbn.length > 13) {
      newErrors.isbn = 'El ISBN debe tener entre 10 y 13 caracteres';
    }

    // Validacion del autor
    if(!formData.authorId) {
      newErrors.authorId = 'El autor es requerido';
    }

    // Validacion del numero de paginas
    if(!formData.pageCount) {
      newErrors.pageCount = 'La cantidad de páginas es requerida';
    } 
    else {
      const pageCount = parseInt(formData.pageCount);
      if(isNaN(pageCount) || pageCount < 1) {
        newErrors.pageCount = 'La cantidad de páginas debe ser un número positivo';
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    // si no se valida el formulario correctamente.
    if(!validateForm()) {
      return;
    }
    // Inicia proceso de carga de la peticion.
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const bookData = {
        ...formData,
        pageCount: parseInt(formData.pageCount)
      };
      await createBook(bookData, token);
      // Resetear formulario y errores.
      setFormData({ title: '', isbn: '', authorId: '', pageCount: '' });
      setErrors({});
      // Ejecutar callback para evento onBookAdded.
      if(onBookAdded) {
        onBookAdded();
      }
      window.showToast("Libro creado", { duration: 3000 });
      // Cerrar modal.
      onClose();
    } 
    catch(error) {
      window.showToast("Error al crear libro", { duration: 3000 });
      console.error('Error al crear libro:', error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  /** Handler para eventos de elemento de cierre de modal */
  const handleClose = () => {
    setFormData({ title: '', isbn: '', authorId: '', pageCount: '' });
    setErrors({});
    onClose();
  };

  // Cargar autores cuando se abre el modal
  useEffect(() => {
    if(isOpen) {
      fetchAuthors();
    }
  }, [isOpen]);

  // Si no se esta mostrando.
  if(!isOpen) { return null; }

  /*- JSX -*/
  return (
    <Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Agregar Nuevo Libro"
    isLoading={isLoading}>

      {/* Formulario */}
      <form 
      onSubmit={handleSubmit} 
      style={{
        display      : 'flex',
        flexDirection: 'column',
        gap          : '16px'
      }}>

        <TextField 
        label="Título *" 
        type="text" 
        value={formData.title} 
        onChange={(e) => handleOnChangeInputs('title', e.target.value)} 
        placeholder="Ingresa el título del libro" />
        {
          errors.title && 
            <span style={errorMessage}>{errors.title}</span>
        }

        <TextField 
        label="ISBN *" 
        type="text" 
        value={formData.isbn} 
        onChange={(e) => handleOnChangeInputs('isbn', e.target.value)} 
        placeholder="Ingresa el ISBN (10-13 caracteres)" />
        {
          errors.isbn && 
            <span style={errorMessage}>{errors.isbn}</span>
        }

        <div 
        style={{ 
          marginBottom: '16px' 
        }}>
          <label 
          style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px' 
          }}>
            Autor *
          </label>
          <select
          value={formData.authorId}
          onChange={(e) => handleOnChangeInputs('authorId', e.target.value)} 
          style={{
            width          : '100%',
            padding        : '10px',
            borderRadius   : '4px',
            border         : '1px solid #ddd',
            fontSize       : '14px',
            outline        : 'none',
            backgroundColor: '#ffffff'
          }}>
            <option value="">Selecciona un autor</option>
            {
              authors.map(author => 
                <option 
                key={author.id} 
                value={author.id}>
                  {author.name}
                </option>)
            }
          </select>
          {
            errors.authorId && 
              <span style={errorMessage}>{errors.authorId}</span>
          }
        </div>

        <TextField
        label="Número de Páginas *"
        type="number"
        value={formData.pageCount}
        onChange={(e) => handleOnChangeInputs('pageCount', e.target.value)}
        placeholder="Ingresa el número de páginas" />
        {
          errors.pageCount && 
            <span style={errorMessage}>{errors.pageCount}</span>
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
          style={{
            backgroundColor: '#ffffff',
            color          : '#000000',
            border         : '1px solid #dee2e6'
          }}
          disabled={isLoading}>
            Cancelar
          </Button>
          
          <Button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#000000',
            color          : '#ffffff'
          }}>
            { 
              isLoading ? 'Creando...' : 'Crear Libro'
            }
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

export default AddBookModal;