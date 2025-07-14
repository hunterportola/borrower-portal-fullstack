import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // Fixed: Type-only import
import axios from 'axios';

export interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  maritalStatus: string;
  education: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  bankName: string;
  accountHolderName: string;
  bsb: string; // Fixed: Added missing property
  accountNumber: string;
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  idDocument: string | null;
}

const initialState: UserState = {
  firstName: 'John',
  lastName: 'Harper',
  email: 'Harper5755@yopmail.com',
  phoneNumber: '555-123-4567',
  maritalStatus: 'Married',
  education: 'Bachelor\'s degree',
  birthDay: '13',
  birthMonth: '10',
  birthYear: '1985',
  bankName: 'Commonwealth Bank',
  accountHolderName: 'John Harper',
  bsb: '062-000',
  accountNumber: '123456789',
  employmentStatus: 'Full-time',
  employerName: 'Tech Solutions Inc.',
  jobTitle: 'Senior Software Engineer',
  idDocument: 'passport.pdf',
};

export const exchangePlaidTokenAndRefreshBankInfo = createAsyncThunk(
  'user/exchangePlaidToken',
  async (public_token: string) => {
    const response = await axios.post('http://localhost:3001/api/exchange_public_token', { public_token });
    return response.data;
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
      .addCase(exchangePlaidTokenAndRefreshBankInfo.pending, (_state) => { // Fixed: Prefixed unused 'state' with _
        console.log("Exchanging token and refreshing bank info...");
      })
      .addCase(exchangePlaidTokenAndRefreshBankInfo.fulfilled, (state, action) => {
        state.bankName = action.payload.bankName;
        state.accountHolderName = action.payload.accountHolderName;
        state.accountNumber = action.payload.accountNumber;
        console.log("Bank info updated successfully!");
      })
      .addCase(exchangePlaidTokenAndRefreshBankInfo.rejected, (_state) => { // Fixed: Prefixed unused 'state' with _
        console.error("Failed to update bank info.");
      });
  },
});

export const { updateUserField } = userSlice.actions;
export default userSlice.reducer;