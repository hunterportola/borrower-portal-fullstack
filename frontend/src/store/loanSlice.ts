import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface LoanState {
  originalAmount: number;
  outstandingBalance: number;
  nextPaymentAmount: number;
  loanTerm: number;
  interestRate: number;
  principalDebt: number;
  interestBalance: number;
  overduePrincipalDebt: number;
  overdueInterest: number;
  issueDate: string;
  maturityDate: string;
  endDate: string;
  outstandingLTV: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: LoanState = {
  originalAmount: 0,
  outstandingBalance: 0,
  nextPaymentAmount: 0,
  loanTerm: 0,
  interestRate: 0,
  principalDebt: 0,
  interestBalance: 0,
  overduePrincipalDebt: 0,
  overdueInterest: 0,
  issueDate: '',
  maturityDate: '',
  endDate: '',
  outstandingLTV: 0,
  status: 'idle',
};

// The thunk to fetch loan data from the API
export const fetchLoan = createAsyncThunk('loan/fetchLoan', async () => {
    const response = await axios.get('http://localhost:3001/api/loan');
    return response.data;
});

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoan.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Replace the state with the data from the API
        Object.assign(state, action.payload);
      })
      .addCase(fetchLoan.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default loanSlice.reducer;