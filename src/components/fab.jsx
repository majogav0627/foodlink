import { useNavigate } from 'react-router-dom';
import './fab.css';

export default function Fab() {
  const navigate = useNavigate();
  
  return (
    <button 
      className="fab" 
      onClick={() => navigate('/publish')} 
      aria-label="Publicar donación"
    >
      <span className="material-symbols-rounded">add</span>
    </button>
  );
}