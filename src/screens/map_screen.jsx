import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map_screen.css';
import { categorias, aliados } from '../data/mock_data';
import { useApp } from '../context/AppContext';
import Header from '../components/header';

export default function MapScreen() {
  const navigate = useNavigate();
  const { donaciones, currentUser } = useApp();
  const defaultCoords = currentUser?.coordenadas || [13.7013, -89.2244];
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('Todas');
  const [userLocation, setUserLocation] = useState(defaultCoords);
  const [mapRef, setMapRef] = useState(null);

  // Pedir ubicación real
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (mapRef) {
            mapRef.flyTo([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
          // Si falla, se queda en las coordenadas default
        }
      );
    }
  }, [mapRef]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (mapRef) {
            mapRef.flyTo([latitude, longitude], 15);
          }
        },
        () => {
          alert("No se pudo obtener la ubicación. Por favor, habilita el GPS.");
        }
      );
    }
  };

  const getExpirationLabel = (expiration) => {
    const diff = new Date(expiration) - new Date();
    if (Number.isNaN(diff) || diff <= 0) {
      return 'Expirado';
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expira en ${hours}h ${minutes}min` : `Expira en ${minutes} min`;
  };

  const categoryColors = {
    "Frutas/Verduras": "#22C55E",
    "Panadería": "#EAB308",
    "Comida Preparada": "#F97316",
    "Lácteos": "#3B82F6",
    "Otros": "#6B7280"
  };

  // Custom Icons logic
  const createIcon = (color, isUrgent) => {
    return L.divIcon({
      className: '',
      html: `<div class="custom_marker ${isUrgent ? 'marker_urgent' : ''}" style="background-color: ${color};"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const createAllyIcon = () => {
    return L.divIcon({
      className: '',
      html: `<div class="custom_marker" style="background-color: #3B82F6;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const handleMarkerClick = (item, type) => {
    setSelectedItem({ ...item, itemType: type });
  };

  const filters = ['Todas', ...categorias.map(c => c.nombre)];

  return (
    <div className="map_screen_layout">
      <Header title="Mapa de Donaciones" showBack={true} showLogo={false} showProfile={true} />
      
      {/* Header & Filters Section */}
      <div className="map_header_section" style={{ paddingTop: '12px' }}>
        <div className="map_filters">
          {filters.map(f => {
            const isSelected = filter === f;
            const color = categoryColors[f] || 'var(--color-ink-primary)';
            return (
              <button 
                key={f} 
                className={`filter_pill ${isSelected ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{
                  color: isSelected ? 'white' : 'var(--color-ink-primary)',
                  border: isSelected ? `1px solid ${color}` : '1px solid transparent',
                  backgroundColor: isSelected ? color : 'var(--color-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {f !== 'Todas' && <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: isSelected ? 'white' : color}}></span>}
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* Encapsulated Map Card */}
      <div className="map_card_wrapper">
        <div className="map_card">
          <MapContainer 
            center={userLocation} 
            zoom={14} 
            zoomControl={false}
            whenCreated={setMapRef}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* User Location */}
            <Marker 
              position={userLocation} 
              icon={L.divIcon({className: 'custom_marker_user', html: '<div class="user_dot"></div>', iconSize: [20,20]})} 
            />

            {/* Donations */}
            {donaciones
              .filter(d => (filter === 'Todas' || d.categoria === filter))
              .filter(d => Array.isArray(d.coordenadas) && d.coordenadas.length === 2)
              .map((d) => {
                const color = categoryColors[d.categoria] || '#6B7280';
                return (
                  <Marker 
                    key={d.id_donacion}
                    position={d.coordenadas}
                    icon={createIcon(color, false)}
                    eventHandlers={{ click: () => handleMarkerClick(d, 'donacion') }}
                  />
                );
              })}

            {/* Allies / NGOs */}
            {filter === 'Todas' && aliados.map((a) => (
              <Marker 
                key={a.id}
                position={a.coordenadas}
                icon={createAllyIcon()}
                eventHandlers={{ click: () => handleMarkerClick(a, 'ally') }}
              />
            ))}
          </MapContainer>
          
          <button className="locate_me_btn" onClick={handleLocateMe}>
            <span className="material-symbols-rounded">my_location</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className={`bottom_sheet ${selectedItem ? 'open' : ''}`}>
        <div className="sheet_handle" onClick={() => setSelectedItem(null)}></div>
        
        {selectedItem && selectedItem.itemType === 'donacion' && (
          <>
            <div className="sheet_content">
              <img src={selectedItem.foto_url} alt="food" className="sheet_img" />
              <div className="sheet_info">
                <span className="text-heading-2" style={{lineHeight: '1.2'}}>{selectedItem.tipo_alimento}</span>
                <span className="text-body-md" style={{color: 'var(--color-ink-secondary)'}}>{selectedItem.donante.nombre}</span>
                <div style={{display: 'flex', gap: '4px', alignItems: 'center', marginTop: '4px', color: getExpirationLabel(selectedItem.hora_limite_recogida) === 'Expirado' ? 'var(--color-secondary)' : 'var(--color-ink-secondary)'}}>
                  <span className="material-symbols-rounded" style={{fontSize: '16px'}}>schedule</span>
                  <span className="text-caption" style={{fontWeight: 600}}>
                    {getExpirationLabel(selectedItem.hora_limite_recogida)}
                  </span>
                </div>
              </div>
            </div>
            <button className="sheet_btn" onClick={() => navigate(`/detail/${selectedItem.id_donacion}`)}>Ver detalle</button>
          </>
        )}

        {selectedItem && selectedItem.itemType === 'ally' && (
          <>
            <div className="sheet_content">
              <div className="sheet_img" style={{backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span className="material-symbols-rounded" style={{fontSize: 40, color: '#3B82F6'}}>volunteer_activism</span>
              </div>
              <div className="sheet_info">
                <span className="text-heading-2" style={{lineHeight: '1.2'}}>{selectedItem.nombre}</span>
                <span className="text-body-md" style={{color: 'var(--color-ink-secondary)'}}>{selectedItem.descripcion}</span>
                <span className="text-caption" style={{color: '#3B82F6', fontWeight: 600, marginTop: '4px'}}>Aliado Verificado</span>
              </div>
            </div>
            <button className="sheet_btn" style={{backgroundColor: '#3B82F6'}} onClick={() => setSelectedItem(null)}>Cerrar</button>
          </>
        )}
      </div>

    </div>
  );
}