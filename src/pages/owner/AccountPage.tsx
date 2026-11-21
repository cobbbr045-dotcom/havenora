import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Key, LogOut, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/ui/Toast';

export const AccountPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { resetToDefaultData } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || 'Tenzing Norbu');
  const [email, setEmail] = useState(user?.email || 'owner@havenora.com');

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(fullName, email);
    showToast('Owner profile details updated successfully.', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      showToast('Please provide current and new passwords.', 'error');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password credentials updated in demonstration session.', 'success');
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all website settings, suites, gallery items and enquiries back to original demonstration data?')) {
      resetToDefaultData();
      showToast('Demonstration data restored to initial state.', 'info');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/owner/login');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-forest-deep font-medium">
          Owner Account & Security
        </h2>
        <p className="text-xs text-charcoal/60 mt-1">
          Manage your personal administrative credentials, active session status, and data storage.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-forest text-sand flex items-center justify-center font-serif text-2xl font-bold">
            {fullName.charAt(0)}
          </div>
          <div>
            <h3 className="font-serif text-xl text-forest-deep">{fullName}</h3>
            <p className="text-xs text-charcoal/50">Primary Property Owner · Full Permissions</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Session
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-sand-dark/20">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded shadow-xs"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Interface */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs space-y-4">
        <h3 className="font-serif text-xl text-forest-deep">Update Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-ivory/60 border border-sand-dark/40 rounded focus:outline-none focus:border-forest text-charcoal"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-forest hover:bg-forest-deep text-ivory rounded shadow-xs"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Backend & Demonstration Mode Status */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-sand-dark/20 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-forest-deep font-serif text-xl">
          <Shield className="w-5 h-5 text-bronze" />
          <span>Backend & Persistence Mode</span>
        </div>
        
        <div className="p-4 rounded-lg bg-ivory border border-sand-dark/30 text-xs text-charcoal/80 space-y-2">
          <p className="font-semibold text-charcoal">
            Mode: Local Persistent Storage Engine (Mock & Real-Time Sync)
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            All rooms, enquiries, photographs, and settings are currently synchronized in your browser's LocalStorage. This ensures immediate feedback, live state updates between public website and owner portal, and persistent data without requiring remote cloud credentials.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            To switch to cloud Supabase production mode, provide your Supabase URL and public anon key in an environment variable configuration file.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs text-charcoal hover:bg-sand/30 border border-sand-dark/40 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Initial Demo Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>

    </div>
  );
};
