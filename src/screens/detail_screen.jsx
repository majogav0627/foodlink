import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateInitialAvatar } from '../utils/avatarUtils';
import './detail_screen.css';

const DetailScreen = () => {
  const { donacionId } = useParams();
  const navigate = useNavigate();
  const { getDonacionById, addNotification, isFavorito, toggleFavorito, currentUser, deleteDonation, updateDonation } = useApp();
  
  const donacion = getDonacionById(donacionId);
  const fotos = donacion?.fotos || [donacion?.foto_url] || [];
  const modalidadesDisponibles = donacion?.modalidades_disponibles || (donacion?.modalidad_entrega ? [donacion.modalidad_entrega] : []);
  const [activePhoto, setActivePhoto] = useState(fotos[0]);
  const [selectedModalidad, setSelectedModalidad] = useState(modalidadesDisponibles[0] || null);
  const [nombreRecogedor, setNombreRecogedor] = useState('');
  const esFavorito = isFavorito(donacionId);
  
  // Detectar si es el dueño de la donación
  const esPropiaDonacion = donacion && currentUser && donacion.donante.nombre === currentUser.nombre;
  
  // Estados para edición
  const [isEditingCantidad, setIsEditingCantidad] = useState(false);
  const [cantidadEditada, setCantidadEditada] = useState(donacion?.cantidad || '');

  const handleDeliveryAction = () => {
    if (selectedModalidad === 'domicilio') {
      navigate(`/select_location/${donacionId}`);
      return;
    }

    // Validar nombre para recogida en sitio
    if (selectedModalidad === 'en sitio' && !nombreRecogedor.trim()) {
      addNotification({ 
        type: 'error', 
        message: 'Por favor ingresa el nombre de quien va a recoger' 
      });
      return;
    }

    const entregaTexto = 'para recogida en tienda';
    const mensajePersona = selectedModalidad === 'en sitio' ? ` Persona encargada: ${nombreRecogedor}` : '';
    addNotification({ 
      type: 'success', 
      message: `¡Solicitud enviada! ${donacion.donante.nombre} será notificado ${entregaTexto}.${mensajePersona}` 
    });
  };

  const handleEditarCantidad = () => {
    updateDonation(donacionId, { cantidad: cantidadEditada });
    setIsEditingCantidad(false);
    addNotification({
      type: 'success',
      message: 'Cantidad actualizada'
    });
  };

  const handleEliminarDonacion = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta donación?')) {
      deleteDonation(donacionId);
      addNotification({
        type: 'success',
        message: 'Donación eliminada'
      });
      navigate('/dashboard');
    }
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--/--/----' : date.toLocaleDateString('es-ES');
  };

  const getExpirationLabel = (expiration) => {
    const diff = new Date(expiration) - new Date();
    if (Number.isNaN(diff) || diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expira en ${hours}h ${minutes}min` : `Expira en ${minutes} min`;
  };

  if (!donacion) {
    return (
      <div className="detail_container">
        <div className="detail_header">
          <button className="back_button" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <span className="text-heading-2">Detalle de Donación</span>
        </div>
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-ink-secondary)' }}>
          <p className="text-body-md">Donación no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail_container">
      <div className="detail_header">
        <button className="back_button" onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <span className="text-heading-2">Detalle de Donación</span>
        <button 
          onClick={() => toggleFavorito(donacionId)}
          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px' }}
        >
          <span className={`material-symbols-rounded ${esFavorito ? 'filled' : ''}`} style={{ color: esFavorito ? 'var(--color-secondary)' : 'var(--color-ink-primary)' }}>favorite</span>
        </button>
      </div>

      <div className="hero_image_container image_slider_container">
        <img src={activePhoto} alt={donacion.tipo_alimento} className="hero_image" />
      </div>

      {fotos.length > 1 && (
        <div className="photo_gallery">
          {fotos.map((foto, index) => (
            <button
              key={index}
              type="button"
              className={`gallery_thumb ${foto === activePhoto ? 'active' : ''}`}
              onClick={() => setActivePhoto(foto)}
            >
              <img src={foto} alt={`Foto ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className="content_section">
        {/* Info del Donante */}
        <div className="donante_info">
          <img src={generateInitialAvatar(donacion.donante.nombre, 48)} alt="Donante" className="donante_avatar" />
          <div className="donante_text">
            <div className="donante_name_row">
              <span className="text-body-md" style={{ fontWeight: 600 }}>{donacion.donante.nombre}</span>
              <span className="material-symbols-rounded verified_badge filled">verified</span>
            </div>
            <div className="donante_stats text-caption">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-rounded star_icon filled">star</span>
                {donacion.donante.valoracion}
              </span>
              {donacion.donante.total_donaciones && (
                <>
                  <span>·</span>
                  <span>{donacion.donante.total_donaciones} donaciones realizadas</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info del Alimento */}
        <div className="food_info">
          <h1 className="text-heading-1">{donacion.tipo_alimento}</h1>
          <p className="text-body-md" style={{ color: 'var(--color-ink-secondary)' }}>
            {donacion.descripcion}
          </p>
          <div className="food_meta text-caption">
            <div className="food_meta_item">
              <span className="material-symbols-rounded">scale</span>
              <span>{donacion.cantidad}</span>
            </div>
            <div className="food_meta_item">
              <span className="material-symbols-rounded">calendar_today</span>
              <span>{formatDate(donacion.hora_limite_recogida)}</span>
            </div>
          </div>
        </div>

        {/* Selección de modalidad o opciones de edición */}
        {esPropiaDonacion ? (
          <div className="edit_section">
            <h2 className="text-heading-2">Mis opciones</h2>
            
            {/* Editar cantidad */}
            <div className="edit_item">
              <label className="text-body-md">Cantidad</label>
              {isEditingCantidad ? (
                <div className="edit_input_group">
                  <input
                    type="text"
                    value={cantidadEditada}
                    onChange={(e) => setCantidadEditada(e.target.value)}
                    className="edit_input"
                    placeholder="Ej: 5 porciones"
                  />
                  <button
                    className="btn_inline_primary"
                    onClick={handleEditarCantidad}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="edit_display">
                  <span className="text-body-md">{donacion.cantidad}</span>
                  <button
                    className="btn_inline_secondary"
                    onClick={() => {
                      setIsEditingCantidad(true);
                      setCantidadEditada(donacion.cantidad);
                    }}
                  >
                    <span className="material-symbols-rounded">edit</span>
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="edit_action_section">
              <button className="btn_primary_action" style={{ backgroundColor: '#22C55E' }} onClick={() => {
                addNotification({
                  type: 'success',
                  message: 'Cambios guardados'
                });
              }}>
                <span className="material-symbols-rounded">check_circle</span>
                Guardar cambios
              </button>
              <button className="btn_danger" onClick={handleEliminarDonacion}>
                <span className="material-symbols-rounded">delete</span>
                Eliminar donación
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="delivery_mode_section">
              <h2 className="text-heading-2">Selecciona modalidad</h2>
              <div className="toggle_group">
                {modalidadesDisponibles.length === 0 ? (
                  <div className="toggle_option selected">Sin modalidad disponible</div>
                ) : (
                  modalidadesDisponibles.map((mode) => {
                    const label = mode === 'domicilio' ? 'Entrega a domicilio' : 'Recoger en sitio';
                    return (
                      <button
                        key={mode}
                        type="button"
                        className={`toggle_option ${selectedModalidad === mode ? 'selected' : ''}`}
                        onClick={() => setSelectedModalidad(mode)}
                      >
                        {label}
                      </button>
                    );
                  })
                )}
              </div>
              {modalidadesDisponibles.length === 1 && (
                <p className="text-caption" style={{ color: 'var(--color-ink-secondary)', marginTop: '8px' }}>
                  Esta donación solo está disponible para {modalidadesDisponibles[0] === 'domicilio' ? 'entrega a domicilio' : 'recogida en sitio'}.
                </p>
              )}
            </div>

            {/* Input para nombre de recogedor si es recogida en sitio */}
            {selectedModalidad === 'en sitio' && (
              <div className="recogedor_input_section">
                <label className="text-body-md">Nombre de quien va a recoger</label>
                <input
                  type="text"
                  value={nombreRecogedor}
                  onChange={(e) => setNombreRecogedor(e.target.value)}
                  placeholder="Ej: Juan García"
                  className="recogedor_input"
                />
              </div>
            )}

            {/* Contador Regresivo Prominente */}
            <div className="timer_container">
              <span className="material-symbols-rounded timer_icon">schedule</span>
              <span className="text-body-md timer_text">{getExpirationLabel(donacion.hora_limite_recogida)}</span>
            </div>

            {/* Botón de acción principal */}
            <div className="delivery_action_section">
              <button className="btn_primary_action" onClick={handleDeliveryAction}>
                <span className="material-symbols-rounded">volunteer_activism</span>
                {selectedModalidad === 'domicilio' ? 'Elegir lugar de entrega' : 'Confirmar recogida en tienda'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailScreen;
