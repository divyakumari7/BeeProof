import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user, getDashboardPathForUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white border border-sand-200 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl text-forest-950">Access Restricted</h1>
          <p className="text-xs text-sand-800 leading-relaxed">
            Your authenticated account (<strong className="text-sand-900">{user?.username}</strong> with role <span className="font-mono font-semibold text-sand-900">{user?.primaryRole}</span>) does not possess permission to access this designated workspace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to={getDashboardPathForUser()}
            className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Permitted Workspace</span>
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-sand-300"
          >
            <Home className="w-4 h-4" />
            <span>Public Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
