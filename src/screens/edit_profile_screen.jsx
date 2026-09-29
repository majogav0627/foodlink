import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './edit_profile_screen.css';
import { useApp } from '../context/AppContext';
import { generateInitialAvatar } from '../utils/avatarUtils';

// Fix for default icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setFormData, setMapCenter }) {
  const map = useMapEvents({
    click(e) {
      const nextCoords = [e.latlng.lat, e.latlng.lng];
      setFormData(prev => ({ ...prev, coordenadas: nextCoords }));
      setMapCenter(nextCoords);
    },
    locationfound(e) {
      const nextCoords = [e.latlng.lat, e.latlng.lng];
      setFormData(prev => ({ ...prev, coordenadas: nextCoords }));
      setMapCenter(nextCoords);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
}

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, updateUser, addNotification } = useApp();

  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || '',
    ubicacion_GPS: currentUser?.ubicacion_GPS || '',
    foto_perfil: currentUser?.foto_perfil || generateInitialAvatar(currentUser?.nombre || 'U', 150),
    coordenadas: currentUser?.coordenadas || [13.6929, -89.2182],
  });

  const [photoPreview, setPhotoPreview] = useState(generateInitialAvatar(currentUser?.nombre || 'U', 200));
  const fileInputRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(formData.coordenadas);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      addNotification({ type: 'error', message: 'Por favor selecciona una imagen válida' });
      return;
    }
    
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setFormData(prev => ({ ...prev, foto_perfil: preview }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Por favor ingresa un nombre';
    }
    if (!formData.ubicacion_GPS.trim()) {
      newErrors.ubicacion_GPS = 'Por favor ingresa una ubicación';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateUser({
      nombre: formData.nombre,
      ubicacion_GPS: formData.ubicacion_GPS,
      foto_perfil: formData.foto_perfil,
      coordenadas: formData.coordenadas
    });

    addNotification({ 
      type: 'success', 
      message: 'Perfil actualizado correctamente' 
    });

    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', backgroundColor: 'var(--color-bg-subtle)' }} className="no-scrollbar">
      <div className="edit_header">
        <button className="back_button" onClick={handleCancel}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 className="text-heading-2" style={{ color: 'white' }}>Editar Perfil</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ marginTop: '16px', marginBottom: '32px', textAlign: 'center' }}>
          <div 
            className="edit_photo_container"
            onClick={handlePhotoClick}
          >
            <img src={photoPreview} alt="Foto de perfil" className="edit_photo" />
            <div className="edit_photo_overlay">
              <span className="material-symbols-rounded">camera_alt</span>
              <p className="text-caption" style={{ marginTop: '4px' }}>Cambiar foto</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="edit_form">
          <div className="form_group">
            <label className="form_label text-body-md">Nombre Completo</label>
            <div className="form_input_wrapper">
              <span className="material-symbols-rounded form_input_icon">person</span>
              <input
                type="text"
                name="nombre"
                className="form_input"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{ borderColor: errors.nombre ? '#EF4444' : '#E5E7EB' }}
              />
            </div>
            {errors.nombre && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.nombre}</span>}
          </div>

          <div className="form_group">
            <label className="form_label text-body-md">Ubicación</label>
            <div className="form_input_wrapper">
              <span className="material-symbols-rounded form_input_icon">location_on</span>
              <input
                type="text"
                name="ubicacion_GPS"
                className="form_input"
                placeholder="Tu ubicación"
                value={formData.ubicacion_GPS}
                onChange={handleInputChange}
                style={{ borderColor: errors.ubicacion_GPS ? '#EF4444' : '#E5E7EB' }}
              />
            </div>
            {errors.ubicacion_GPS && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.ubicacion_GPS}</span>}
          </div>
          
          <div className="form_group">
            <label className="form_label text-body-md">Selecciona tu ubicación en el mapa</label>
            <div className="map_container_edit_profile">
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                scrollWheelZoom={false} 
                style={{ height: '300px', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={formData.coordenadas} />
                <LocationMarker setFormData={setFormData} setMapCenter={setMapCenter} />
              </MapContainer>
            </div>
            <p className="text-caption" style={{ color: 'var(--color-ink-secondary)', marginTop: '8px' }}>
              Coordenadas: {formData.coordenadas[0].toFixed(4)}, {formData.coordenadas[1].toFixed(4)}
            </p>
          </div>

          <div className="info_box">
            <span className="material-symbols-rounded">info</span>
            <p className="text-caption">
              Estos datos se mostrarán en tu perfil público.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', marginBottom: '24px' }}>
          <button className="btn_cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="btn_save" onClick={handleSave}>
            <span className="material-symbols-rounded">check</span>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
