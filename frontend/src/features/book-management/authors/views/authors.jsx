/*- Imports -*/
// React hooks.
import { useEffect, useState, useCallback } from 'react';

// APIs.
import { getAuthors, deleteAuthor } from '../apis/';

// Componentes.
import Table from '../../../../common/components/table';
import AddAuthorModal from '../components/add-author-modal';
import ConfirmDeleteModal from '../components/confirm-delete-modal';
import Button from '../../../../common/components/button';

/*- Componente -*/
const AuthorsView = () => {

  // Lista de autores.
  const [authors, setAuthors] = useState([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Esta cargando registros?.
  const [loading, setLoading] = useState(false);
  
  // Estado del modal para agregar autor.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Peticion de autores.
  const fetchAuthors = useCallback(async (page, limit) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const res = await getAuthors(token, page, limit);
      setAuthors(res.data.authors);
      setTotalItems(res.data.total);
      setTotalPages(res.data.pages);
      // No setCurrentPage here!
    } 
    catch(err) {
      window.showToast("Error al cargar autores", { duration: 3000 });
      console.error('Error al cargar autores:', err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  // Estado del modal de confirmación de borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  // Abrir modal de confirmación
  const handleRequestDeleteAuthor = (id) => {
    setAuthorToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirmar borrado
  const handleConfirmDeleteAuthor = async () => {
    if(!authorToDelete) { return; }
    try {
      await deleteAuthor(authorToDelete, localStorage.getItem('jwt'));
      setDeleteModalOpen(false);
      setAuthorToDelete(null);
      fetchAuthors(currentPage, rowsPerPage);
    } 
    catch(err) {
      window.showToast("Error al eliminar autor", { duration: 3000 });
      console.error('Error al eliminar autor:', err);
      setDeleteModalOpen(false);
      setAuthorToDelete(null);
    }
  };

  // Cancelar borrado
  const handleCancelDeleteAuthor = () => {
    setDeleteModalOpen(false);
    setAuthorToDelete(null);
  };

  // Refetch despues de agregar
  const handlerOnAuthorAdded = () => {
    setCurrentPage(1);
    fetchAuthors(1, rowsPerPage);
  };

  // Cambio de página
  const handleOnChangePageTable = (newPage) => {
    setCurrentPage(newPage);
    fetchAuthors(newPage, rowsPerPage);
  };

  // Cambio de filas por página
  const handleOnChangeRowsPerPageTable = (newLimit) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
    fetchAuthors(1, newLimit);
  };

  // useEffect para cargar autores al montar y cuando cambian dependencias.
  useEffect(() => {
    fetchAuthors(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchAuthors]);

  /*- JSX -*/
  return (
    <div 
    className="grid" 
    style={{ 
      width: '100%' 
    }}>

      {/* Navegación entre vistas */}
      <Button 
      onClick={() => window.location.href = '/libros'}>
        Ir a Libros
      </Button>

      <div 
      className="col-4 col-md-8 col-lg-12">

        <Table
        columns={[
          { key: 'name', header: 'Nombre' },
          { key: 'birthDate', header: 'Fecha de nacimiento', render: (row) => new Date(row.birthDate).toLocaleDateString() }
        ]}
        data={authors}
        onAdd={() => setIsModalOpen(true)}
        onDelete={handleRequestDeleteAuthor}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage} 
        onChangePage={handleOnChangePageTable}
        onChangeRowsPerPage={handleOnChangeRowsPerPageTable}
        loading={loading}/>
      </div>

      {/*- Modal agregar autor -*/}
      <AddAuthorModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAuthorAdded={handlerOnAuthorAdded} />

      {/*- Modal de confirmación de borrado -*/}
      <ConfirmDeleteModal
      open={deleteModalOpen}
      onCancel={handleCancelDeleteAuthor}
      onConfirm={handleConfirmDeleteAuthor} />
    </div>
  );
};

export default AuthorsView;
