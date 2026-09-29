import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateInitialAvatar } from '../utils/avatarUtils';
import './profile_screen.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const user = currentUser;

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p className="text-body-md">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', backgroundColor: 'var(--color-bg-subtle)' }} className="no-scrollbar">
      <div className="profile_header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="text-heading-1" style={{ color: 'white' }}>Mi Perfil</h1>
          <button 
            onClick={handleLogout}
            className="material-symbols-rounded"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: 'white', 
              fontSize: '24px',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            logout
          </button>
        </div>

        <div className="profile_card">
          <img src={generateInitialAvatar(user.nombre, 200)} alt={user.nombre} className="profile_avatar" />
          <div className="profile_info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 className="text-heading-2">{user.nombre}</h2>
              {user.verificado && (
                <span className="material-symbols-rounded verified_badge filled">verified</span>
              )}
            </div>
            <p className="text-body-md" style={{ color: 'var(--color-ink-secondary)', marginBottom: '12px' }}>
              {user.ubicacion_GPS}
            </p>
            <div className="rating_container">
              <span className="material-symbols-rounded star_icon filled">star</span>
              <span className="text-body-md" style={{ fontWeight: 600 }}>{user.valoracion_promedio}</span>
              <span className="text-caption" style={{ color: 'var(--color-ink-secondary)' }}>
                ({user.total_donaciones + user.total_recepciones} actividades)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {user.insignias && user.insignias.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 className="text-heading-2" style={{ marginBottom: '12px' }}>Insignias</h3>
            <div className="badges_container">
              {user.insignias.map((insignia, index) => (
                <div key={index} className="badge_item">
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>
                    {insignia.startsWith('🏆') ? '🏆' : '💚'}
                  </span>
                  <span className="text-body-md">{insignia.substring(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h3 className="text-heading-2" style={{ marginBottom: '12px' }}>Estadísticas</h3>
          <div className="stats_grid">
            <div className="stat_card">
              <div className="stat_icon">
                <span className="material-symbols-rounded">volunteer_activism</span>
              </div>
              <div className="stat_content">
                <p className="text-caption" style={{ color: 'var(--color-ink-secondary)' }}>Donaciones</p>
                <p className="text-heading-2">{user.total_donaciones}</p>
              </div>
            </div>
            <div className="stat_card">
              <div className="stat_icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <span className="material-symbols-rounded">shopping_cart</span>
              </div>
              <div className="stat_content">
                <p className="text-caption" style={{ color: 'var(--color-ink-secondary)' }}>Recepciones</p>
                <p className="text-heading-2">{user.total_recepciones}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 className="text-heading-2" style={{ marginBottom: '12px' }}>Información Personal</h3>
          <div className="info_list">
            <div className="info_item">
              <div className="info_label">
                <span className="material-symbols-rounded">location_on</span>
                <span className="text-body-md" style={{ fontWeight: 600 }}>Ubicación</span>
              </div>
              <p className="text-body-md">{user.ubicacion_GPS}</p>
            </div>
            <div className="info_item">
              <div className="info_label">
                <span className="material-symbols-rounded">verified_user</span>
                <span className="text-body-md" style={{ fontWeight: 600 }}>Estado</span>
              </div>
              <p className="text-body-md">
                {user.verificado ? '✓ Verificado' : 'No verificado'}
              </p>
            </div>
            <div className="info_item">
              <div className="info_label">
                <span className="material-symbols-rounded">assignment_ind</span>
                <span className="text-body-md" style={{ fontWeight: 600 }}>Rol</span>
              </div>
              <p className="text-body-md">{user.rol}</p>
            </div>
            {user.email && (
              <div className="info_item">
                <div className="info_label">
                  <span className="material-symbols-rounded">email</span>
                  <span className="text-body-md" style={{ fontWeight: 600 }}>Email</span>
                </div>
                <p className="text-body-md">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/edit_profile')}
            className="profile_btn primary"
          >
            <span className="material-symbols-rounded">edit</span>
            Editar Perfil
          </button>
          <button 
            onClick={handleLogout}
            className="profile_btn logout"
          >
            <span className="material-symbols-rounded">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
