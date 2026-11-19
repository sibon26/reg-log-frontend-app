import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(15, 12, 35, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#f0f0ff',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 450,
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(124,107,255,0.08)',
            },
            success: {
              iconTheme: { primary: '#6ee7b7', secondary: 'rgba(15,12,35,0.85)' },
            },
            error: {
              iconTheme: { primary: '#fb7185', secondary: 'rgba(15,12,35,0.85)' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
