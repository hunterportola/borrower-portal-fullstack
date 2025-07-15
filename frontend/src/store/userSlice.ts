import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface UserState {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  maritalStatus: string;
  education: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  idDocument: string | null;
  walletAddress: string | null; // <-- ADDED THIS LINE
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  maritalStatus: '',
  education: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  employmentStatus: '',
  employerName: '',
  jobTitle: '',
  idDocument: null,
  walletAddress: null, // <-- ADDED THIS LINE
  status: 'idle',
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axios.get('http://localhost:3001/api/user');
  return response.data;
});

// --- NEW THUNK TO SAVE THE WALLET ADDRESS ---
export const saveWalletAddress = createAsyncThunk(
  'user/saveWalletAddress',
  async (walletAddress: string | null) => {
    const response = await axios.post('http://localhost:3001/api/user/wallet', { walletAddress });
    return response.data.user;
  }
);


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserField: (state, action: PayloadAction<{ field: keyof UserState; value: string | null }>) => {
      const { field, value } = action.payload;
      state[field] = value as any;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed';
      })
      // Handle the state update after saving the wallet address
      .addCase(saveWalletAddress.fulfilled, (state, action) => {
        state.walletAddress = action.payload.walletAddress;
      });
  },
});

export const { updateUserField } = userSlice.actions;
export default userSlice.reducer;