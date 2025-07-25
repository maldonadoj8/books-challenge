/*- Imports -*/
// React hooks.
import { useEffect, useState, useCallback, useMemo } from 'react';

// APIs.
import { getBooks, deleteBook, uploadBooksCsv } from '../apis';
import { debounce } from '../../../../utils/functions';

// Componentes.
import Table from '../../../../common/components/table';
import AddBookModal from '../components/add-book-modal';
import ConfirmDeleteModal from '../components/confirm-delete-modal';
import Button from '../../../../common/components/button';

/*- Componente -*/
const BooksView = () => {
  // Campos de búsqueda
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  // Lista de libros.
  const [books, setBooks] = useState([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Esta cargando registros?
  const [loading, setLoading] = useState(false);

  // Estado del modal para agregar libro.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Peticion de libros con búsqueda
  const fetchBooks = useCallback(async (page, limit, title = '', author = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const params = { page, limit };

      if(title) { params.title = title; }
      if(author) { params.author = author; }
      
      const res = await getBooks(params, token);
      setBooks(res.data.books);
      setTotalItems(res.data.total);
      setTotalPages(res.data.pages);
    } 
    catch(err) {
      window.showToast("Error al cargar libros", { duration: 3000 });
      console.error('Error al cargar libros:', err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetchBooks for search
  const debouncedFetchBooks = useMemo(() =>
    debounce((page, limit, title, author) => {
      fetchBooks(page, limit, title, author);
    }, 400)
  , [fetchBooks]);

  // Estado del modal de confirmación de borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Abrir modal de confirmación
  const handleRequestDeleteBook = (id) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirmar borrado
  const handleConfirmDeleteBook = async () => {
    if(!bookToDelete) { return; }
    try {
      await deleteBook(bookToDelete, localStorage.getItem('jwt'));
      setDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks(currentPage, rowsPerPage);
    } 
    catch(err) {
      window.showToast("Error al eliminar libro", { duration: 3000 });
      console.error('Error al eliminar libro:', err);
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  // Cancelar borrado.
  const handleCancelDeleteBook = () => {
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  // Refetch despues de agregar
  const handleOnBookAdded = () => {
    setCurrentPage(1);
    fetchBooks(1, rowsPerPage, searchTitle, searchAuthor);
  };

  // Cambio de página
  const handleOnChangePageTable = (newPage) => {
    setCurrentPage(newPage);
    fetchBooks(newPage, rowsPerPage, searchTitle, searchAuthor);
  };

  // Cambio de filas por página
  const handleOnChangeRowsPerPageTable = (newLimit) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
    fetchBooks(1, newLimit, searchTitle, searchAuthor);
  };

  // Importa un archivo CSV.
  const handlerOnClickButtonImportar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if(!file) { return; }
      const formData = new FormData();
      formData.append('file', file);
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');
        const res = await uploadBooksCsv(formData, token);
        const result = res.data;
        window.showToast(`Importación completada: ${result.total} filas procesadas`, { duration: 4000 });
        fetchBooks(currentPage, rowsPerPage, searchTitle, searchAuthor);
      } 
      catch (err) {
        window.showToast('Error al importar archivo', { duration: 4000 });
        console.error('Error al importar archivo:', err);
      } 
      finally {
        setLoading(false);
      }
    };
    input.click();
  };

  // useEffect para cargar libros al montar y cuando cambian dependencias.
  useEffect(() => {
    debouncedFetchBooks(currentPage, rowsPerPage, searchTitle, searchAuthor);
  }, [currentPage, rowsPerPage, searchTitle, searchAuthor, debouncedFetchBooks]);

  /*- JSX -*/
  return (
    <div 
    className="grid" 
    style={{ width: '100%' }}>

      {/* Navegacion entre vistas */}
      <Button 
      onClick={() => window.location.href = '/autores'}>
        Ir a Autores
      </Button>

      <div className="col-4 col-md-8 col-lg-12">
        {/* Lista de libros */}
        <Table
          columns={[ 
            { 
              key   : 'coverUrl',
              header: 'Portada',
              render: (book) => (
                book.coverUrl 
                  ? <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{ 
                      width       : 48,
                      height      : 64,
                      objectFit   : 'cover',
                      borderRadius: 4,
                      boxShadow   : '0 1px 4px rgba(0,0,0,0.08)' 
                    }} />
                 : 'Sin portada')
            },
            { key: 'isbn', header: 'ISBN' },
            { key: 'title', header: 'Título' },
            { key: 'author', header: 'Autor', render: (book) => book.Author.name },
            { key: 'pageCount', header: 'Páginas' }
          ]}
          data={books}
          onAdd={() => setIsModalOpen(true)}
          onDelete={handleRequestDeleteBook}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onChangePage={handleOnChangePageTable}
          onChangeRowsPerPage={handleOnChangeRowsPerPageTable}
          loading={loading} 
          additionalButton={
            <Button 
            onClick={() => handlerOnClickButtonImportar()}>
              Importar
            </Button>
          }
          searchHeader={
            <div 
            style={{ 
              display: 'flex', 
              gap: 8 
            }}>
              <input
              type="text"
              placeholder="Buscar por título"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              disabled={loading} 
              style={{ 
                padding     : '8px',
                borderRadius: 6,
                border      : '1px solid #ddd',
                minWidth    : 140
              }}/>

              <input
              type="text"
              placeholder="Buscar por autor"
              value={searchAuthor}
              onChange={e => setSearchAuthor(e.target.value)}
              disabled={loading} 
              style={{ 
                padding     : '8px',
                borderRadius: 6,
                border      : '1px solid #ddd',
                minWidth    : 140
              }}/>
            </div>
          }
        />
      </div>

      {/*- Modal agregar libro -*/}
      <AddBookModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onBookAdded={handleOnBookAdded} />

      {/*- Modal de confirmación de borrado -*/}
      <ConfirmDeleteModal
      open={deleteModalOpen}
      onCancel={handleCancelDeleteBook}
      onConfirm={handleConfirmDeleteBook} />
    </div>
  );
};

export default BooksView;
