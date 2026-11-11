import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { initialCategories } from '../../data/initialData';

interface CategoriesState {
  categories: Category[];
}

const loadInitialCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem('dpl_categories');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load categories from localStorage', e);
  }
  return initialCategories;
};

const initialState: CategoriesState = {
  categories: loadInitialCategories(),
};

const saveCategories = (categories: Category[]) => {
  try {
    localStorage.setItem('dpl_categories', JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (
      state,
      action: PayloadAction<{ name: string; description: string; iconName?: string }>
    ) => {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: action.payload.name.trim(),
        description: action.payload.description.trim(),
        iconName: action.payload.iconName || 'Building2',
        createdAt: new Date().toISOString(),
      };
      state.categories.unshift(newCategory);
      saveCategories(state.categories);
    },
    updateCategory: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string; iconName?: string }>
    ) => {
      const cat = state.categories.find((c) => c.id === action.payload.id);
      if (cat) {
        cat.name = action.payload.name.trim();
        cat.description = action.payload.description.trim();
        if (action.payload.iconName) cat.iconName = action.payload.iconName;
        saveCategories(state.categories);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      saveCategories(state.categories);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
