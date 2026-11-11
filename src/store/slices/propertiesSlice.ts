import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property, ApartmentUnit } from '../../types';
import { initialProperties } from '../../data/initialData';

interface PropertiesState {
  properties: Property[];
  selectedProperty: Property | null;
  categoryFilter: string;
  collectionFilter: 'all' | 'exclusive' | 'completed' | 'ongoing';
  statusFilter: string;
  searchQuery: string;
}

const loadInitialProperties = (): Property[] => {
  try {
    const saved = localStorage.getItem('dpl_properties');
    if (saved) {
      const parsed: Property[] = JSON.parse(saved);
      // Ensure all loaded properties have units properly populated
      return parsed.map((p) => {
        if (!p.units || p.units.length === 0) {
          const matchInitial = initialProperties.find((ip) => ip.id === p.id);
          if (matchInitial && matchInitial.units && matchInitial.units.length > 0) {
            return { ...p, units: matchInitial.units };
          }
          return {
            ...p,
            balconies: p.balconies ?? 1,
            units: [
              {
                id: `${p.id}-u1`,
                unitNumber: 'Unit 201',
                title: '2-Bed Standard Suite',
                bedrooms: p.bedrooms || 2,
                bathrooms: p.bathrooms || 2,
                balconies: 1,
                size: p.size || 1150,
                floor: p.floor || '2nd Floor',
                price: p.price || 3200,
                availabilityStatus: p.availabilityStatus || 'Available',
                assignedUserId: p.assignedUserId || null,
              },
              {
                id: `${p.id}-u2`,
                unitNumber: 'Unit 305',
                title: '3-Bed Family Residence',
                bedrooms: 3,
                bathrooms: 2,
                balconies: 2,
                size: 1650,
                floor: '3rd Floor',
                price: Math.round((p.price || 3200) * 1.3),
                availabilityStatus: 'Available',
                assignedUserId: null,
              },
            ],
          };
        }
        return p;
      });
    }
  } catch (e) {
    console.error('Failed to load properties from localStorage', e);
  }
  return initialProperties;
};

const initialState: PropertiesState = {
  properties: loadInitialProperties(),
  selectedProperty: null,
  categoryFilter: 'all',
  collectionFilter: 'all',
  statusFilter: 'all',
  searchQuery: '',
};

const saveProperties = (properties: Property[]) => {
  try {
    localStorage.setItem('dpl_properties', JSON.stringify(properties));
  } catch (e) {
    console.error('Failed to save properties', e);
  }
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperty: (state, action: PayloadAction<Omit<Property, 'id' | 'createdAt'>>) => {
      const newProperty: Property = {
        ...action.payload,
        id: `prop-${Date.now()}`,
        createdAt: new Date().toISOString(),
        units: action.payload.units && action.payload.units.length > 0
          ? action.payload.units
          : [
              {
                id: `u-${Date.now()}-1`,
                unitNumber: 'Unit 101',
                title: 'Unit 101',
                bedrooms: action.payload.bedrooms || 2,
                bathrooms: action.payload.bathrooms || 2,
                balconies: action.payload.balconies || 1,
                size: action.payload.size || 1100,
                floor: action.payload.floor || '1st Floor',
                price: action.payload.price || 3000,
                availabilityStatus: 'Available',
                assignedUserId: null,
              },
            ],
      };
      state.properties.unshift(newProperty);
      saveProperties(state.properties);
    },
    updateProperty: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Property> }>
    ) => {
      const index = state.properties.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = { ...state.properties[index], ...action.payload.data };
        saveProperties(state.properties);
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter((p) => p.id !== action.payload);
      saveProperties(state.properties);
    },
    assignPropertyToUser: (
      state,
      action: PayloadAction<{ propertyId: string; userId: string; unitId?: string }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop) {
        prop.assignedUserId = action.payload.userId;
        prop.availabilityStatus = 'Assigned';
        if (action.payload.unitId && prop.units) {
          const unit = prop.units.find((u) => u.id === action.payload.unitId);
          if (unit) {
            unit.assignedUserId = action.payload.userId;
            unit.availabilityStatus = 'Assigned';
          }
        }
        saveProperties(state.properties);
      }
    },
    unassignProperty: (state, action: PayloadAction<string>) => {
      const prop = state.properties.find((p) => p.id === action.payload);
      if (prop) {
        prop.assignedUserId = null;
        prop.availabilityStatus = 'Available';
        if (prop.units) {
          prop.units.forEach((u) => {
            if (u.availabilityStatus === 'Assigned') {
              u.availabilityStatus = 'Available';
              u.assignedUserId = null;
              u.assignedUserName = null;
            }
          });
        }
        saveProperties(state.properties);
      }
    },
    assignUnitToUser: (
      state,
      action: PayloadAction<{
        propertyId: string;
        unitId: string;
        userId: string;
        userName?: string;
      }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop && prop.units) {
        const unit = prop.units.find((u) => u.id === action.payload.unitId);
        if (unit) {
          unit.assignedUserId = action.payload.userId;
          unit.assignedUserName = action.payload.userName || null;
          unit.availabilityStatus = 'Assigned';
        }
        // Update property-level assignment status
        const allAssigned = prop.units.every((u) => u.availabilityStatus === 'Assigned');
        if (allAssigned) {
          prop.availabilityStatus = 'Assigned';
        }
        prop.assignedUserId = action.payload.userId;
        saveProperties(state.properties);
      }
    },
    unassignUnit: (
      state,
      action: PayloadAction<{ propertyId: string; unitId: string }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop && prop.units) {
        const unit = prop.units.find((u) => u.id === action.payload.unitId);
        if (unit) {
          unit.assignedUserId = null;
          unit.assignedUserName = null;
          unit.availabilityStatus = 'Available';
        }
        const anyAssigned = prop.units.some((u) => u.availabilityStatus === 'Assigned');
        if (!anyAssigned) {
          prop.availabilityStatus = 'Available';
          prop.assignedUserId = null;
        }
        saveProperties(state.properties);
      }
    },
    addUnitToProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        unit: Omit<ApartmentUnit, 'id'>;
      }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop) {
        if (!prop.units) prop.units = [];
        const newUnit: ApartmentUnit = {
          ...action.payload.unit,
          id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        prop.units.push(newUnit);
        saveProperties(state.properties);
      }
    },
    updateUnitInProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        unitId: string;
        data: Partial<ApartmentUnit>;
      }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop && prop.units) {
        const uIndex = prop.units.findIndex((u) => u.id === action.payload.unitId);
        if (uIndex !== -1) {
          prop.units[uIndex] = { ...prop.units[uIndex], ...action.payload.data };
          saveProperties(state.properties);
        }
      }
    },
    deleteUnitFromProperty: (
      state,
      action: PayloadAction<{ propertyId: string; unitId: string }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.propertyId);
      if (prop && prop.units) {
        prop.units = prop.units.filter((u) => u.id !== action.payload.unitId);
        saveProperties(state.properties);
      }
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setCollectionFilter: (
      state,
      action: PayloadAction<'all' | 'exclusive' | 'completed' | 'ongoing'>
    ) => {
      state.collectionFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    togglePropertyExclusive: (state, action: PayloadAction<string>) => {
      const prop = state.properties.find((p) => p.id === action.payload);
      if (prop) {
        prop.isExclusive = !prop.isExclusive;
        if (prop.isExclusive) {
          prop.listingCollection = 'exclusive';
        } else if (prop.listingCollection === 'exclusive') {
          prop.listingCollection = prop.projectStage === 'ongoing' ? 'ongoing' : 'completed';
        }
        saveProperties(state.properties);
      }
    },
    setPropertyCollection: (
      state,
      action: PayloadAction<{
        id: string;
        collection: 'exclusive' | 'completed' | 'ongoing' | 'standard';
      }>
    ) => {
      const prop = state.properties.find((p) => p.id === action.payload.id);
      if (prop) {
        prop.listingCollection = action.payload.collection;
        if (action.payload.collection === 'exclusive') {
          prop.isExclusive = true;
        } else if (action.payload.collection === 'ongoing') {
          prop.projectStage = 'ongoing';
        } else if (action.payload.collection === 'completed') {
          prop.projectStage = 'completed';
        }
        saveProperties(state.properties);
      }
    },
  },
});

export const {
  addProperty,
  updateProperty,
  deleteProperty,
  assignPropertyToUser,
  unassignProperty,
  assignUnitToUser,
  unassignUnit,
  addUnitToProperty,
  updateUnitInProperty,
  deleteUnitFromProperty,
  setSelectedProperty,
  setCategoryFilter,
  setCollectionFilter,
  setStatusFilter,
  setSearchQuery,
  togglePropertyExclusive,
  setPropertyCollection,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
