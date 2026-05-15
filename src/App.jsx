import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnterSystem from './pages/EnterSystem';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Achievements from './pages/Achievements';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import HeroCollection from './pages/HeroCollection';
import Gacha from './pages/Gacha';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enter" element={<EnterSystem />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hero" element={<HeroCollection />} />
        <Route path="/gacha" element={<Gacha />} />
      </Routes>
    </BrowserRouter>
  );
}
