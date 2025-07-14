import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WalletState {
  address: string | null;
  networkName: string | null;
  chainId: string | null; // <-- Change this from 'bigint' to 'string'
  usdcBalance: string | null;
  nativeBalance: string | null;
  status: 'disconnected' | 'connecting' | 'connected';
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  networkName: null,
  chainId: null,
  usdcBalance: null,
  nativeBalance: null,
  status: 'disconnected',
  error: null,
};

interface ConnectionSuccessPayload {
  address: string;
  networkName: string;
  chainId: string; // <-- Change this from 'bigint' to 'string'
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state) => {
      state.status = 'connecting';
      state.address = null;
      state.error = null;
      state.networkName = null;
      state.chainId = null;
      state.usdcBalance = null;
      state.nativeBalance = null;
    },
    setConnected: (state, action: PayloadAction<ConnectionSuccessPayload>) => {
      state.status = 'connected';
      state.address = action.payload.address;
      state.networkName = action.payload.networkName;
      state.chainId = action.payload.chainId;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.status = 'disconnected';
      state.address = null;
      state.error = null;
      state.networkName = null;
      state.chainId = null;
      state.usdcBalance = null;
      state.nativeBalance = null;
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletNetworkName');
      localStorage.removeItem('walletChainId');
    },
    setError: (state, action: PayloadAction<string>) => {
        state.status = 'disconnected';
        state.error = action.payload;
    },
    setUsdcBalance: (state, action: PayloadAction<string>) => {
      state.usdcBalance = action.payload;
    },
    setNativeBalance: (state, action: PayloadAction<string>) => {
      state.nativeBalance = action.payload;
    }
  },
});

export const { 
  setConnecting, 
  setConnected, 
  setDisconnected, 
  setError, 
  setUsdcBalance,
  setNativeBalance
} = walletSlice.actions;

export default walletSlice.reducer;