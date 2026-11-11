import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { initialUsers } from '../../data/initialData';

interface UsersState {
  users: User[];
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive';
}

const loadInitialUsers = (): User[] => {
  try {
    const saved = localStorage.getItem('dpl_users');
    if (saved) {
      const parsed: User[] = JSON.parse(saved);
      return parsed.map((u) => ({
        ...u,
        image:
          typeof u.image === 'string' && u.image.startsWith('/src/assets/images/')
            ? u.image.replace('/src/assets/images/', '/images/')
            : u.image,
      }));
    }
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
  }
  return initialUsers;
};

const initialState: UsersState = {
  users: loadInitialUsers(),
  searchQuery: '',
  statusFilter: 'all',
};

const saveUsers = (users: User[]) => {
  try {
    localStorage.setItem('dpl_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (
      state,
      action: PayloadAction<{
        name: string;
        phone: string;
        email: string;
        password?: string;
        image?: string | null;
        role?: 'admin' | 'user';
        status?: 'active' | 'inactive';
      }>
    ) => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: action.payload.name.trim(),
        phone: action.payload.phone.trim(),
        email: action.payload.email.trim().toLowerCase(),
        password: action.payload.password || 'password123',
        image: action.payload.image ? action.payload.image.trim() : null,
        role: action.payload.role || 'user',
        status: action.payload.status || 'active',
        createdAt: new Date().toISOString(),
        assignedPropertyId: null,
      };
      state.users.unshift(newUser);
      saveUsers(state.users);
    },
    updateUser: (state, action: PayloadAction<{ id: string; data: Partial<User> }>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.data };
        saveUsers(state.users);
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      saveUsers(state.users);
    },
    setUserAssignedProperty: (
      state,
      action: PayloadAction<{
        userId: string;
        propertyId: string | null;
        unitId?: string | null;
        unitNumber?: string | null;
      }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.assignedPropertyId = action.payload.propertyId;
        user.assignedUnitId = action.payload.unitId ?? null;
        user.assignedUnitNumber = action.payload.unitNumber ?? null;
        saveUsers(state.users);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setUserAssignedProperty,
  setSearchQuery,
  setStatusFilter,
} = usersSlice.actions;

export default usersSlice.reducer;
