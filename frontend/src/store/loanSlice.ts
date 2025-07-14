import { createSlice } from '@reduxjs/toolkit';

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
}

const initialState: LoanState = {
  originalAmount: 7000.00,
  outstandingBalance: 6440.32,
  nextPaymentAmount: 676.00,
  loanTerm: 12,
  interestRate: 12,
  principalDebt: 6404.45,
  interestBalance: 35.87,
  overduePrincipalDebt: 0,
  overdueInterest: 0,
  issueDate: 'Nov 29, 2024',
  maturityDate: 'Dec 15, 2025',
  endDate: 'Dec 29, 2025',
  outstandingLTV: 99.08,
};

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {},
});

export default loanSlice.reducer;