import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyContactInfo, OfficeScheduleItem } from '../../types';

interface ContactInfoState {
  info: CompanyContactInfo;
}

export const initialContactInfo: CompanyContactInfo = {
  hotline: '+1 (800) 555-DPL-VIP',
  whatsapp: '+1 (555) 987-6543',
  email: 'contact@dpl.com',
  supportEmail: 'concierge@dpl.com',
  address: 'DPL Horizon Corporate Tower, Level 42',
  cityStateZip: '742 Skyline Boulevard, Prime Financial District',
  isOpenNow: true,
  statusBadgeText: 'OPEN NOW',
  schedules: [
    {
      id: 'sch-1',
      days: 'Saturday – Thursday',
      hours: '9:00 AM – 8:00 PM',
      isAppointmentOnly: false,
    },
    {
      id: 'sch-2',
      days: 'Friday (Jummah)',
      hours: 'Appointments Only',
      isAppointmentOnly: true,
    },
  ],
  emergencyNote: '24/7 Hotline support remains active for urgent client inquiries.',
  updatedAt: new Date().toISOString(),
};

const loadInitialContactInfo = (): CompanyContactInfo => {
  try {
    const saved = localStorage.getItem('dpl_contact_info');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load contact info from localStorage', e);
  }
  return initialContactInfo;
};

const initialState: ContactInfoState = {
  info: loadInitialContactInfo(),
};

const saveContactInfo = (info: CompanyContactInfo) => {
  try {
    localStorage.setItem('dpl_contact_info', JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save contact info', e);
  }
};

export const contactInfoSlice = createSlice({
  name: 'contactInfo',
  initialState,
  reducers: {
    updateContactInfo: (
      state,
      action: PayloadAction<Partial<Omit<CompanyContactInfo, 'schedules'>>>
    ) => {
      Object.assign(state.info, action.payload, {
        updatedAt: new Date().toISOString(),
      });
      saveContactInfo(state.info);
    },
    addScheduleItem: (
      state,
      action: PayloadAction<Omit<OfficeScheduleItem, 'id'>>
    ) => {
      const newItem: OfficeScheduleItem = {
        id: `sch-${Date.now()}`,
        ...action.payload,
      };
      state.info.schedules.push(newItem);
      state.info.updatedAt = new Date().toISOString();
      saveContactInfo(state.info);
    },
    updateScheduleItem: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Omit<OfficeScheduleItem, 'id'>> }>
    ) => {
      const item = state.info.schedules.find((s) => s.id === action.payload.id);
      if (item) {
        Object.assign(item, action.payload.data);
        state.info.updatedAt = new Date().toISOString();
        saveContactInfo(state.info);
      }
    },
    deleteScheduleItem: (state, action: PayloadAction<string>) => {
      state.info.schedules = state.info.schedules.filter((s) => s.id !== action.payload);
      state.info.updatedAt = new Date().toISOString();
      saveContactInfo(state.info);
    },
    toggleOpenStatus: (state) => {
      state.info.isOpenNow = !state.info.isOpenNow;
      state.info.statusBadgeText = state.info.isOpenNow ? 'OPEN NOW' : 'CLOSED NOW';
      state.info.updatedAt = new Date().toISOString();
      saveContactInfo(state.info);
    },
    resetContactInfoToDefault: (state) => {
      state.info = initialContactInfo;
      saveContactInfo(state.info);
    },
  },
});

export const {
  updateContactInfo,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  toggleOpenStatus,
  resetContactInfoToDefault,
} = contactInfoSlice.actions;

export default contactInfoSlice.reducer;
