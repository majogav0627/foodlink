import { createContext, useContext, useState, useEffect } from 'react';
import { generateInitialAvatar } from '../utils/avatarUtils';

const AppContext = createContext();

const createNotificationId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `n${crypto.randomUUID()}`;
  }

  return `n${Date.now()}${Math.random().toString(16).slice(2)}`;
};

/* eslint-disable react-refresh/only-export-components */
export function AppProvider({ children }) {
  const readStorageValue = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const sampleLabels = ['Tamales de elote', 'Pan dulce variado', 'Verduras frescas mixtas'];
  const initialUser = readStorageValue('foodlink_user', null);
  const initialDonaciones = (() => {
    const storedDonaciones = readStorageValue('foodlink_donaciones', []);
    const containsSampleDonations = Array.isArray(storedDonaciones)
      && storedDonaciones.some(donation =>
        sampleLabels.includes(donation.tipo_alimento) ||
        sampleLabels.some(label => donation.descripcion?.includes(label))
      );

    if (containsSampleDonations) {
      localStorage.removeItem('foodlink_donaciones');
      localStorage.removeItem('foodlink_favoritos');
      return [];
    }

    return storedDonaciones;
  })();

  const [donaciones, setDonaciones] = useState(initialDonaciones);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [favoritos, setFavoritos] = useState(() => {
    const savedFavoritos = readStorageValue('foodlink_favoritos', []);
    const containsSampleDonations = Array.isArray(initialDonaciones)
      && initialDonaciones.some(donation =>
        sampleLabels.includes(donation.tipo_alimento) ||
        sampleLabels.some(label => donation.descripcion?.includes(label))
      );

    return containsSampleDonations ? [] : savedFavoritos;
  });
  const [notifications, setNotifications] = useState([]);

  // Guardar donaciones cuando cambien
  useEffect(() => {
    localStorage.setItem('foodlink_donaciones', JSON.stringify(donaciones));
  }, [donaciones]);

  // Guardar favoritos cuando cambien
  useEffect(() => {
    localStorage.setItem('foodlink_favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const login = (email, password, role = 'cliente', businessName = '', businessOwner = '') => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const isDonador = role === 'donador';
    if (isDonador && (!businessName.trim() || !businessOwner.trim())) {
      throw new Error('Nombre del negocio y persona encargada son requeridos para donadores');
    }

    const nombreUsuario = isDonador ? businessName : email.split('@')[0];
    const user = {
      id: `user_${Date.now()}`,
      nombre: nombreUsuario,
      foto_perfil: generateInitialAvatar(nombreUsuario, 150),
      ubicacion_GPS: 'San Salvador, Colonia Escalón',
      coordenadas: [13.7013, -89.2244],
      valoracion_promedio: 4.8,
      total_donaciones: 0,
      total_recepciones: 0,
      insignias: [],
      verificado: isDonador,
      rol: isDonador ? 'Donador' : 'Cliente',
      email,
      negocio: isDonador ? businessName : '',
      encargado: isDonador ? businessOwner : ''
    };

    localStorage.setItem('foodlink_user', JSON.stringify(user));
    localStorage.setItem('foodlink_email', email);
    localStorage.setItem('foodlink_password', password);

    setCurrentUser(user);
    setIsAuthenticated(true);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('foodlink_user');
    localStorage.removeItem('foodlink_email');
    localStorage.removeItem('foodlink_password');
    localStorage.removeItem('foodlink_phone');
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    setFavoritos([]);
  };

  const addDonation = (newDonation) => {
    if (!currentUser?.verificado) {
      throw new Error('Solo negocios verificados pueden publicar donaciones');
    }

    const donationWithId = {
      ...newDonation,
      id_donacion: newDonation.id_donacion || `d${Date.now()}`,
      hora_publicacion: new Date().toISOString(),
      coordenadas: newDonation.coordenadas || currentUser?.coordenadas || [13.7013, -89.2244],
      donante: newDonation.donante || {
        nombre: currentUser.nombre,
        foto: currentUser.foto_perfil,
        valoracion: currentUser.valoracion_promedio ?? 0,
        total_donaciones: currentUser.total_donaciones ?? 0,
        verificado: currentUser.verificado,
        ubicacion_GPS: currentUser.ubicacion_GPS,
      },
      distancia: newDonation.distancia || '0.5 km',
    };

    setDonaciones(prev => [donationWithId, ...prev]);
    return donationWithId;
  };

  const updateUser = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('foodlink_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const toggleFavorito = (donacionId) => {
    setFavoritos(prev => 
      prev.includes(donacionId) 
        ? prev.filter(id => id !== donacionId)
        : [...prev, donacionId]
    );
  };

  const isFavorito = (donacionId) => favoritos.includes(donacionId);

  const addNotification = (notification) => {
    const newNotif = {
      id: createNotificationId(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      removeNotification(newNotif.id);
    }, 5000);

    return newNotif;
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getDonacionById = (id) => donaciones.find(d => d.id_donacion === id);

  const deleteDonation = (donacionId) => {
    setDonaciones(prev => prev.filter(d => d.id_donacion !== donacionId));
  };

  const updateDonation = (donacionId, updates) => {
    setDonaciones(prev =>
      prev.map(d =>
        d.id_donacion === donacionId ? { ...d, ...updates } : d
      )
    );
  };

  const value = {
    donaciones,
    setDonaciones,
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    addDonation,
    updateUser,
    deleteDonation,
    updateDonation,
    favoritos,
    toggleFavorito,
    isFavorito,
    notifications,
    addNotification,
    removeNotification,
    getDonacionById
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
}
