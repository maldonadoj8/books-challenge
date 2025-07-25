/*- Imports -*/

// Utilidades React router.
import {
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

// Layouts.
import HomeLayout from '../layouts/home-layout';
import AuthLayout from '../layouts/auth-layout';

// Views
import AuthView from '../features/authentication/login/views/auth';
import BooksView from '../features/book-management/books/views/books';
import AuthorsView from '../features/book-management/authors/views/authors';

// Auth gate.
import AuthGate from './auth-gate';

/*- Router -*/
const AppRouter = () => (
  <Router>
    <Routes>
      
      {/* Auth layout para login */}
      <Route 
      element={
        <AuthGate requireAuth={false}>
          <AuthLayout />
        </AuthGate>
      }>
        <Route path="/login" element={<AuthView />} />
      </Route>

      {/* Home layout manejo de libros */}
      <Route 
      element={
        <AuthGate 
        requireAuth={true}>
          <HomeLayout />
        </AuthGate>
      }>
        <Route path="/libros" element={<BooksView />} />
        <Route path="/autores" element={<AuthorsView />} />
      </Route>

      {/* Ruta comodin */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default AppRouter;
