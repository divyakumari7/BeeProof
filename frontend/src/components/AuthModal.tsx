import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Lock, Mail, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin@beeproof.org');
  const [password, setPassword] = useState('BeeProof@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { label: 'Admin / KVIC', username: 'admin@beeproof.org', role: 'ADMIN_KVIC', badge: 'bg-amber-100 text-amber-900' },
    { label: 'Beekeeper', username: 'beekeeper1@beeproof.org', role: 'BEEKEEPER', badge: 'bg-emerald-100 text-emerald-900' },
    { label: 'Processor', username: 'processor@beeproof.org', role: 'PROCESSOR', badge: 'bg-blue-100 text-blue-900' },
    { label: 'Quality Lab', username: 'lab@beeproof.org', role: 'QUALITY_LAB', badge: 'bg-purple-100 text-purple-900' },
    { label: 'Distributor', username: 'distributor@beeproof.org', role: 'DISTRIBUTOR', badge: 'bg-orange-100 text-orange-900' },
  ];

  const handleSelectDemo = (email: string) => {
    setUsername(email);
    setPassword('BeeProof@2026!');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login(username, password);
      onClose();
      // Navigate to respective dashboard
      const roles = Array.isArray(loggedUser.roles)
        ? loggedUser.roles
        : (loggedUser.role ? [(loggedUser as any).role] : [loggedUser.primaryRole]);

      if (roles.includes('ADMIN_KVIC')) navigate('/admin');
      else if (roles.includes('BEEKEEPER')) navigate('/beekeeper');
      else if (roles.includes('PROCESSOR')) navigate('/processor');
      else if (roles.includes('QUALITY_LAB')) navigate('/quality-lab');
      else if (roles.includes('DISTRIBUTOR')) navigate('/distributor');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-forest-900 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-forest-800 flex items-center justify-center text-honey-400">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Sign In to BeeProof</h3>
                <p className="text-xs text-sand-300">Authorized Supply Chain & Admin Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-sand-300 hover:text-white p-1 rounded-lg hover:bg-forest-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Quick Demo Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sand-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-honey-600" /> Demo Quick-Fill
                </span>
                <span className="text-[11px] text-sand-800">1-click login</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {demoAccounts.map((demo) => {
                  const isSelected = username === demo.username;
                  return (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => handleSelectDemo(demo.username)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-honey-500 bg-honey-50/70 text-forest-950 font-bold'
                          : 'border-sand-200 hover:border-sand-300 bg-sand-50/60 text-sand-800'
                      }`}
                    >
                      <span className="block truncate">{demo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Sign In Failed</p>
                  <p className="text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sand-800 mb-1">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-800" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@beeproof.org"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-honey-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-800" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-honey-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-honey-400" />
                      <span>Authenticate Securely</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-sand-800">
                Consumers do not require an account. Use public verification on the home page.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
