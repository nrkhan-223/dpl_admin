import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addUser,
  updateUser,
  deleteUser,
  setSearchQuery,
  setStatusFilter,
} from '../../store/slices/usersSlice';
import { unassignProperty } from '../../store/slices/propertiesSlice';
import { terminateBooking } from '../../store/slices/bookingsSlice';
import { User } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FormField, Input } from '../common/FormField';
import { Select } from '../common/Select';
import { Tabs } from '../common/Tabs';

interface UserManagementProps {
  onOpenAssignModal?: (user: User) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onOpenAssignModal }) => {
  const dispatch = useAppDispatch();
  const { users, searchQuery, statusFilter } = useAppSelector((state) => state.users);
  const { properties } = useAppSelector((state) => state.properties);
  const { bookings } = useAppSelector((state) => state.bookings);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    image: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const avatarPresets = [
    { label: 'Sample Avatar 1', url: '/src/assets/images/avatar_resident_user_1794130868736.jpg' },
    { label: 'Sample Avatar 2', url: '/src/assets/images/avatar_dpl_admin_1794130868923.jpg' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      image: '',
      role: 'user',
      status: 'active',
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password || '',
      image: user.image || '',
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!editingUser && !formData.password.trim()) {
      errors.password = 'Password is required for new user creation';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Supports null/empty image as explicitly requested: "image (can be null)"
    const trimmedImage = formData.image.trim() || null;

    if (editingUser) {
      dispatch(
        updateUser({
          id: editingUser.id,
          data: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim() || editingUser.password,
            image: trimmedImage,
            role: formData.role,
            status: formData.status,
          },
        })
      );
      setEditingUser(null);
    } else {
      dispatch(
        addUser({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim() || 'password123',
          image: trimmedImage,
          role: formData.role,
          status: formData.status,
        })
      );
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      if (userToDelete.assignedPropertyId) {
        dispatch(unassignProperty(userToDelete.assignedPropertyId));
        const userBooking = bookings.find(
          (b) => b.userId === userToDelete.id && b.status === 'Active'
        );
        if (userBooking) {
          dispatch(terminateBooking(userBooking.id));
        }
      }
      dispatch(deleteUser(userToDelete.id));
      setUserToDelete(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filterTabs = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'active', label: 'Active', count: users.filter((u) => u.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: users.filter((u) => u.status === 'inactive').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              User Profile Management
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              {users.length} accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create user profiles with name, phone, email, password, and optional image (can be null). Manage credentials and delete profiles with ease.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          icon={<UserPlus className="w-4 h-4" />}
          size="md"
          className="w-full sm:w-auto"
        >
          Create New User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-sky-200/90 shadow-xs">
        <Tabs
          tabs={filterTabs}
          activeTab={statusFilter}
          onChange={(id) => dispatch(setStatusFilter(id as any))}
        />

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            icon={<Search className="w-4 h-4 text-sky-700" />}
          />
        </div>
      </div>

      {/* Users Data Grid with Responsive Scroll */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-gradient-to-r from-sky-100/70 via-sky-50/50 to-slate-50 text-slate-800 font-bold uppercase tracking-wider text-xs border-b border-sky-200">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Role & Status</th>
                <th className="px-4 py-3.5">Assigned Property</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto text-sky-300 mb-2" />
                    <p className="font-semibold text-slate-700">No users found</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {searchQuery
                        ? 'Try refining your search keyword or filters.'
                        : 'Click "Create New User" to add the first profile.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const assignedProp = properties.find((p) => p.id === user.assignedPropertyId);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      {/* User Profile */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.image}
                            name={user.name}
                            size="md"
                            showBorder
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-base flex items-center gap-1.5 flex-wrap">
                              <span>{user.name}</span>
                              {user.image === null && (
                                <span className="text-xs text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded font-bold" title="Profile image is null">
                                  Null image
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Phone className="w-4 h-4 text-sky-700 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[190px]">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Status */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          {user.role === 'admin' ? (
                            <Badge variant="sky" size="sm" dot>
                              DPL Admin
                            </Badge>
                          ) : (
                            <Badge variant="slate" size="sm">
                              Tenant Profile
                            </Badge>
                          )}
                          <Badge
                            variant={user.status === 'active' ? 'emerald' : 'rose'}
                            size="sm"
                          >
                            {user.status === 'active' ? 'Active Account' : 'Suspended'}
                          </Badge>
                        </div>
                      </td>

                      {/* Assigned Property */}
                      <td className="px-4 py-4">
                        {assignedProp ? (
                          (() => {
                            const assignedUnit = assignedProp.units?.find((u) => u.assignedUserId === user.id) ||
                              (user.assignedUnitId ? assignedProp.units?.find((u) => u.id === user.assignedUnitId) : null);
                            return (
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900 text-sm truncate max-w-[220px]" title={assignedProp.title}>
                                  {assignedProp.title}
                                </span>
                                {assignedUnit ? (
                                  <div className="inline-flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-xs text-sky-900 bg-sky-100/90 border border-sky-300 px-2 py-0.5 rounded-md">
                                      {assignedUnit.unitNumber}
                                    </span>
                                    <span className="text-xs text-slate-600 font-medium">
                                      {assignedUnit.bedrooms}B/{assignedUnit.bathrooms}Ba · {assignedUnit.balconies} Balc
                                    </span>
                                  </div>
                                ) : user.assignedUnitNumber ? (
                                  <span className="text-xs font-semibold text-sky-850">
                                    {user.assignedUnitNumber}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-500 truncate max-w-[210px]">
                                    {assignedProp.address} · {assignedProp.floor}
                                  </span>
                                )}
                                <span className="text-sm font-mono text-sky-800 font-bold">
                                  ${(assignedUnit ? assignedUnit.price : assignedProp.price).toLocaleString()}/mo
                                </span>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">Unassigned</span>
                            {onOpenAssignModal && user.status === 'active' && (
                              <button
                                onClick={() => onOpenAssignModal(user)}
                                className="text-xs text-sky-800 hover:text-sky-950 font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Key className="w-3.5 h-3.5 text-sky-700" /> Assign
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-4 text-slate-500 font-mono text-xs tabular-nums">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            title="Edit user profile"
                            className="p-2 text-slate-500 hover:text-sky-800 hover:bg-sky-100/70 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            disabled={user.role === 'admin' && user.id === 'usr-admin'}
                            onClick={() => setUserToDelete(user)}
                            title={
                              user.role === 'admin' && user.id === 'usr-admin'
                                ? 'Main admin cannot be deleted'
                                : 'Delete user profile'
                            }
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New User Account"
        subtitle="Admin provisioned profile with name, phone, email, password, and image (can be null)"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input
              placeholder="e.g. Elena Rostova"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Phone Number" required error={formErrors.phone}>
              <Input
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!formErrors.phone}
              />
            </FormField>

            <FormField label="Email Address" required error={formErrors.email}>
              <Input
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!formErrors.email}
              />
            </FormField>
          </div>

          <FormField
            label="Account Password"
            required
            error={formErrors.password}
            helperText="User password for credential authentication"
          >
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!formErrors.password}
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

          {/* Profile Image (Can be null) */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800">
                  Profile Image URL <span className="text-sky-900 font-bold">(Can be null / leave empty)</span>
                </label>
                <p className="text-xs text-slate-500">
                  If left blank, profile image is stored as <code className="text-sky-800 font-mono font-bold">null</code> and renders clean initials.
                </p>
              </div>
              <div className="shrink-0">
                <Avatar src={formData.image || null} name={formData.name || 'User'} size="md" />
              </div>
            </div>

            <Input
              placeholder="Paste image URL, or leave blank for null image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-slate-600 font-medium">Sample avatars:</span>
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className="text-xs font-bold text-sky-900 bg-white border border-sky-300 hover:border-sky-600 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {preset.label}
                </button>
              ))}
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-auto"
                >
                  Clear to Null
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Account Role">
              <Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                options={[
                  { value: 'user', label: 'Tenant Resident Profile' },
                  { value: 'admin', label: 'DPL Administrator' },
                ]}
              />
            </FormField>

            <FormField label="Account Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                options={[
                  { value: 'active', label: 'Active Account' },
                  { value: 'inactive', label: 'Suspended Account' },
                ]}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create User Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => {
          setEditingUser(null);
          resetForm();
        }}
        title={`Edit Profile: ${editingUser?.name}`}
        subtitle="Update user contact details, password, and avatar image"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <FormField label="Full Name" required error={formErrors.name}>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Phone Number" required error={formErrors.phone}>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!formErrors.phone}
              />
            </FormField>

            <FormField label="Email Address" required error={formErrors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!formErrors.email}
              />
            </FormField>
          </div>

          <FormField
            label="Password"
            helperText="Enter a new password or leave current value"
          >
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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

          {/* Profile Image (Can be null) */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800">
                  Profile Image URL <span className="text-sky-900 font-bold">(Can be null)</span>
                </label>
                <p className="text-xs text-slate-500">
                  {formData.image ? 'Custom image provided' : 'Currently null (renders letter initials)'}
                </p>
              </div>
              <div className="shrink-0">
                <Avatar src={formData.image || null} name={formData.name || 'User'} size="md" />
              </div>
            </div>

            <Input
              placeholder="Paste image URL, or leave blank for null image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />

            <div className="flex items-center gap-2 pt-1">
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear to Null
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Account Role">
              <Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                options={[
                  { value: 'user', label: 'Tenant Resident Profile' },
                  { value: 'admin', label: 'DPL Administrator' },
                ]}
              />
            </FormField>

            <FormField label="Account Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                options={[
                  { value: 'active', label: 'Active Account' },
                  { value: 'inactive', label: 'Suspended Account' },
                ]}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingUser(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Profile"
        message={`Are you sure you want to delete ${userToDelete?.name}? This will permanently remove their profile and unlink any assigned apartment leases.`}
        confirmLabel="Delete User Profile"
        variant="danger"
      />
    </div>
  );
};
