import { useNavigate, useLocation } from 'react-router-dom';
import './bottom_nav.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', icon: 'home', label: 'Inicio', path: '/dashboard' },
    { id: 'map', icon: 'map', label: 'Mapa', path: '/map' },
    { id: 'publish', icon: 'add_circle', label: 'Publicar', path: '/publish' },
    { id: 'profile', icon: 'person', label: 'Perfil', path: '/profile' }
  ];

  return (
    <nav className="bottom_nav">
      {navItems.map(item => (
        <button 
          key={item.id}
          className={`nav_item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className={`material-symbols-rounded ${location.pathname === item.path ? 'filled' : ''}`}>
            {item.icon}
          </span>
          <span className="text-label-mono">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}