import React, { useState } from 'react';
import {
  Building2,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Button + Brand Wordmark */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle mobile navigation menu"
          >
            {isMobileSidebarOpen ? (
              <X className="w-5 h-5 text-sky-800" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* DPL Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-900 to-sky-700 text-white flex items-center justify-center font-black tracking-tight shadow-sm shadow-sky-950/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                  DPL
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100/90 text-sky-900 border border-sky-300 hidden sm:inline-flex items-center gap-1">
                  <Shield className="w-3 h-3 text-sky-700" /> Admin Console
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden md:block">
                Real Estate Portfolio & Management System
              </span>
            </div>
          </div>
        </div>

        {/* Right: Admin Profile */}
        <div className="flex items-center gap-3">

          {/* Admin User Profile */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer border border-transparent hover:border-sky-300 min-h-[44px]"
              >
                <Avatar
                  src={currentUser.image}
                  name={currentUser.name}
                  size="sm"
                  showBorder
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-sky-800 font-bold capitalize">
                    DPL Administrator
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-sky-200 p-2 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 text-sm">
                          {currentUser.name}
                        </p>
                        <Badge variant="sky" size="sm">
                          Admin
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-xs truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-slate-500">
                        Phone: <span className="font-medium text-slate-700">{currentUser.phone}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold cursor-pointer min-h-[40px]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Admin Portal</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
