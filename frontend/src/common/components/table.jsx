/*- Imports -*/
// React hooks.
import { useState } from 'react';

// Componentes comunes.
import Button from './button';

/*- Componente -*/
const Table = ({ columns = [], data = [], onAdd, onDelete, totalItems = 0, 
currentPage = 1, totalPages = 1, onChangePage, onChangeRowsPerPage, 
loading = false, rowsPerPage = 5, searchHeader = null, 
additionalButton = null }) => {

  // Pagina actual.
  const page = currentPage - 1;

  // Estatus de menu de contexto por tabla.
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Abre o cierra menu de contexto.
  const toggleMenu = (id) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  /** Handler para evento onChange de pagina. */
  const handlerOnChangePage = (newPage) => {
    if(onChangePage) {
      onChangePage(newPage + 1);
    }
  };

  /** Handler para evento onChange de rows por pagina. */
  const handleOnChangeRowsPerPage = (newRowsPerPage) => {
    if(onChangeRowsPerPage) {
      onChangeRowsPerPage(newRowsPerPage);
    }
  };

  /*- JSX -*/
  return ( 
    <div 
    style={{ 
      border      : '1px solid #DEE2E6',
      borderRadius: '8px',
      overflow    : 'hidden',
      position    : 'relative',
      overflowX   : 'scroll'
    }}>

      {/* Overlay de carga */}
      {
        loading && 
          <div 
          style={{
            position      : 'absolute',
            top           : 0,
            left          : 0,
            right         : 0,
            bottom        : 0,
            background    : '#ffffff',
            zIndex        : 20,
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center'
          }}>
            <span 
            style={{ fontSize: 18, color: '#000000' }}>
              Cargando...
            </span>
          </div>
      }

      {/* Header */}
      <div 
      className='responsive-stack'
      style={{ 
        display       : 'flex',
        justifyContent: 'space-between',
        padding       : '12px' }}>
          
          {
            searchHeader 
              ? searchHeader 
              : <div style={{ flex: 1 }}> </div>
          }

          <div 
          style={{ 
            display: 'flex',
            gap    : '8px'
          }}>
            <Button 
            onClick={onAdd} 
            disabled={loading}>
              Nuevo 
            </Button>

            {
              additionalButton && 
                additionalButton
            }
        </div>
      </div>

      {/* Table */}
      <table 
      style={{ 
        width: '100%', 
        borderCollapse: 'collapse' 
      }}>
        {/* Head */}
        <thead 
        style={{ 
          background: '#f9fafb' }}>
          <tr>
            {
              columns.map((col) => 
                <th 
                key={col.key} 
                style={thStyle}>
                  {col.header}
                </th>
              )}
            <th style={thStyle}></th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {
            data.length === 0 && !loading 
              ? (
                  <tr>
                    <td 
                    colSpan={columns.length + 1} 
                    style={{ 
                      textAlign: 'center', 
                      padding: '32px', 
                      color: '#000000' 
                    }}>
                      No hay datos para mostrar
                      </td>
                  </tr>
                ) 
                : (
                    data.map((item) => 
                      <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: '1px solid #eee' 
                      }}>
                        {
                          columns.map((col) => 
                            <td 
                            key={col.key} 
                            style={tdStyle}>
                              {
                                col.render ? col.render(item) : item[col.key]
                              }
                            </td>)
                        }
                        
                        <td 
                        style={{ 
                          ...tdStyle, 
                          position: 'relative' 
                        }}>
                          <button
                          onClick={() => toggleMenu(item.id)}
                          disabled={loading}
                          style={{ 
                            border    : 'none',
                            background: 'none',
                            fontSize  : '18px'
                          }}>
                            ⋮
                          </button>
                          {
                            menuOpenId === item.id && 
                              <div 
                              style={{
                                position    : 'absolute',
                                top         : '32px',
                                right       : '8px',
                                background  : 'white',
                                border      : '1px solid #ddd',
                                borderRadius: '6px',
                                boxShadow   : '0 4px 8px rgba(0,0,0,0.1)',
                                zIndex      : 10,
                              }}>
                                <div
                                style={menuItemStyle}
                                onClick={() => {
                                  setMenuOpenId(null);
                                  onDelete(item.id);
                                }}>
                                  Eliminar
                                </div>
                              </div>
                          }
                        </td>
                      </tr>)
                    )
          }
        </tbody>
      </table>

      {/* Footer */}
      <div 
      style={{
        display        : 'flex',
        justifyContent : 'space-between',
        alignItems     : 'center',
        padding        : '12px 16px',
        backgroundColor: '#f9fafb',
        borderTop      : '1px solid #e5e7eb',
      }}>

        {/* Elementos totaltes en base de datos */}
        <div>
          <span 
          style={{ 
            fontSize: '14px', 
            color: '#000000' 
          }}>
            Total: {totalItems} elementos
          </span>
        </div>

        {/* Filas por pagina */}
        <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8 
        }}>
          <label>Filas por página</label>
          <select 
          value={rowsPerPage} 
          onChange={(e) => handleOnChangeRowsPerPage(Number(e.target.value))} 
          disabled={loading}>
            {
              [5, 10].map((n) => 
                <option key={n} value={n}>
                  {n}
                </option>)
            }
          </select>
        </div>

        {/* Controles de paginacion */}
        <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8 
        }}>
          <button 
          onClick={() => handlerOnChangePage(0)} 
          disabled={page === 0 || loading}>
            ⏮
          </button>
          
          <button 
          onClick={() => handlerOnChangePage(Math.max(0, page - 1))} 
          disabled={page === 0 || loading}>
            ◀
          </button>
          
          <span>
            Página {page + 1} de {totalPages}
          </span>
          
          <button 
          onClick={() => handlerOnChangePage(Math.min(totalPages - 1, page + 1))} 
          disabled={page >= totalPages - 1 || loading}>
            ▶
          </button>
          
          <button 
          onClick={() => handlerOnChangePage(totalPages - 1)} 
          disabled={page >= totalPages - 1 || loading}>
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles
const thStyle = {
  padding  : '12px',
  textAlign: 'left',
  color    : '#000000',
  fontSize : '14px',
};

const tdStyle = {
  padding : '12px',
  fontSize: '14px',
  color   : '#000000',
};

const menuItemStyle = {
  padding     : '10px 16px',
  fontSize    : '14px',
  color       : '#000000',
  cursor      : 'pointer',
  whiteSpace  : 'nowrap',
  borderBottom: '1px solid #eee',
};

export default Table;