import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CompanyAboutData,
  CoreValue,
  JourneyMilestone,
  WhyChooseReason,
  KeyAchievement,
} from '../../types';

export const initialCompanyAbout: CompanyAboutData = {
  companyName: 'Dreamer Properties LTD',
  tagline: 'Building Trust, Delivering Excellence Since 2010',
  heroImage:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  achievements: [
    {
      id: 'ach-1',
      number: '15+ Years',
      label: 'Industry Experience',
      icon: 'award',
      color: 'blue',
      order: 1,
    },
    {
      id: 'ach-2',
      number: '120+',
      label: 'Delivered Projects',
      icon: 'building',
      color: 'green',
      order: 2,
    },
    {
      id: 'ach-3',
      number: '50K+',
      label: 'Happy Families',
      icon: 'users',
      color: 'amber',
      order: 3,
    },
    {
      id: 'ach-4',
      number: '25+',
      label: 'National Awards',
      icon: 'trophy',
      color: 'purple',
      order: 4,
    },
  ],
  whyChooseUs: [
    {
      id: 'why-1',
      title: '100% Legal Transparency',
      description:
        'All land titles, city permits, and RAJUK approvals verified before project launch.',
      icon: 'scale',
      color: 'blue',
      order: 1,
    },
    {
      id: 'why-2',
      title: 'Timely Delivery Guarantee',
      description:
        'On-time handover track record supported by strict project management milestones.',
      icon: 'clock',
      color: 'green',
      order: 2,
    },
    {
      id: 'why-3',
      title: 'Eco-Friendly Smart Architecture',
      description:
        'Energy-efficient glass, rainwater harvesting, solar power backup, and rooftop gardens.',
      icon: 'leaf',
      color: 'emerald',
      order: 3,
    },
    {
      id: 'why-4',
      title: 'Flexible Installment Plans',
      description:
        'Tailored payment schedules and home loan facilitation with major banking partners.',
      icon: 'wallet',
      color: 'amber',
      order: 4,
    },
  ],
  coreValues: [
    {
      id: 'val-1',
      title: 'Integrity & Trust',
      description: 'Uncompromising honesty and transparency in all dealings.',
      icon: 'shield',
      badge: 'FOUNDATION',
      order: 1,
    },
    {
      id: 'val-2',
      title: 'Excellence',
      description: 'Pushing boundaries in architectural design and engineering.',
      icon: 'sparkles',
      order: 2,
    },
    {
      id: 'val-3',
      title: 'Sustainable Innovation',
      description: 'Eco-friendly materials, energy self-sufficiency, and future-ready communities.',
      icon: 'compass',
      order: 3,
    },
    {
      id: 'val-4',
      title: 'Client Centricity',
      description: 'Personalized homeowner onboarding and dedicated lifetime property support.',
      icon: 'heart',
      order: 4,
    },
  ],
  milestones: [
    {
      id: 'ms-1',
      year: '2010',
      title: 'Company Foundation',
      description:
        'Dreamer Properties LTD was established with a vision for modern, reliable real estate.',
      order: 1,
    },
    {
      id: 'ms-2',
      year: '2015',
      title: '50th Completed Project',
      description:
        'Handed over 50 residential towers across prime metropolitan regions.',
      order: 2,
    },
    {
      id: 'ms-3',
      year: '2020',
      title: 'Eco-Villa Expansion',
      description:
        'Pioneered eco-conscious luxury waterfront villa communities in Bali & Pacitan.',
      order: 3,
    },
    {
      id: 'ms-4',
      year: '2026',
      title: 'Smart High-Rise ERA',
      description:
        'Spearheading IoT-integrated smart automated residential complexes and commercial hubs.',
      order: 4,
    },
  ],
};

const loadInitialProfile = (): CompanyAboutData => {
  try {
    const saved = localStorage.getItem('dpl_company_profile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load company profile from localStorage', e);
  }
  return initialCompanyAbout;
};

const saveProfile = (data: CompanyAboutData) => {
  try {
    localStorage.setItem('dpl_company_profile', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save company profile', e);
  }
};

interface CompanyProfileState {
  data: CompanyAboutData;
}

const initialState: CompanyProfileState = {
  data: loadInitialProfile(),
};

export const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {
    updateCompanyHeader: (
      state,
      action: PayloadAction<{ companyName: string; tagline: string; heroImage?: string }>
    ) => {
      state.data.companyName = action.payload.companyName;
      state.data.tagline = action.payload.tagline;
      if (action.payload.heroImage !== undefined) {
        state.data.heroImage = action.payload.heroImage;
      }
      saveProfile(state.data);
    },

    // --- Core Values ---
    addCoreValue: (state, action: PayloadAction<Omit<CoreValue, 'id' | 'order'>>) => {
      const newItem: CoreValue = {
        id: `val-${Date.now()}`,
        order: state.data.coreValues.length + 1,
        ...action.payload,
      };
      state.data.coreValues.push(newItem);
      saveProfile(state.data);
    },
    updateCoreValue: (state, action: PayloadAction<CoreValue>) => {
      const idx = state.data.coreValues.findIndex((v) => v.id === action.payload.id);
      if (idx !== -1) {
        state.data.coreValues[idx] = action.payload;
        saveProfile(state.data);
      }
    },
    deleteCoreValue: (state, action: PayloadAction<string>) => {
      state.data.coreValues = state.data.coreValues.filter((v) => v.id !== action.payload);
      saveProfile(state.data);
    },

    // --- Journey & Milestones ---
    addMilestone: (state, action: PayloadAction<Omit<JourneyMilestone, 'id' | 'order'>>) => {
      const newItem: JourneyMilestone = {
        id: `ms-${Date.now()}`,
        order: state.data.milestones.length + 1,
        ...action.payload,
      };
      state.data.milestones.push(newItem);
      saveProfile(state.data);
    },
    updateMilestone: (state, action: PayloadAction<JourneyMilestone>) => {
      const idx = state.data.milestones.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.data.milestones[idx] = action.payload;
        saveProfile(state.data);
      }
    },
    deleteMilestone: (state, action: PayloadAction<string>) => {
      state.data.milestones = state.data.milestones.filter((m) => m.id !== action.payload);
      saveProfile(state.data);
    },

    // --- Why Choose Dreamer Properties ---
    addWhyChooseReason: (
      state,
      action: PayloadAction<Omit<WhyChooseReason, 'id' | 'order'>>
    ) => {
      const newItem: WhyChooseReason = {
        id: `why-${Date.now()}`,
        order: state.data.whyChooseUs.length + 1,
        ...action.payload,
      };
      state.data.whyChooseUs.push(newItem);
      saveProfile(state.data);
    },
    updateWhyChooseReason: (state, action: PayloadAction<WhyChooseReason>) => {
      const idx = state.data.whyChooseUs.findIndex((w) => w.id === action.payload.id);
      if (idx !== -1) {
        state.data.whyChooseUs[idx] = action.payload;
        saveProfile(state.data);
      }
    },
    deleteWhyChooseReason: (state, action: PayloadAction<string>) => {
      state.data.whyChooseUs = state.data.whyChooseUs.filter((w) => w.id !== action.payload);
      saveProfile(state.data);
    },

    // --- Key Achievements ---
    addKeyAchievement: (
      state,
      action: PayloadAction<Omit<KeyAchievement, 'id' | 'order'>>
    ) => {
      const newItem: KeyAchievement = {
        id: `ach-${Date.now()}`,
        order: state.data.achievements.length + 1,
        ...action.payload,
      };
      state.data.achievements.push(newItem);
      saveProfile(state.data);
    },
    updateKeyAchievement: (state, action: PayloadAction<KeyAchievement>) => {
      const idx = state.data.achievements.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) {
        state.data.achievements[idx] = action.payload;
        saveProfile(state.data);
      }
    },
    deleteKeyAchievement: (state, action: PayloadAction<string>) => {
      state.data.achievements = state.data.achievements.filter((a) => a.id !== action.payload);
      saveProfile(state.data);
    },

    // Reset to default
    resetCompanyProfileToDefault: (state) => {
      state.data = initialCompanyAbout;
      saveProfile(state.data);
    },
  },
});

export const {
  updateCompanyHeader,
  addCoreValue,
  updateCoreValue,
  deleteCoreValue,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addWhyChooseReason,
  updateWhyChooseReason,
  deleteWhyChooseReason,
  addKeyAchievement,
  updateKeyAchievement,
  deleteKeyAchievement,
  resetCompanyProfileToDefault,
} = companyProfileSlice.actions;

export default companyProfileSlice.reducer;
