import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicBatchModal } from './components/PublicBatchModal';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { ConsumerVerificationPage } from './pages/ConsumerVerificationPage';
import { BlockchainProofPage } from './pages/BlockchainProofPage';
import { AdminPortal } from './pages/AdminPortal';
import { BeekeeperPortal } from './pages/BeekeeperPortal';
import { ProcessorPortal } from './pages/ProcessorPortal';
import { QualityLabPortal } from './pages/QualityLabPortal';
import { DistributorPortal } from './pages/DistributorPortal';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

export function AppContent() {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar
        onOpenVerify={() => setVerifyModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-grow">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Consumer QR Verification Pages */}
          <Route path="/verify" element={<ConsumerVerificationPage />} />
          <Route path="/verify/:batchNumber" element={<ConsumerVerificationPage />} />

          {/* Protected KVIC Admin Blockchain Proof Page */}
          <Route
            path="/admin/blockchain-proof"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_KVIC']}>
                <BlockchainProofPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blockchain-proof/:batchNumber"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_KVIC']}>
                <BlockchainProofPage />
              </ProtectedRoute>
            }
          />

          {/* Role Protected Dashboards */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_KVIC']}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/beekeeper"
            element={
              <ProtectedRoute allowedRoles={['BEEKEEPER']}>
                <BeekeeperPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/processor"
            element={
              <ProtectedRoute allowedRoles={['PROCESSOR']}>
                <ProcessorPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quality-lab"
            element={
              <ProtectedRoute allowedRoles={['QUALITY_LAB']}>
                <QualityLabPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/distributor"
            element={
              <ProtectedRoute allowedRoles={['DISTRIBUTOR', 'ADMIN_KVIC']}>
                <DistributorPortal />
              </ProtectedRoute>
            }
          />

          {/* Access Denied */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <PublicBatchModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
