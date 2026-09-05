import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Social from './pages/Social.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0d14',
      paper: '#161a26',
    },
    primary: {
      main: '#4f8cff',
    },
    secondary: {
      main: '#8b6cff',
    },
    text: {
      primary: '#f5f6fa',
      secondary: '#9aa1b2',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/social" replace /> : <Signup />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/social" replace /> : <Login />}
        />
        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <Social />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/social' : '/login'} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/social' : '/login'} replace />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
