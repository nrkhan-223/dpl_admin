import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import categoriesReducer from './slices/categoriesSlice';
import propertiesReducer from './slices/propertiesSlice';
import bookingsReducer from './slices/bookingsSlice';
import blogsReducer from './slices/blogsSlice';
import sisterConcernsReducer from './slices/sisterConcernsSlice';
import contactInfoReducer from './slices/contactInfoSlice';
import callbackRequestsReducer from './slices/callbackRequestsSlice';
import companyProfileReducer from './slices/companyProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    categories: categoriesReducer,
    properties: propertiesReducer,
    bookings: bookingsReducer,
    blogs: blogsReducer,
    sisterConcerns: sisterConcernsReducer,
    contactInfo: contactInfoReducer,
    callbackRequests: callbackRequestsReducer,
    companyProfile: companyProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
