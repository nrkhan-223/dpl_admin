import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallbackRequest } from '../../types';

interface CallbackRequestsState {
  requests: CallbackRequest[];
}

export const initialCallbacks: CallbackRequest[] = [
  {
    id: 'cb-1',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    email: 'sarah.jenkins@techcorp.io',
    description: 'Interested in the 3-Bedroom Executive Suite with 2 balconies. Want to verify availability for move-in next month and inquire about the installment payment schedule.',
    propertyInterest: 'Grand Horizon Penthouse (Unit 302)',
    preferredTime: 'Morning (9:00 AM – 12:00 PM)',
    priority: 'Urgent',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cb-2',
    name: 'Tariq Al-Mansoor',
    phone: '+1 (555) 876-5432',
    email: 'tariq.mansoor@almansoor-capital.com',
    description: 'Requesting a private walkthrough of the entire floor development. Need information regarding building amenities, reserved VIP parking bays, and commercial lease terms.',
    propertyInterest: 'The Pinnacle Horizon Residence',
    preferredTime: 'Afternoon (1:00 PM – 4:00 PM)',
    priority: 'High',
    status: 'In Progress',
    adminNotes: 'Spoke briefly with executive assistant; scheduling in-person inspection for Thursday 3:00 PM.',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cb-3',
    name: 'Claire Montclaire',
    phone: '+1 (555) 345-9876',
    email: 'claire.m@luxuryventures.co',
    description: 'Looking to lease a 2-bedroom apartment with 1 balcony for corporate relocation. Please call back with details on the security deposit and monthly maintenance breakdown.',
    propertyInterest: 'Azure Skyline Residence (Unit 104)',
    preferredTime: 'Evening (5:00 PM – 7:30 PM)',
    priority: 'Normal',
    status: 'Completed',
    calledAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    adminNotes: 'Called client at 5:15 PM. Sent lease documentation and verified installment schedule.',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

const loadInitialCallbacks = (): CallbackRequest[] => {
  try {
    const saved = localStorage.getItem('dpl_callback_requests');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load callback requests from localStorage', e);
  }
  return initialCallbacks;
};

const initialState: CallbackRequestsState = {
  requests: loadInitialCallbacks(),
};

const saveCallbacks = (requests: CallbackRequest[]) => {
  try {
    localStorage.setItem('dpl_callback_requests', JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save callback requests', e);
  }
};

export const callbackRequestsSlice = createSlice({
  name: 'callbackRequests',
  initialState,
  reducers: {
    addCallbackRequest: (
      state,
      action: PayloadAction<Omit<CallbackRequest, 'id' | 'createdAt' | 'status'>>
    ) => {
      const newRequest: CallbackRequest = {
        id: `cb-${Date.now()}`,
        status: 'Pending',
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.requests.unshift(newRequest);
      saveCallbacks(state.requests);
    },
    updateCallbackStatus: (
      state,
      action: PayloadAction<{ id: string; status: CallbackRequest['status']; notes?: string }>
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
        if (action.payload.status === 'Completed' && !request.calledAt) {
          request.calledAt = new Date().toISOString();
        }
        if (action.payload.notes !== undefined) {
          request.adminNotes = action.payload.notes;
        }
        request.updatedAt = new Date().toISOString();
        saveCallbacks(state.requests);
      }
    },
    updateCallbackNotes: (
      state,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.id);
      if (request) {
        request.adminNotes = action.payload.notes;
        request.updatedAt = new Date().toISOString();
        saveCallbacks(state.requests);
      }
    },
    deleteCallbackRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload);
      saveCallbacks(state.requests);
    },
    resetCallbacksToDefault: (state) => {
      state.requests = initialCallbacks;
      saveCallbacks(state.requests);
    },
  },
});

export const {
  addCallbackRequest,
  updateCallbackStatus,
  updateCallbackNotes,
  deleteCallbackRequest,
  resetCallbacksToDefault,
} = callbackRequestsSlice.actions;

export default callbackRequestsSlice.reducer;
