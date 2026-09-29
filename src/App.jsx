import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
const LoginScreen = lazy(() => import('./screens/login_screen'));
const DashboardScreen = lazy(() => import('./screens/dashboard_screen'));
const DetailScreen = lazy(() => import('./screens/detail_screen'));
const PublishScreen = lazy(() => import('./screens/publish_screen'));
const MapScreen = lazy(() => import('./screens/map_screen'));
const ProfileScreen = lazy(() => import('./screens/profile_screen'));
const EditProfileScreen = lazy(() => import('./screens/edit_profile_screen'));
const SelectLocationScreen = lazy(() => import('./screens/select_location_screen'));
import BottomNav from './components/bottom_nav';
import Fab from './components/fab';
import ToastNotification from './components/toast_notification';
import { useApp } from './context/AppContext';
import './App.css';

function App() {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  // Determine if Fab should be shown based on current route
  const showFabRoutes = ['/dashboard', '/map'];
  const showFab = showFabRoutes.includes(location.pathname) && isAuthenticated;

  // Hide BottomNav on these routes
  const hideBottomNavRoutes = ['/', '/detail', '/edit_profile', '/select_location'];
  const showBottomNav = isAuthenticated && !hideBottomNavRoutes.some(route => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  });

  return (
    <div className="app_container">
      <Suspense fallback={
        <div className="page_loader">
          <div className="loader_circle"></div>
          <p className="text-body-md" style={{ marginTop: '12px' }}>Cargando...</p>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/detail/:donacionId" element={<DetailScreen />} />
          <Route path="/publish" element={<PublishScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/select_location/:donacionId" element={<SelectLocationScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/edit_profile" element={<EditProfileScreen />} />
        </Routes>
      </Suspense>

      {showFab && <Fab />}
      {showBottomNav && <BottomNav />}
      <ToastNotification />
    </div>
  );
}

export default App;