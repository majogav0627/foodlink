import { useEffect, useState } from 'react';
import './success_alert.css';

export default function SuccessAlert({ message, onClose, autoClose = true, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Espera a que termine la animación
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) return null;

  return (
    <div className="success_alert_overlay" onClick={handleClose}>
      <div className="success_alert_container" onClick={(e) => e.stopPropagation()}>
        <div className="success_alert_content">
          <div className="success_checkmark">
            <div className="checkmark_circle">
              <span className="material-symbols-rounded">check</span>
            </div>
          </div>
          <h3 className="text-heading-2" style={{ marginTop: '16px', marginBottom: '8px' }}>
            ¡Éxito!
          </h3>
          <p className="text-body-md" style={{ color: 'var(--color-ink-secondary)', marginBottom: '24px', textAlign: 'center' }}>
            {message}
          </p>
          <button className="success_alert_btn" onClick={handleClose}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
