import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SisterConcern } from '../../types';

interface SisterConcernsState {
  sisterConcerns: SisterConcern[];
}

export const initialSisterConcerns: SisterConcern[] = [
  {
    id: 'sc-1',
    name: 'DPL Horizon Capital',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    industry: 'Asset & Equity Management',
    description: 'Premier private equity and real estate investment arm funding landmark metropolitan developments.',
    websiteUrl: 'https://capital.dpl.com',
    status: 'active',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'sc-2',
    name: 'DPL Hospitality & Suites',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    industry: 'Luxury Hotels & Serviced Residences',
    description: 'Five-star residential hospitality management providing 24/7 concierge and private dining services.',
    websiteUrl: 'https://hospitality.dpl.com',
    status: 'active',
    createdAt: '2026-01-20T11:30:00Z',
    updatedAt: '2026-01-20T11:30:00Z',
  },
  {
    id: 'sc-3',
    name: 'DPL Commercial Towers',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    industry: 'Commercial Real Estate & Grade-A Workspaces',
    description: 'Architecturally distinguished office towers housing multinational corporations and financial institutions.',
    websiteUrl: 'https://commercial.dpl.com',
    status: 'active',
    createdAt: '2026-02-01T09:45:00Z',
    updatedAt: '2026-02-01T09:45:00Z',
  },
  {
    id: 'sc-4',
    name: 'Apex Living Infrastructure',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    industry: 'Civil Engineering & Smart Construction',
    description: 'High-precision structural engineering and sustainable smart-building construction systems.',
    websiteUrl: 'https://apex-infra.dpl.com',
    status: 'active',
    createdAt: '2026-02-05T14:20:00Z',
    updatedAt: '2026-02-05T14:20:00Z',
  },
  {
    id: 'sc-5',
    name: 'Verdant Eco-Living Systems',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    industry: 'Biophilic Design & Renewable Energy',
    description: 'Integrating solar roofing, greywater recycling, and rooftop biophilic sanctuaries across DPL communities.',
    websiteUrl: 'https://verdant.dpl.com',
    status: 'active',
    createdAt: '2026-02-12T16:00:00Z',
    updatedAt: '2026-02-12T16:00:00Z',
  },
];

const loadInitialSisterConcerns = (): SisterConcern[] => {
  try {
    const saved = localStorage.getItem('dpl_sister_concerns');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load sister concerns from localStorage', e);
  }
  return initialSisterConcerns;
};

const initialState: SisterConcernsState = {
  sisterConcerns: loadInitialSisterConcerns(),
};

const saveSisterConcerns = (concerns: SisterConcern[]) => {
  try {
    localStorage.setItem('dpl_sister_concerns', JSON.stringify(concerns));
  } catch (e) {
    console.error('Failed to save sister concerns', e);
  }
};

export const sisterConcernsSlice = createSlice({
  name: 'sisterConcerns',
  initialState,
  reducers: {
    addSisterConcern: (
      state,
      action: PayloadAction<Omit<SisterConcern, 'id' | 'createdAt'>>
    ) => {
      const newConcern: SisterConcern = {
        id: `sc-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.sisterConcerns.unshift(newConcern);
      saveSisterConcerns(state.sisterConcerns);
    },
    updateSisterConcern: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Omit<SisterConcern, 'id' | 'createdAt'>> }>
    ) => {
      const concern = state.sisterConcerns.find((c) => c.id === action.payload.id);
      if (concern) {
        Object.assign(concern, action.payload.data, {
          updatedAt: new Date().toISOString(),
        });
        saveSisterConcerns(state.sisterConcerns);
      }
    },
    deleteSisterConcern: (state, action: PayloadAction<string>) => {
      state.sisterConcerns = state.sisterConcerns.filter((c) => c.id !== action.payload);
      saveSisterConcerns(state.sisterConcerns);
    },
    toggleSisterConcernStatus: (state, action: PayloadAction<string>) => {
      const concern = state.sisterConcerns.find((c) => c.id === action.payload);
      if (concern) {
        concern.status = concern.status === 'active' ? 'inactive' : 'active';
        concern.updatedAt = new Date().toISOString();
        saveSisterConcerns(state.sisterConcerns);
      }
    },
    resetSisterConcernsToDefault: (state) => {
      state.sisterConcerns = initialSisterConcerns;
      saveSisterConcerns(state.sisterConcerns);
    },
  },
});

export const {
  addSisterConcern,
  updateSisterConcern,
  deleteSisterConcern,
  toggleSisterConcernStatus,
  resetSisterConcernsToDefault,
} = sisterConcernsSlice.actions;

export default sisterConcernsSlice.reducer;
