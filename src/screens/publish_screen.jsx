import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './publish_screen.css';
import { categorias } from '../data/mock_data';
import { useApp } from '../context/AppContext';

export default function PublishScreen() {
  const navigate = useNavigate();
  const { currentUser, addDonation, addNotification } = useApp();
  const [step, setStep] = useState(1);
  const isBusinessVerified = currentUser?.verificado === true;
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    categoria: '',
    descripcion: '',
    cantidad: '',
    unidad: 'unidades',
    fecha: '',
    horaLimite: '',
    modalidadesDisponibles: ['en sitio', 'domicilio']
  });

  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.categoria) newErrors.categoria = 'Por favor selecciona una categoría';
      if (!formData.cantidad) newErrors.cantidad = 'La cantidad es requerida';
    }
    if (step === 2) {
      if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
      if (!formData.horaLimite) newErrors.horaLimite = 'La hora es requerida';
    }
    if (step === 3) {
      if (!formData.modalidadesDisponibles || formData.modalidadesDisponibles.length === 0) {
        newErrors.modalidadesDisponibles = 'Elige al menos una modalidad de entrega';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      const now = new Date();
      const expirationValue = `${formData.fecha}T${formData.horaLimite}`;
      const expiryTime = new Date(expirationValue);
      const isValidExpiry = !isNaN(expiryTime.getTime());

      const selectedModalidades = formData.modalidadesDisponibles && formData.modalidadesDisponibles.length > 0
        ? formData.modalidadesDisponibles
        : ['en sitio'];

      const newDonation = {
        tipo_alimento: formData.categoria,
        cantidad: `${formData.cantidad} ${formData.unidad}`,
        descripcion: formData.descripcion || 'Sin descripción',
        foto_url: imagePreview || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600',
        fotos: imagePreview ? [imagePreview] : ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600'],
        hora_publicacion: now.toISOString(),
        hora_limite_recogida: isValidExpiry ? expiryTime.toISOString() : new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        modalidad_entrega: selectedModalidades[0],
        modalidades_disponibles: selectedModalidades,
        categoria: formData.categoria,
        donante: {
          nombre: currentUser?.nombre || 'Donante',
          foto: currentUser?.foto_perfil || 'https://i.pravatar.cc/150',
          valoracion: currentUser?.valoracion_promedio ?? 0,
          total_donaciones: currentUser?.total_donaciones ?? 0,
          verificado: currentUser?.verificado ?? false,
          ubicacion_GPS: currentUser?.ubicacion_GPS || 'San Salvador, Colonia Escalón',
        },
        distancia: '0.5 km',
        coordenadas: currentUser?.coordenadas || [13.7013, -89.2244]
      };

      try {
        addDonation(newDonation);
      } catch (error) {
        addNotification({ type: 'error', message: error.message });
        return;
      }

      addNotification({ 
        type: 'success', 
        message: '¡Tu donación ha sido publicada!' 
      });
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/dashboard');
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      addNotification({ type: 'error', message: 'Por favor selecciona una imagen válida' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="publish_container">
      {/* Header & Stepper */}
      <div className="publish_header">
        <div className="publish_header_top">
          <button className="back_button" onClick={handleBack}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <span className="text-heading-2">Publicar Donación</span>
        </div>

        <div className="stepper_container">
          <div className="stepper_line"></div>
          <div className={`step_indicator ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>
            {step > 1 ? <span className="material-symbols-rounded" style={{fontSize: 20}}>check</span> : '1'}
          </div>
          <div className={`step_indicator ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
            {step > 2 ? <span className="material-symbols-rounded" style={{fontSize: 20}}>check</span> : '2'}
          </div>
          <div className={`step_indicator ${step === 3 ? 'active' : ''}`}>
            3
          </div>
        </div>
      </div>

      {/* STEP 1: Detalles del Alimento */}
      {step === 1 && (
        <div className="step_content">
          <h2 className="text-heading-2">¿Qué vas a donar?</h2>
          
          <div className="form_group">
            <label className="form_label text-body-md">Categoría</label>
            <div className="category_grid">
              {categorias.map(cat => (
                <div 
                  key={cat.id} 
                  className={`category_card ${formData.categoria === cat.nombre ? 'selected' : ''}`}
                  onClick={() => updateForm('categoria', cat.nombre)}
                  style={{ borderColor: errors.categoria ? '#EF4444' : 'transparent' }}
                >
                  <span className="material-symbols-rounded">{cat.icono}</span>
                  <span className="text-caption" style={{fontWeight: 600}}>{cat.nombre}</span>
                </div>
              ))}
            </div>
            {errors.categoria && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.categoria}</span>}
          </div>

          <div className="form_group">
            <label className="form_label text-body-md">Descripción (Opcional)</label>
            <textarea 
              className="form_textarea" 
              placeholder="Ej. 10 porciones de comida para compartir"
              value={formData.descripcion}
              onChange={(e) => updateForm('descripcion', e.target.value)}
            />
          </div>

          <div className="form_group" style={{ flexDirection: 'row', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form_label text-body-md">Cantidad</label>
              <input 
                type="number" 
                className="form_input" 
                placeholder="Ej. 12" 
                value={formData.cantidad}
                onChange={(e) => updateForm('cantidad', e.target.value)}
                style={{ borderColor: errors.cantidad ? '#EF4444' : '#E5E7EB' }}
              />
              {errors.cantidad && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.cantidad}</span>}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form_label text-body-md">Unidad</label>
              <select 
                className="form_select" 
                value={formData.unidad}
                onChange={(e) => updateForm('unidad', e.target.value)}
              >
                <option value="unidades">Unidades</option>
                <option value="kg">Kilogramos</option>
                <option value="litros">Litros</option>
                <option value="porciones">Porciones</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Disponibilidad */}
      {step === 2 && (
        <div className="step_content">
          <h2 className="text-heading-2">Disponibilidad</h2>
          
          <div className="form_group">
            <label className="form_label text-body-md">Fecha de disponibilidad</label>
            <input 
              type="date" 
              className="form_input" 
              value={formData.fecha}
              onChange={(e) => updateForm('fecha', e.target.value)}
              style={{ borderColor: errors.fecha ? '#EF4444' : '#E5E7EB' }}
            />
            {errors.fecha && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.fecha}</span>}
          </div>

          <div className="form_group">
            <label className="form_label text-body-md">Hora límite de recogida</label>
            <input 
              type="time" 
              className="form_input" 
              value={formData.horaLimite}
              onChange={(e) => updateForm('horaLimite', e.target.value)}
              style={{ borderColor: errors.horaLimite ? '#EF4444' : '#E5E7EB' }}
            />
            {errors.horaLimite && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.horaLimite}</span>}
          </div>

          <div className="info_note">
            <span className="material-symbols-rounded">notifications_active</span>
            <p className="text-caption">
              <strong>Nota:</strong> Los receptores cercanos serán notificados inmediatamente tras publicar esta donación.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Entrega y Foto */}
      {step === 3 && (
        <div className="step_content">
          <h2 className="text-heading-2">Detalles finales</h2>
          
          <div className="form_group">
            <label className="form_label text-body-md">Modalidades de entrega</label>
            <div className="toggle_group">
              {[
                { key: 'en sitio', label: 'Recogida en sitio' },
                { key: 'domicilio', label: 'Entrega a domicilio' }
              ].map(option => {
                const selected = formData.modalidadesDisponibles.includes(option.key);
                return (
                  <div
                    key={option.key}
                    className={`toggle_option ${selected ? 'selected' : ''}`}
                    onClick={() => {
                      const current = formData.modalidadesDisponibles || [];
                      const updated = current.includes(option.key)
                        ? current.filter(item => item !== option.key)
                        : [...current, option.key];
                      updateForm('modalidadesDisponibles', updated);
                    }}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
            {errors.modalidadesDisponibles && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.modalidadesDisponibles}</span>}
          </div>

          <div className="form_group">
            <label className="form_label text-body-md">Foto del alimento (Opcional)</label>
            <div
              className={`photo_upload_area ${dragActive ? 'drag_active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="photo_input"
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="photo_preview" />
              ) : (
                <div className="photo_placeholder">
                  <span className="material-symbols-rounded" style={{fontSize: 48, opacity: 0.5}}>add_a_photo</span>
                  <p className="text-body-md">Arrastra una imagen aquí o haz click para elegir</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer / Botones */}
      {!isBusinessVerified && (
        <div className="warning_box" style={{ margin: '0 16px 12px', padding: '16px', borderRadius: '16px', backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B' }}>
          <span className="material-symbols-rounded" style={{ marginRight: '8px', verticalAlign: 'middle' }}>error</span>
          Solo los negocios verificados pueden publicar donaciones. Si tu cuenta no está verificada, no podrás completar la publicación.
        </div>
      )}
      <div className="publish_footer">
        {step > 1 && (
          <button className="btn_back_step" onClick={handleBack}>Anterior</button>
        )}
        <button className="btn_next" onClick={handleNext} disabled={!isBusinessVerified}>
          {step === 3 ? 'Publicar donación ahora' : 'Siguiente'}
        </button>
      </div>

    </div>
  );
}
