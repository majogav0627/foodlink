import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const [email, setEmail] = useState(() => localStorage.getItem('foodlink_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('foodlink_password') || '');
  const [role, setRole] = useState('cliente');
  const [businessName, setBusinessName] = useState('');
  const [businessOwner, setBusinessOwner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, addNotification } = useApp();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validación
      if (!email.trim()) {
        throw new Error('El email es requerido');
      }
      if (!validateEmail(email)) {
        throw new Error('Por favor ingresa un email válido');
      }
      if (!password) {
        throw new Error('La contraseña es requerida');
      }
      if (password.length < 4) {
        throw new Error('La contraseña debe tener al menos 4 caracteres');
      }

      if (role === 'donador') {
        if (!businessName.trim()) {
          throw new Error('El nombre del negocio es requerido para donadores');
        }
        if (!businessOwner.trim()) {
          throw new Error('La persona encargada es requerida para donadores');
        }
      }

      // Login
      login(email, password, role, businessName, businessOwner);
      addNotification({ 
        type: 'success', 
        message: role === 'donador'
          ? 'Solicitud de donador enviada. Ya puedes publicar como donador.'
          : `¡Bienvenido ${email.split('@')[0]}!` 
      });
      
      // Simular delay de red
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch (err) {
      setError(err.message);
      addNotification({ 
        type: 'error', 
        message: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      <img 
        src="/images/logo-horizontal.png" 
        alt="FOODLINK" 
        style={{ maxWidth: '280px', height: 'auto', marginBottom: '32px' }}
      />
      <p className="text-body-md" style={{ color: 'var(--color-ink-secondary)', marginBottom: '48px', textAlign: 'center' }}>Conecta. Dona. Transforma.</p>
      
      {error && (
        <div style={{ width: '100%', padding: '12px', marginBottom: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', textAlign: 'center' }} className="text-body-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setRole('cliente')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: role === 'cliente' ? '2px solid var(--color-primary)' : '1px solid #E5E7EB',
              backgroundColor: role === 'cliente' ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface)',
              color: 'var(--color-ink-primary)',
              cursor: 'pointer'
            }}
          >
            Cliente / Receptor
          </button>
          <button
            type="button"
            onClick={() => setRole('donador')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: role === 'donador' ? '2px solid var(--color-primary)' : '1px solid #E5E7EB',
              backgroundColor: role === 'donador' ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface)',
              color: 'var(--color-ink-primary)',
              cursor: 'pointer'
            }}
          >
            Donador
          </button>
        </div>

        <input 
          type="email" 
          placeholder="Correo electrónico" 
          className="text-body-md"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '16px', backgroundColor: 'var(--color-surface)', boxSizing: 'border-box', opacity: loading ? 0.6 : 1 }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="text-body-md"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '16px', backgroundColor: 'var(--color-surface)', boxSizing: 'border-box', opacity: loading ? 0.6 : 1 }}
        />
        {role === 'donador' && (
          <div style={{ marginBottom: '16px', padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(236, 253, 245, 0.9)', border: '1px solid #D1FAE5' }}>
            <label className="text-body-md" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Solicitud de donador</label>
            <input
              type="text"
              placeholder="Nombre del negocio"
              className="text-body-md"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '12px', backgroundColor: 'white', boxSizing: 'border-box', opacity: loading ? 0.6 : 1 }}
            />
            <input
              type="text"
              placeholder="Persona encargada"
              className="text-body-md"
              value={businessOwner}
              onChange={(e) => setBusinessOwner(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', boxSizing: 'border-box', opacity: loading ? 0.6 : 1 }}
            />
          </div>
        )}
        <button 
          type="submit"
          disabled={loading}
          className="text-heading-2"
          style={{ width: '100%', padding: '16px', borderRadius: '8px', backgroundColor: loading ? '#9CA3AF' : 'var(--color-primary)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="text-caption" style={{ color: 'var(--color-ink-secondary)' }}>¿No tienes cuenta? <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Regístrate</span></p>
    </div>
  );
}

