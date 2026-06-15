import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnterSystem from './pages/EnterSystem';
import Dashboard from './pages/Dashboard';
import Achievements from './pages/Achievements';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import HeroCollection from './pages/HeroCollection';
import Gacha from './pages/Gacha';
import CustomCursor from './CustomCursor';
import { AuthProvider } from './context/AuthContext';
import { CoinsProvider } from './context/CoinsContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoinsProvider>
          <CustomCursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/enter" element={<EnterSystem />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/hero" element={<ProtectedRoute><HeroCollection /></ProtectedRoute>} />
            <Route path="/gacha" element={<ProtectedRoute><Gacha /></ProtectedRoute>} />
          </Routes>
        </CoinsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
