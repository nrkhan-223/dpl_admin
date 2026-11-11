import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { login } from '../../store/slices/authSlice';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, Input } from '../common/FormField';
import { Badge } from '../common/Badge';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  const [email, setEmail] = useState('admin@dpl.com');
  const [password, setPassword] = useState('adminPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const adminAccount = users.find((u) => u.role === 'admin') || users[0];

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      setError('No account found with this email. Please check your credentials.');
      return;
    }

    if (matchedUser.role !== 'admin') {
      setError('Access restricted to DPL Administrators only.');
      return;
    }

    if (matchedUser.password && matchedUser.password !== password) {
      setError('Incorrect password.');
      return;
    }

    dispatch(login({ user: matchedUser }));
    onClose();
  };

  const handleQuickAdminLogin = () => {
    if (adminAccount) {
      dispatch(login({ user: adminAccount }));
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DPL Admin Console Sign In"
      subtitle="Authorized access for DPL property directors and administrators"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Quick Admin Access Button */}
        {adminAccount && (
          <button
            onClick={handleQuickAdminLogin}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white hover:from-sky-100 hover:to-sky-50 transition-all text-left cursor-pointer group shadow-xs min-h-[44px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shadow-xs">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">
                    {adminAccount.name}
                  </span>
                  <Badge variant="sky" size="sm">
                    Admin
                  </Badge>
                </div>
                <span className="text-xs text-sky-800 font-medium">
                  1-Click Instant Administrator Access
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-xs text-slate-400 font-medium">
            or sign in with admin credentials
          </span>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleAdminLogin} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <FormField label="Admin Email Address" required>
            <Input
              type="email"
              placeholder="admin@dpl.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Password" required>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer min-h-[36px] flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full">
              Sign In to Admin Portal
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
