import { useApp } from '../context/AppContext';
import './toast_notification.css';

export default function ToastNotification() {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="toast_container">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`toast toast_${notif.type || 'info'}`}
        >
          <div className="toast_content">
            <span className="material-symbols-rounded toast_icon">
              {notif.type === 'success' ? 'check_circle' : notif.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="text-body-md">{notif.message}</span>
          </div>
          <button 
            onClick={() => removeNotification(notif.id)}
            className="toast_close"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
