import React, { Suspense, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import Header from '@/components/Header.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { initPerformanceMonitoring } from '@/utils/performanceMonitor.js';

// Lazy load components for route-based code splitting
const HomePage = React.lazy(() => import('@/pages/HomePage.jsx'));
const AboutUs = React.lazy(() => import('@/pages/AboutUs.jsx'));
const ContactUs = React.lazy(() => import('@/pages/ContactUs.jsx'));
const InsurancePage = React.lazy(() => import('@/pages/InsurancePage.jsx'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy.jsx'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService.jsx'));
const FAQPage = React.lazy(() => import('@/pages/FAQPage.jsx'));
const LiveAnimalShippingPage = React.lazy(() => import('@/pages/LiveAnimalShippingPage.jsx'));
const TrackingPage = React.lazy(() => import('@/pages/TrackingPage.jsx'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage.jsx'));
const AdminLoginPage = React.lazy(() => import('@/pages/AdminLoginPage.jsx'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage.jsx'));
const SearchResults = React.lazy(() => import('@/pages/SearchResults.jsx'));
const ComplaintSubmissionPage = React.lazy(() => import('@/pages/ComplaintSubmissionPage.jsx'));
const BLViewPage = React.lazy(() => import('@/pages/BLViewPage.jsx'));

// Client Pages
const ClientDashboard = React.lazy(() => import('@/pages/ClientDashboard.jsx'));
const ShipmentDetailPage = React.lazy(() => import('@/pages/ShipmentDetailPage.jsx'));
const ComplaintPage = React.lazy(() => import('@/pages/ComplaintPage.jsx'));
const ComplaintHistoryPage = React.lazy(() => import('@/pages/ComplaintHistoryPage.jsx'));
const ComplaintDetailPage = React.lazy(() => import('@/pages/ComplaintDetailPage.jsx'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard.jsx'));
const AdminTrackingPage = React.lazy(() => import('@/pages/AdminTrackingPage.jsx'));
const EditShipmentPage = React.lazy(() => import('@/pages/EditShipmentPage.jsx'));
const ComplaintManagementPage = React.lazy(() => import('@/pages/ComplaintManagementPage.jsx'));

// Loading fallback for Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Page Transition Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="flex-grow flex flex-col"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
        <Route path="/insurance" element={<PageWrapper><InsurancePage /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQPage /></PageWrapper>} />
        <Route path="/live-animal-shipping" element={<PageWrapper><LiveAnimalShippingPage /></PageWrapper>} />
        <Route path="/tracking/:trackingNumber" element={<PageWrapper><TrackingPage /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper><SearchResults /></PageWrapper>} />
        <Route path="/complaint-submission" element={<PageWrapper><ComplaintSubmissionPage /></PageWrapper>} />
        <Route path="/bl/:bl_number" element={<PageWrapper><BLViewPage /></PageWrapper>} />
        <Route path="/404" element={<PageWrapper><NotFoundPage /></PageWrapper>} />

        {/* Auth Routes */}
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/admin-login" element={<PageWrapper><AdminLoginPage /></PageWrapper>} />

        {/* Client Protected Routes */}
        <Route 
          path="/client-dashboard" 
          element={
            <ProtectedRoute>
              <PageWrapper><ClientDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shipments/:id" 
          element={
            <ProtectedRoute>
              <PageWrapper><ShipmentDetailPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shipments/:id/track" 
          element={
            <ProtectedRoute>
              <PageWrapper><TrackingPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shipments/:id/complaint" 
          element={
            <ProtectedRoute>
              <PageWrapper><ComplaintPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaints" 
          element={
            <ProtectedRoute>
              <PageWrapper><ComplaintHistoryPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaint/:id" 
          element={
            <ProtectedRoute>
              <PageWrapper><ComplaintDetailPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tracking" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <PageWrapper><AdminTrackingPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/shipments/new" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <PageWrapper><EditShipmentPage isNew={true} /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/shipments/:id/edit" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <PageWrapper><EditShipmentPage isNew={false} /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/complaints/:id" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <PageWrapper><ComplaintManagementPage /></PageWrapper>
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Header />
          <main className="pt-[64px] min-h-screen flex flex-col w-full">
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Toaster />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;