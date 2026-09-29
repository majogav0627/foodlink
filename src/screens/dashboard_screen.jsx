import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './dashboard_screen.css';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { donaciones, currentUser, isFavorito, toggleFavorito } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const categories = ['Todas', 'Frutas/Verduras', 'Panadería', 'Comida Preparada', 'Lácteos', 'Otros'];

  const filteredDonaciones = donaciones.filter(donacion => {
    const matchesSearch = donacion.tipo_alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || donacion.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getExpirationLabel = (expiration) => {
    const diff = new Date(expiration) - new Date();
    if (Number.isNaN(diff) || diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expira en ${hours}h ${minutes}min` : `Expira en ${minutes} min`;
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', backgroundColor: 'var(--color-bg-subtle)' }} className="no-scrollbar">
      {/* Header */}
      <header style={{ padding: '16px 16px 12px', backgroundColor: 'var(--color-bg-base)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <img 
            src="/images/logo-icon.png" 
            alt="FOODLINK" 
            style={{ width: '72px', height: '72px' }}
          />
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <span className="material-symbols-rounded" style={{ fontSize: '28px', color: 'var(--color-ink-primary)' }}>notifications</span>
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%' }}></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>location_on</span>
          <p className="text-heading-2">{currentUser?.ubicacion_GPS || 'San Salvador'}</p>
        </div>
      </header>

      {/* Banner */}
      <div style={{ margin: '16px', padding: '16px', backgroundColor: 'var(--color-primary)', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="text-heading-2">{filteredDonaciones.length} donaciones activas</p>
          <p className="text-caption" style={{ opacity: 0.9 }}>cerca de ti</p>
        </div>
        <button onClick={() => navigate('/map')} className="text-body-md" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '24px' }}>
          Ver mapa
          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <input 
          type="text"
          placeholder="Buscar donaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'var(--color-bg-base)', boxSizing: 'border-box' }}
          className="text-body-md"
        />
      </div>

      {/* Filtros */}
      <div style={{ padding: '0 16px', marginBottom: '16px', overflowX: 'auto', display: 'flex', gap: '8px', scrollBehavior: 'smooth' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filterCategory === cat ? 'var(--color-primary)' : 'var(--color-bg-base)',
              color: filterCategory === cat ? 'white' : 'var(--color-ink-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterCategory === cat ? 'var(--elevation-z1)' : 'none'
            }}
            className="text-body-md"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="text-heading-2">Descubre</p>
        {filteredDonaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-ink-secondary)' }}>
            <p className="text-body-md">No hay donaciones disponibles</p>
          </div>
        ) : (
          filteredDonaciones.map((donacion) => {
            const expirationLabel = getExpirationLabel(donacion.hora_limite_recogida);
            const esFavorito = isFavorito(donacion.id_donacion);
            
            return (
              <div 
                key={donacion.id_donacion} 
                style={{ 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-card)', 
                  overflow: 'hidden', 
                  boxShadow: 'var(--elevation-z1)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => navigate(`/detail/${donacion.id_donacion}`)}
              >
                <div style={{ height: '140px', width: '100%', position: 'relative', backgroundColor: '#f0f0f0' }}>
                  <img 
                    src={donacion.foto_url} 
                    alt={donacion.tipo_alimento}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(donacion.id_donacion);
                      }}
                      style={{ backgroundColor: 'var(--color-bg-base)', padding: '4px 8px', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: 'var(--elevation-z1)' }}
                    >
                      <span className={`material-symbols-rounded ${esFavorito ? 'filled' : ''}`} style={{ fontSize: '18px', color: esFavorito ? 'var(--color-secondary)' : 'var(--color-ink-primary)' }}>favorite</span>
                    </button>
                    <div style={{ backgroundColor: 'var(--color-bg-base)', padding: '4px 8px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: 'var(--elevation-z1)' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '14px', color: 'var(--color-ink-primary)' }}>location_on</span>
                      <span className="text-label-mono" style={{ color: 'var(--color-ink-primary)' }}>{donacion.distancia}</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="text-heading-2">{donacion.tipo_alimento}</h3>
                    <span className="text-body-md" style={{ color: 'var(--color-ink-secondary)' }}>{donacion.cantidad}</span>
                  </div>
                  {donacion.descripcion && (
                    <p className="text-caption" style={{ color: 'var(--color-ink-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
                      {donacion.descripcion}
                    </p>
                  )}
                  <p className="text-body-md" style={{ color: 'var(--color-ink-secondary)', marginBottom: '12px' }}>{donacion.donante.nombre}</p>
                  <p className="text-caption" style={{ color: 'var(--color-ink-secondary)', marginBottom: '12px', fontWeight: 600 }}>
                    {donacion.modalidades_disponibles ?
                      donacion.modalidades_disponibles.length === 2 ? 'Recogida o domicilio' : donacion.modalidades_disponibles[0] === 'domicilio' ? 'Entrega a domicilio' : 'Recogida en sitio'
                      : donacion.modalidad_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Recogida en sitio'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: expirationLabel === 'Expirado' ? 'var(--color-secondary)' : 'var(--color-ink-secondary)' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>schedule</span>
                    <span className="text-caption" style={{ fontWeight: expirationLabel === 'Expirado' ? 600 : 400 }}>
                      {expirationLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}