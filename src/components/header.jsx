import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, showLogo = true, showProfile = true }) {
  const navigate = useNavigate();

  return (
    <header style={{ 
      padding: '12px 16px', 
      backgroundColor: 'var(--color-bg-base)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--color-bg-subtle)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="material-symbols-rounded"
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--color-ink-primary)'
            }}
          >
            arrow_back
          </button>
        )}
        
        {showLogo && !title && (
          <img 
            src="/images/logo-icon.png" 
            alt="FOODLINK" 
            style={{ width: '56px', height: '56px', cursor: 'pointer', marginLeft: '-8px' }}
            onClick={() => navigate('/dashboard')}
          />
        )}
        
        {title && (
          <h1 className="text-heading-2" style={{ color: 'var(--color-ink-primary)' }}>
            {title}
          </h1>
        )}
      </div>

      {showProfile && (
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <span className="material-symbols-rounded" style={{ fontSize: '24px', color: 'var(--color-ink-primary)' }}>account_circle</span>
        </div>
      )}
    </header>
  );
}
