import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import {
  addProperty,
  updateProperty,
  assignPropertyToUser,
} from './store/slices/propertiesSlice';
import { setUserAssignedProperty } from './store/slices/usersSlice';
import { createBooking, generateDefaultInstallments } from './store/slices/bookingsSlice';
import { Property, User } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar, AdminTab } from './components/common/Sidebar';

// Admin Components
import { OverviewStats } from './components/admin/OverviewStats';
import { UserManagement } from './components/admin/UserManagement';
import { CategoryManagement } from './components/admin/CategoryManagement';
import { PropertyManagement } from './components/admin/PropertyManagement';
import { CollectionsManagement } from './components/admin/CollectionsManagement';
import { BookingsDashboard } from './components/admin/BookingsDashboard';
import { PropertyFormModal } from './components/admin/PropertyFormModal';
import { AssignPropertyModal } from './components/admin/AssignPropertyModal';
import { PropertyDetailsModal } from './components/admin/PropertyDetailsModal';
import { BlogManagement } from './components/admin/BlogManagement';
import { SisterConcernsManagement } from './components/admin/SisterConcernsManagement';
import { ContactInfoManagement } from './components/admin/ContactInfoManagement';
import CallbackRequestsManagement from './components/admin/CallbackRequestsManagement';
import { CompanyProfileManagement } from './components/admin/CompanyProfileManagement';

// Auth Components
import { LoginModal } from './components/auth/LoginModal';

export default function App() {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.auth);

  // Auto-migrate any legacy localStorage paths to /assets/images/
  useEffect(() => {
    try {
      const keys = ['dpl_auth_state', 'dpl_properties', 'dpl_users'];
      keys.forEach((k) => {
        const val = localStorage.getItem(k);
        if (
          val &&
          (val.includes('src/assets/images/') ||
            val.includes('/src/assets/images/') ||
            val.includes('/images/'))
        ) {
          const updated = val
            .split('/src/assets/images/').join('/assets/images/')
            .split('src/assets/images/').join('/assets/images/')
            .split('/images/').join('/assets/images/');
          localStorage.setItem(k, updated);
        }
      });
    } catch {
      // ignore
    }
  }, []);

  // Admin Navigation Tab
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Mobile Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetUser, setAssignTargetUser] = useState<User | null>(null);
  const [assignTargetProperty, setAssignTargetProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Handlers
  const handleOpenCreateProperty = () => {
    setEditingProperty(null);
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setIsPropertyModalOpen(true);
  };

  const handlePropertyFormSubmit = (
    propertyData: Omit<Property, 'id' | 'createdAt'>,
    assignToUserId?: string
  ) => {
    if (editingProperty) {
      dispatch(
        updateProperty({
          id: editingProperty.id,
          data: propertyData,
        })
      );
      if (assignToUserId) {
        dispatch(
          assignPropertyToUser({
            propertyId: editingProperty.id,
            userId: assignToUserId,
          })
        );
        dispatch(
          setUserAssignedProperty({
            userId: assignToUserId,
            propertyId: editingProperty.id,
          })
        );
      }
    } else {
      const newId = `prop-${Date.now()}`;
      dispatch(addProperty(propertyData));

      if (assignToUserId) {
        dispatch(
          setUserAssignedProperty({
            userId: assignToUserId,
            propertyId: newId,
          })
        );
        const generated = generateDefaultInstallments(
          propertyData.price,
          propertyData.securityDeposit,
          propertyData.availableFrom || '2026-03-01'
        );
        dispatch(
          createBooking({
            propertyId: newId,
            propertyTitle: propertyData.title,
            propertyAddress: propertyData.address,
            userId: assignToUserId,
            userName: 'Tenant Resident',
            userEmail: 'tenant@example.com',
            userPhone: '+1 (555) 000-0000',
            startDate: propertyData.availableFrom || '2026-03-01',
            endDate: '2027-02-28',
            monthlyRent: propertyData.price,
            securityDeposit: propertyData.securityDeposit,
            totalContractValue: generated.totalContractValue,
            totalPaidAmount: generated.totalPaidAmount,
            totalDueAmount: generated.totalDueAmount,
            installments: generated.installments,
            status: 'Active',
            notes: 'Initial assignment upon property creation.',
          })
        );
      }
    }
  };

  const handleOpenAssignModalForUser = (user: User) => {
    setAssignTargetUser(user);
    setAssignTargetProperty(null);
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignModalForProperty = (prop: Property) => {
    setAssignTargetProperty(prop);
    setAssignTargetUser(null);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-sky-700 selection:text-white">
      {/* Top Application Bar with Mobile Drawer Hamburger */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Content Area */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-sky-200/80 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-900 to-sky-700 text-white flex items-center justify-center mx-auto text-xl font-black shadow-md shadow-sky-900/30">
              DPL
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                DPL Real Estate Admin Portal
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Please sign in with your DPL administrator credentials to manage properties, categories, and tenant accounts.
              </p>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-sky-900/25 min-h-[44px]"
            >
              Sign In to Admin Portal
            </button>
          </div>
        </div>
      ) : (
        /* PURE DPL ADMIN PANEL WITH RESPONSIVE LAYOUT */
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Admin Sidebar Navigation (Persistent on Desktop, Slide-over on Mobile) */}
          <Sidebar
            activeTab={adminTab}
            onSelectTab={(tab) => {
              setAdminTab(tab);
              setIsMobileSidebarOpen(false);
            }}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Admin Content Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {adminTab === 'overview' && (
              <OverviewStats
                onNavigate={(tab) => setAdminTab(tab)}
                onOpenCreateUser={() => setAdminTab('users')}
                onOpenCreateProperty={handleOpenCreateProperty}
                onOpenCreateCategory={() => setAdminTab('categories')}
              />
            )}

            {adminTab === 'users' && (
              <UserManagement
                onOpenAssignModal={handleOpenAssignModalForUser}
              />
            )}

            {adminTab === 'categories' && (
              <CategoryManagement
                onNavigateToProperties={() => setAdminTab('properties')}
              />
            )}

            {adminTab === 'properties' && (
              <PropertyManagement
                onOpenCreateProperty={handleOpenCreateProperty}
                onOpenEditProperty={handleOpenEditProperty}
                onOpenAssignModal={handleOpenAssignModalForProperty}
                onViewPropertyDetails={(p) => setViewingProperty(p)}
              />
            )}

            {adminTab === 'collections' && (
              <CollectionsManagement
                onOpenCreateProperty={handleOpenCreateProperty}
                onViewPropertyDetails={(p) => setViewingProperty(p)}
              />
            )}

            {adminTab === 'bookings' && (
              <BookingsDashboard
                onOpenAssignModal={() => {
                  setAssignTargetUser(null);
                  setAssignTargetProperty(null);
                  setIsAssignModalOpen(true);
                }}
              />
            )}

            {adminTab === 'blogs' && (
              <BlogManagement />
            )}

            {adminTab === 'sister-concerns' && (
              <SisterConcernsManagement />
            )}

            {adminTab === 'contact-info' && (
              <ContactInfoManagement />
            )}

            {adminTab === 'callbacks' && (
              <CallbackRequestsManagement />
            )}

            {adminTab === 'company-profile' && (
              <CompanyProfileManagement />
            )}
          </main>
        </div>
      )}

      {/* Global Modals */}
      <PropertyFormModal
        isOpen={isPropertyModalOpen}
        onClose={() => {
          setIsPropertyModalOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handlePropertyFormSubmit}
        initialData={editingProperty}
      />

      <AssignPropertyModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignTargetUser(null);
          setAssignTargetProperty(null);
        }}
        preselectedUser={assignTargetUser}
        preselectedProperty={assignTargetProperty}
      />

      <PropertyDetailsModal
        property={viewingProperty}
        isOpen={!!viewingProperty}
        onClose={() => setViewingProperty(null)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
