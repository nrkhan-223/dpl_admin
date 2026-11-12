import React from 'react';
import {
  Building2,
  Users,
  CalendarCheck,
  TrendingUp,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Key,
  DollarSign,
  Receipt,
  Newspaper,
  Briefcase,
  PhoneCall,
  Award,
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { AdminTab } from '../common/Sidebar';

interface OverviewStatsProps {
  onNavigate: (tab: AdminTab) => void;
  onOpenCreateUser: () => void;
  onOpenCreateProperty: () => void;
  onOpenCreateCategory: () => void;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  onNavigate,
  onOpenCreateUser,
  onOpenCreateProperty,
  onOpenCreateCategory,
}) => {
  const { properties } = useAppSelector((state) => state.properties);
  const { users } = useAppSelector((state) => state.users);
  const { categories } = useAppSelector((state) => state.categories);
  const { bookings } = useAppSelector((state) => state.bookings);
  const { blogs } = useAppSelector((state) => state.blogs);
  const { sisterConcerns } = useAppSelector((state) => state.sisterConcerns);
  const { info: contactInfo } = useAppSelector((state) => state.contactInfo);
  const { requests: callbackRequests } = useAppSelector((state) => state.callbackRequests);
  const { data: companyProfile } = useAppSelector((state) => state.companyProfile);

  const activeBookings = bookings.filter((b) => b.status === 'Active');
  const totalMonthlyRevenue = activeBookings.reduce((sum, b) => sum + b.monthlyRent, 0);

  const exclusiveProps = properties.filter((p) => p.isExclusive);
  const completedProps = properties.filter((p) => p.projectStage === 'completed');
  const ongoingProps = properties.filter((p) => p.projectStage === 'ongoing');
  const availableProps = properties.filter((p) => p.availabilityStatus === 'Available');

  // Installment Ledger Metrics
  const totalContractVolume = bookings.reduce(
    (sum, b) => sum + (b.totalContractValue || b.monthlyRent * 12 + b.securityDeposit),
    0
  );
  const totalCollectedInstallments = bookings.reduce((sum, b) => sum + (b.totalPaidAmount || 0), 0);
  const totalOutstandingDue = bookings.reduce((sum, b) => sum + (b.totalDueAmount || 0), 0);
  const percentCollected = totalContractVolume > 0 ? Math.round((totalCollectedInstallments / totalContractVolume) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Property Administration Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-tenant management, exclusive collections, user profiles, and lease orchestration.
          </p>
        </div>

        {/* Action Buttons with mobile wrap */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenCreateUser}
            icon={<Plus className="w-4 h-4 text-sky-800" />}
            className="flex-1 sm:flex-none"
          >
            Create User
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenCreateCategory}
            icon={<Plus className="w-4 h-4 text-sky-800" />}
            className="flex-1 sm:flex-none"
          >
            New Category
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenCreateProperty}
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Add Apartment
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Properties"
          value={properties.length}
          subtitle={`${availableProps.length} ready for assignment`}
          icon={<Building2 className="w-5 h-5 text-sky-800" />}
          trend={{ value: `${exclusiveProps.length} Exclusive`, isPositive: true }}
        />
        <StatCard
          title="Registered Users"
          value={users.length}
          subtitle={`${users.filter((u) => u.assignedPropertyId).length} assigned to leases`}
          icon={<Users className="w-5 h-5 text-sky-800" />}
          trend={{ value: `${users.filter((u) => u.status === 'active').length} Active`, isPositive: true }}
        />
        <StatCard
          title="Active Leases"
          value={activeBookings.length}
          subtitle="Managed through centralized portal"
          icon={<CalendarCheck className="w-5 h-5 text-sky-800" />}
          trend={{ value: '100% on-time', isPositive: true }}
        />
        <StatCard
          title="Monthly Lease Value"
          value={`$${totalMonthlyRevenue.toLocaleString()}`}
          subtitle="Under direct administration"
          icon={<TrendingUp className="w-5 h-5 text-sky-800" />}
          trend={{ value: '+8.4% vs last mo', isPositive: true }}
        />
      </div>

      {/* Special Listing Status: Exclusive, Completed, Ongoing (Separate from Category) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Special Listing Status & Lists
              </h2>
              <span className="text-xs font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-md">
                Separate from Category
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Curate residences into Exclusive collections, Completed move-in ready units, or Ongoing construction developments.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('collections')}
            icon={<ArrowRight className="w-4 h-4 text-sky-800" />}
            iconPosition="right"
          >
            Manage Lists
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            onClick={() => onNavigate('collections')}
            className="p-4.5 rounded-2xl border border-amber-200/90 bg-amber-50/60 hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-500" /> Exclusive Collection
              </span>
              <span className="text-xl font-mono font-bold text-amber-950 tabular-nums">
                {exclusiveProps.length}
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-2 line-clamp-2">
              Ultra-prime properties with custom features, high-floor vistas, and priority concierge access.
            </p>
          </div>

          <div
            onClick={() => onNavigate('collections')}
            className="p-4.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/60 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Properties
              </span>
              <span className="text-xl font-mono font-bold text-emerald-950 tabular-nums">
                {completedProps.length}
              </span>
            </div>
            <p className="text-xs text-emerald-900 mt-2 line-clamp-2">
              Fully built and inspected residences ready for immediate tenant assignment and walkthroughs.
            </p>
          </div>

          <div
            onClick={() => onNavigate('collections')}
            className="p-4.5 rounded-2xl border border-sky-300 bg-sky-50/70 hover:bg-sky-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-sky-950">
                <Clock className="w-4 h-4 text-sky-800" /> Ongoing Developments
              </span>
              <span className="text-xl font-mono font-bold text-sky-950 tabular-nums">
                {ongoingProps.length}
              </span>
            </div>
            <p className="text-xs text-sky-900 mt-2 line-clamp-2">
              Under-construction architectural pavilions and upcoming handover units with early reservation status.
            </p>
          </div>
        </div>
      </div>

      {/* Due Amount & Installment Collections Strip */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-sky-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-700 flex items-center justify-center text-sky-200">
                <Receipt className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Due Amount Installment Payment Ledger
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                Active Tracking
              </span>
            </div>
            <p className="text-sm text-sky-200 mt-1.5">
              Real-time monitoring of tenant booking assignments and due amounts paid sequentially in scheduled installments.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => onNavigate('bookings')}
            icon={<ArrowRight className="w-4 h-4 text-sky-800" />}
            iconPosition="right"
            className="shrink-0"
          >
            Manage Installments
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-sky-700/60 font-mono">
          <div className="bg-white/10 rounded-xl p-3.5">
            <span className="text-xs uppercase font-bold text-sky-200 block">Total Contract Commitments</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              ${totalContractVolume.toLocaleString()}
            </div>
            <span className="text-xs text-sky-300 font-sans block mt-0.5">Across all tenant leases</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5">
            <span className="text-xs uppercase font-bold text-emerald-300 block">Installments Collected ({percentCollected}%)</span>
            <div className="text-2xl font-bold text-emerald-300 mt-1 tabular-nums">
              ${totalCollectedInstallments.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-200 font-sans block mt-0.5">Received & receipted</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5">
            <span className="text-xs uppercase font-bold text-sky-100 block">Remaining Due in Installments</span>
            <div className="text-2xl font-bold text-sky-200 mt-1 tabular-nums">
              ${totalOutstandingDue.toLocaleString()}
            </div>
            <span className="text-xs text-sky-300 font-sans block mt-0.5">Payable in future tranches</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-sky-950/60 rounded-full h-2 overflow-hidden border border-sky-700">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentCollected}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Breakdown: Categories & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Categories Overview */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Category Portfolios</h2>
              <p className="text-xs text-slate-500">
                {categories.length} active classifications containing {properties.length} total units
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('categories')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-2.5">
            {categories.map((cat) => {
              const count = properties.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate('properties')}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all cursor-pointer min-h-[44px]"
                >
                  <div className="pr-2">
                    <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-sky-900 bg-sky-100 border border-sky-300 px-3 py-1 rounded-lg tabular-nums">
                      {count} units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Managed User Profiles</h2>
              <p className="text-sm text-slate-500">
                Created directly with credentials & optional/null avatar images
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('users')}
            >
              Manage Users
            </Button>
          </div>

          <div className="space-y-2.5">
            {users.slice(0, 4).map((user) => {
              const assignedProp = properties.find((p) => p.id === user.assignedPropertyId);
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all min-h-[46px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={user.image} name={user.name} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                        {user.role === 'admin' ? (
                          <Badge variant="sky" size="sm">Admin</Badge>
                        ) : (
                          <Badge variant="slate" size="sm">Tenant</Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {user.phone} · {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    {assignedProp ? (
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-emerald-700" /> Assigned
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Unassigned</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corporate Editorial, Sister Concerns & Contact Info Overview */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Corporate Media, Sister Concerns & Operating Windows
              </h2>
              <span className="text-xs font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-md">
                Brand & Client Hub
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage DPL real estate articles, subsidiary group partner brands, and live office operating hours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Blog & Articles */}
          <div
            onClick={() => onNavigate('blogs')}
            className="p-4.5 rounded-2xl border border-sky-200/90 bg-sky-50/40 hover:bg-sky-50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-850 flex items-center justify-center font-bold group-hover:bg-sky-700 group-hover:text-white transition-colors">
                  <Newspaper className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-sky-900 bg-white border border-sky-200 px-2.5 py-0.5 rounded-md">
                  {blogs.length} Articles
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                Blog & Insights Journal
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Publish, edit, and categorize rich HTML real estate articles with custom read times and types.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-sky-100 flex items-center justify-between text-xs text-sky-800 font-bold">
              <span>{blogs.filter((b) => b.status === 'published').length} Published</span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Sister Concerns */}
          <div
            onClick={() => onNavigate('sister-concerns')}
            className="p-4.5 rounded-2xl border border-sky-200/90 bg-sky-50/40 hover:bg-sky-50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-850 flex items-center justify-center font-bold group-hover:bg-sky-700 group-hover:text-white transition-colors">
                  <Briefcase className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-sky-900 bg-white border border-sky-200 px-2.5 py-0.5 rounded-md">
                  {sisterConcerns.length} Concerns
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                Sister Concerns & Brands
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add, edit, or delete corporate subsidiary images, partner logos, industry sectors, and links.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-sky-100 flex items-center justify-between text-xs text-sky-800 font-bold">
              <span>{sisterConcerns.filter((s) => s.status === 'active').length} Active</span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Contact & Office Hours */}
          <div
            onClick={() => onNavigate('contact-info')}
            className="p-4.5 rounded-2xl border border-sky-200/90 bg-sky-50/40 hover:bg-sky-50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-850 flex items-center justify-center font-bold group-hover:bg-sky-700 group-hover:text-white transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  contactInfo.isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {contactInfo.statusBadgeText || (contactInfo.isOpenNow ? 'OPEN NOW' : 'CLOSED')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                Contact & Operating Hours
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hotline ({contactInfo.hotline}), WhatsApp, and Friday Jummah appointment schedule.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-sky-100 flex items-center justify-between text-xs text-sky-800 font-bold">
              <span>{contactInfo.schedules.length} Timetable Windows</span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Configure <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Callback Requests */}
          <div
            onClick={() => onNavigate('callbacks')}
            className="p-4.5 rounded-2xl border border-sky-200/90 bg-sky-50/40 hover:bg-sky-50 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-850 flex items-center justify-center font-bold group-hover:bg-sky-700 group-hover:text-white transition-colors">
                  <PhoneCall className="w-4 h-4 text-sky-800 group-hover:text-white" />
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {callbackRequests.filter((c) => c.status === 'Pending').length} Pending
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                Callback Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Client requests with phone, email, notes, and preferred contact hours.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-sky-100 flex items-center justify-between text-xs text-sky-800 font-bold">
              <span>{callbackRequests.length} Total Requests</span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Review & Call <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Company Profile & Story Hero Link */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-[#124b9b] rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-sky-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-300" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {companyProfile.companyName || 'Dreamer Properties LTD'} — Institutional Story & Values
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-sky-950">
                Brand Profile
              </span>
            </div>
            <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
              {companyProfile.tagline || 'Building Trust, Delivering Excellence Since 2010'}. Configure the interactive public customer story portal with Core Values, 2010–2026 Milestones, Why Choose Us points, and Key Achievements.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-sky-200">
              <span className="bg-white/10 px-2 py-0.5 rounded">
                ★ {companyProfile.coreValues.length} Core Values
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded">
                🚀 {companyProfile.milestones.length} Journey Milestones
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded">
                ⚖️ {companyProfile.whyChooseUs.length} Why Dreamer Reasons
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded">
                🏆 {companyProfile.achievements.length} Key Achievements
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => onNavigate('company-profile')}
            icon={<ArrowRight className="w-4 h-4 text-sky-800" />}
            iconPosition="right"
            className="shrink-0 self-start md:self-auto bg-white text-sky-900 hover:bg-sky-50"
          >
            Manage Story & Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
