import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import './styles/theme.css';

// Helper function to calculate hover color
const getHoverColor = (hex) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  // Darken by 15%
  r = Math.max(0, r - 38);
  g = Math.max(0, g - 38);
  b = Math.max(0, b - 38);
  
  // Convert back to hex
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Initialize primary color from localStorage
    const savedColor = localStorage.getItem('primaryColor') || '#2E86AB';
    document.documentElement.style.setProperty('--color-primary', savedColor);
    document.documentElement.style.setProperty(
      '--color-primary-hover', 
      getHoverColor(savedColor)
    );
    
    // Calculate and set primary light color (20% opacity of primary)
    const primaryLight = `${savedColor}33`; // 33 = 20% opacity in hex
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes with MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;