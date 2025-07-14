import { configureStore } from '@reduxjs/toolkit'
import loanReducer from './loanSlice'
import userReducer from './userSlice'
import activityReducer from './activitySlice';
import walletReducer from './walletSlice';

export const store = configureStore({
  reducer: {
    loan: loanReducer,
    user: userReducer,
    activity: activityReducer,
    wallet: walletReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch