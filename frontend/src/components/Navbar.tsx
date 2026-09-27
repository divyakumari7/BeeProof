import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, LogIn, LogOut, LayoutDashboard, Menu, X, CheckCircle2, Bell, AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface NavbarProps {
  onOpenVerify: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVerify, onOpenAuth }) => {
  const { user, isAuthenticated, logout, getDashboardPathForUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Notification bell is visible ONLY on the Beekeeper Dashboard
  const isBeekeeperDashboard = Boolean(
    isAuthenticated &&
    user?.primaryRole === 'BEEKEEPER' &&
    location.pathname.startsWith('/beekeeper')
  );

  const fetchAlerts = async () => {
    if (!isBeekeeperDashboard) return;
    try {
      const res = await api.getBeekeeperAlerts();
      if (res.success && res.data) {
        setAlerts(res.data.filter((a: any) => a.status === 'UNREAD'));
      }
    } catch (err) {
      // Non-blocking
    }
  };

  useEffect(() => {
    if (isBeekeeperDashboard) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 15000);
      return () => clearInterval(interval);
    } else {
      setAlerts([]);
      setAlertsOpen(false);
    }
  }, [isBeekeeperDashboard]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
    };
    if (alertsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [alertsOpen]);

  const handleResolveAlert = async (alertId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.resolveAlert(alertId);
      setAlerts(prev => prev.filter(a => (a._id || a.id) !== alertId));
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  const handleDashboardClick = () => {
    navigate(getDashboardPathForUser());
    setMobileMenuOpen(false);
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN_KVIC':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-900 border border-amber-300">KVIC Admin</span>;
      case 'BEEKEEPER':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">Beekeeper</span>;
      case 'PROCESSOR':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-900 border border-blue-300">Processor</span>;
      case 'QUALITY_LAB':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-900 border border-purple-300">Quality Lab</span>;
      case 'DISTRIBUTOR':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-900 border border-orange-300">Distributor</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-forest-900 flex items-center justify-center text-honey-400 shadow-sm group-hover:bg-forest-800 transition-colors">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-forest-950 flex items-center gap-1">
                Bee<span className="text-honey-600">Proof</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-sand-800 font-semibold -mt-1">
                Provenance Verified
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-sand-800">
            <Link to="/" className="hover:text-forest-700 transition-colors">Platform</Link>
            {isAuthenticated && user?.primaryRole === 'ADMIN_KVIC' && (
              <Link to="/admin/blockchain-proof" className="hover:text-forest-700 transition-colors font-bold text-forest-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-honey-600" />
                <span>Blockchain Proof</span>
              </Link>
            )}
            <a href="#provenance-architecture" className="hover:text-forest-700 transition-colors">Traceability Chain</a>
            <a href="#kvic-cooperatives" className="hover:text-forest-700 transition-colors">Cooperatives</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-900 transition-colors border border-sand-300"
            >
              <Search className="w-4 h-4 text-honey-600" />
              <span>Verify Batch</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                {/* Notification Bell - Render ONLY for Beekeeper Dashboard */}
                {isBeekeeperDashboard && (
                  <div className="relative">
                    <button
                      onClick={() => setAlertsOpen(!alertsOpen)}
                      title="Hive Alerts"
                      data-testid="notification-bell-btn"
                      className="p-2 rounded-lg text-sand-800 hover:text-forest-950 hover:bg-sand-100 transition relative"
                    >
                      <Bell className="w-5 h-5" />
                      {alerts.length > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                          {alerts.length}
                        </span>
                      )}
                    </button>

                    {/* Alerts Dropdown Panel */}
                    {alertsOpen && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-sand-300 shadow-2xl z-50 p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-honey-600" />
                            <h4 className="font-bold text-xs text-forest-950 uppercase tracking-wider">
                              Colony Hive Alerts ({alerts.length})
                            </h4>
                          </div>
                          <button
                            onClick={() => setAlertsOpen(false)}
                            className="text-xs text-sand-500 hover:text-sand-800"
                          >
                            Close
                          </button>
                        </div>

                        {alerts.length === 0 ? (
                          <p className="text-xs text-sand-600 py-3 text-center">
                            ✅ No active alerts. All monitored hives operating normally.
                          </p>
                        ) : (
                          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                            {alerts.map((alt) => (
                              <div
                                key={alt._id || alt.id}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                  alt.severity === 'CRITICAL'
                                    ? 'bg-red-50/80 border-red-200 text-red-950'
                                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold font-mono text-[11px] text-forest-900">
                                    {alt.hiveCode || 'HIVE'}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      alt.severity === 'CRITICAL'
                                        ? 'bg-red-200 text-red-900'
                                        : 'bg-amber-200 text-amber-900'
                                    }`}
                                  >
                                    {alt.severity}
                                  </span>
                                </div>
                                <p className="text-[11px] leading-snug">{alt.message}</p>
                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={(e) => handleResolveAlert(alt._id || alt.id, e)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Mark Resolved</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleDashboardClick}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-sm transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-honey-400" />
                  <span>Portal</span>
                  {getRoleBadge(user.primaryRole)}
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-sand-800 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-forest-900 hover:bg-forest-800 text-white shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4 text-honey-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/verify"
              className="p-2 rounded-lg bg-sand-100 text-sand-900"
              title="Verify Batch"
            >
              <Search className="w-5 h-5 text-honey-600" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-sand-800 hover:bg-sand-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <div className="flex flex-col gap-2 pt-2 text-sm font-medium text-sand-900">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2">Platform Overview</Link>
            {isAuthenticated && user?.primaryRole === 'ADMIN_KVIC' && (
              <Link to="/admin/blockchain-proof" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-forest-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-honey-600" />
                <span>Blockchain Proof (Admin Governance)</span>
              </Link>
            )}
            <a href="#provenance-architecture" onClick={() => setMobileMenuOpen(false)} className="py-2">Traceability Chain</a>
            <a href="#kvic-cooperatives" onClick={() => setMobileMenuOpen(false)} className="py-2">Cooperatives</a>
          </div>

          <div className="pt-2 border-t border-sand-200 flex flex-col gap-2">
            <button
              onClick={() => { onOpenVerify(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-sand-100 text-sand-900 border border-sand-300"
            >
              <Search className="w-4 h-4 text-honey-600" />
              <span>Verify Honey Batch</span>
            </button>

            {isAuthenticated && user ? (
              <div className="space-y-2">
                <button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-forest-900 text-white"
                >
                  <LayoutDashboard className="w-4 h-4 text-honey-400" />
                  <span>Go to Role Portal</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.username})</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-forest-900 text-white"
              >
                <LogIn className="w-4 h-4 text-honey-400" />
                <span>Sign In to Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
