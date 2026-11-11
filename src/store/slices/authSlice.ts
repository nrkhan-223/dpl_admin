import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { initialUsers } from '../../data/initialData';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const loadInitialAuth = (): AuthState => {
  try {
    const saved = localStorage.getItem('dpl_auth_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentUser) {
        return {
          currentUser: parsed.currentUser,
          isAuthenticated: !!parsed.isAuthenticated,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load auth from localStorage', e);
  }
  // Default to DPL Admin
  const defaultAdmin = initialUsers.find((u) => u.role === 'admin') || initialUsers[0];
  return {
    currentUser: defaultAdmin,
    isAuthenticated: true,
  };
};

const initialState: AuthState = loadInitialAuth();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('dpl_auth_state', JSON.stringify(state));
      } catch (e) {
        console.error(e);
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('dpl_auth_state');
      } catch (e) {
        console.error(e);
      }
    },
    updateCurrentUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        try {
          localStorage.setItem('dpl_auth_state', JSON.stringify(state));
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
});

export const { login, logout, updateCurrentUserProfile } = authSlice.actions;
export default authSlice.reducer;
