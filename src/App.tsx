import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { CampusProvider } from './context/CampusContext';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrowsePage } from './pages/BrowsePage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { AddResourcePage } from './pages/AddResourcePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { ProfilePage } from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CampusProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/add-resource" element={<AddResourcePage />} />
          <Route path="/edit-resource/:id" element={<AddResourcePage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </CampusProvider>
  );
}
