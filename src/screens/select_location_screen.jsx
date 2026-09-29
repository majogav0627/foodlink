import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import './select_location_screen.css';

const LocationMarker = ({ position, onMove }) => {
  useMapEvents({
    click(e) {
      onMove([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
};

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
};

export default function SelectLocationScreen() {
  const { donacionId } = useParams();
  const navigate = useNavigate();
  const { currentUser, addNotification } = useApp();

  const defaultCoords = currentUser?.coordenadas || [13.7013, -89.2244];
  const defaultAddress = currentUser?.ubicacion_GPS || 'Mi ubicación actual';

  const [selectedLocation, setSelectedLocation] = useState(defaultCoords);
  const [addressInput, setAddressInput] = useState(defaultAddress);
  const [selectedSuggestion, setSelectedSuggestion] = useState('home');

  const suggestions = [
    { id: 'home', label: 'Mi ubicación', address: defaultAddress, coords: defaultCoords },
    { id: 'office', label: 'Oficina', address: 'Col. Centro, Av. Las Palmas 110', coords: [13.704, -89.210] },
    { id: 'other', label: 'Otra dirección', address: 'Selecciona en el mapa', coords: selectedLocation },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentCoords = [latitude, longitude];
          setSelectedLocation(currentCoords);
          setAddressInput(defaultAddress);
        },
        () => {
          // No falla si no hay permisos
        }
      );
    }
  }, [defaultAddress]);

  const handleSuggestionClick = (item) => {
    setSelectedSuggestion(item.id);
    setAddressInput(item.address);
    setSelectedLocation(item.coords);
  };

  const handleMapMove = (coords) => {
    setSelectedSuggestion('other');
    setSelectedLocation(coords);
    setAddressInput(`Ubicación seleccionada: ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
  };

  const handleConfirm = () => {
    addNotification({
      type: 'success',
      message: `Dirección seleccionada: ${addressInput}. Se notificará al donante para entrega a domicilio.`,
    });
    navigate(`/detail/${donacionId}`);
  };

  return (
    <div className="select_location_container">
      <div className="detail_header">
        <button className="back_button" onClick={() => navigate(`/detail/${donacionId}`)}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <span className="text-heading-2">Selecciona dirección</span>
      </div>

      <div className="select_location_content">
        <p className="text-body-md subtitle_text">
          Elige dónde quieres recibir la entrega. Toca el mapa para mover el pin y actualiza la dirección.
        </p>

        <div className="address_input_group">
          <label className="form_label text-body-md">Dirección de entrega</label>
          <input
            type="text"
            className="location_input"
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              setSelectedSuggestion('other');
            }}
          />
        </div>

        <div className="address_section">
          <h2 className="text-heading-3">Direcciones rápidas</h2>
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`address_card ${selectedSuggestion === item.id ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(item)}
            >
              <div>
                <p className="text-body-md address_card_title">{item.label}</p>
                <p className="text-caption address_card_text">{item.address}</p>
              </div>
              {selectedSuggestion === item.id && (
                <span className="material-symbols-rounded">check_circle</span>
              )}
            </button>
          ))}
        </div>

        <div className="map_card">
          <MapContainer
            center={selectedLocation}
            zoom={15}
            scrollWheelZoom={false}
            doubleClickZoom={true}
            touchZoom={true}
            zoomControl={true}
            className="select_map"
            minZoom={12}
            maxZoom={18}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapUpdater position={selectedLocation} />
            <LocationMarker position={selectedLocation} onMove={handleMapMove} />
          </MapContainer>
          <div className="map_hint">
            Toca en el mapa para seleccionar una nueva ubicación.
          </div>
        </div>
      </div>

      <div className="select_location_footer">
        <button className="btn_primary_action" onClick={handleConfirm}>
          Confirmar dirección
        </button>
      </div>
    </div>
  );
}
