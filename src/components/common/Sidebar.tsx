import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Building2,
  CalendarCheck2,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  Shield,
  Layers,
  Newspaper,
  Briefcase,
  PhoneCall,
  PhoneIncoming,
  Award,
} from 'lucide-react';
import { useAppSelector } from '../../store';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'categories'
  | 'properties'
  | 'collections'
  | 'bookings'
  | 'blogs'
  | 'sister-concerns'
  | 'contact-info'
  | 'callbacks'
  | 'company-profile';

interface SidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { users } = useAppSelector((state) => state.users);
  const { categories } = useAppSelector((state) => state.categories);
  const { properties } = useAppSelector((state) => state.properties);
  const { bookings } = useAppSelector((state) => state.bookings);
  const { blogs } = useAppSelector((state) => state.blogs);
  const { sisterConcerns } = useAppSelector((state) => state.sisterConcerns);
  const { requests: callbackRequests } = useAppSelector((state) => state.callbackRequests);

  const exclusiveCount = properties.filter((p) => p.isExclusive).length;
  const completedCount = properties.filter((p) => p.projectStage === 'completed').length;
  const ongoingCount = properties.filter((p) => p.projectStage === 'ongoing').length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'Active').length;
  const pendingCallbacksCount = callbackRequests.filter((r) => r.status === 'Pending').length;

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'users' as AdminTab,
      label: 'User Management',
      icon: <Users className="w-4 h-4" />,
      badge: users.length,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categories',
      icon: <FolderTree className="w-4 h-4" />,
      badge: categories.length,
    },
    {
      id: 'properties' as AdminTab,
      label: 'Apartments & Properties',
      icon: <Building2 className="w-4 h-4" />,
      badge: properties.length,
    },
    {
      id: 'collections' as AdminTab,
      label: 'Exclusive & Project Lists',
      icon: <Sparkles className="w-4 h-4" />,
      badge: exclusiveCount,
      sublabel: 'Separate from Category',
    },
    {
      id: 'bookings' as AdminTab,
      label: 'Bookings & Leases',
      icon: <CalendarCheck2 className="w-4 h-4" />,
      badge: activeBookingsCount,
    },
    {
      id: 'blogs' as AdminTab,
      label: 'Blog & Articles',
      icon: <Newspaper className="w-4 h-4" />,
      badge: blogs.length,
      sublabel: 'HTML Content & Insights',
    },
    {
      id: 'sister-concerns' as AdminTab,
      label: 'Sister Concerns',
      icon: <Briefcase className="w-4 h-4" />,
      badge: sisterConcerns.length,
      sublabel: 'Group Brands & Logos',
    },
    {
      id: 'contact-info' as AdminTab,
      label: 'Contact & Office Hours',
      icon: <PhoneCall className="w-4 h-4" />,
      sublabel: 'Hotline, WhatsApp & Hours',
    },
    {
      id: 'callbacks' as AdminTab,
      label: 'Callback Requests',
      icon: <PhoneIncoming className="w-4 h-4" />,
      badge: pendingCallbacksCount,
      sublabel: pendingCallbacksCount > 0 ? `${pendingCallbacksCount} Pending Calls` : 'Client Inquiries',
    },
    {
      id: 'company-profile' as AdminTab,
      label: 'Company Profile & Story',
      icon: <Award className="w-4 h-4" />,
      sublabel: 'Values, Journey & Milestones',
    },
  ];

  const handleItemClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white">
      <div>
        {/* Mobile Header with close button */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-3 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 block leading-none">
                DPL Admin
              </span>
              <span className="text-xs text-sky-800 font-bold">
                Management Console
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-2 mb-3 hidden lg:block">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-850 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-700" /> Administration Hub
          </span>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer select-none min-h-[46px] ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-md shadow-sky-900/25'
                    : 'text-slate-600 hover:text-sky-900 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-sky-700'}>
                    {item.icon}
                  </span>
                  <div className="text-left">
                    <span className="block leading-tight text-sm font-bold">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span
                        className={`text-xs font-medium block mt-0.5 ${
                          isActive ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded-md tabular-nums font-bold ${
                      isActive
                        ? 'bg-sky-800 text-white'
                        : 'bg-sky-100/90 text-sky-900 border border-sky-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Breakdown Box */}
        <div className="mt-6 p-4 bg-gradient-to-b from-sky-50 to-slate-50/80 rounded-2xl border border-sky-200/90">
          <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-700" />
            <span>Listing Status Mix</span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-500" /> Exclusive List
              </span>
              <span className="font-mono font-bold tabular-nums text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                {exclusiveCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
              </span>
              <span className="font-mono font-bold tabular-nums text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                {completedCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-sky-700" /> Ongoing Dev
              </span>
              <span className="font-mono font-bold tabular-nums text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                {ongoingCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600 px-2">
        <div className="font-bold text-slate-800 text-sm">DPL Horizon Real Estate</div>
        <div className="text-xs text-slate-500 mt-0.5">Admin Management Suite · v2.4</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-sky-100 shadow-2xs">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Pane */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
