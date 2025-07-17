import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  actionType: 'sign' | 'add-info' | 'transaction' | 'payment_success'; // Expanded actionType
  txHash?: string;
  txStatus?: 'pending' | 'success' | 'failed';
}

export interface ActivityState {
  items: ActivityItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ActivityState = {
  items: [],
  status: 'idle',
};

export const fetchActivities = createAsyncThunk('activity/fetchActivities', async () => {
  const response = await axios.get('http://localhost:3001/api/activities');
  return response.data;
});

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addPendingTransaction: (state, action: PayloadAction<{ amount: string; txHash: string }>) => {
      const { amount, txHash } = action.payload;
      const newActivity: ActivityItem = {
        id: txHash, // Use txHash as a unique ID
        message: `Your payment of ${amount} USDC is pending...`,
        timestamp: new Date().toLocaleString(),
        actionType: 'transaction',
        txHash: txHash,
        txStatus: 'pending',
      };
      state.items.unshift(newActivity); // Add to the top of the list
    },
    updateTransactionStatus: (state, action: PayloadAction<{ txHash: string; status: 'success' | 'failed' }>) => {
      const { txHash, status } = action.payload;
      const item = state.items.find(item => item.txHash === txHash);
      if (item) {
        item.txStatus = status;
        item.message = status === 'success' 
          ? `Your payment was successful.` 
          : `Your payment failed.`;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchActivities.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addPendingTransaction, updateTransactionStatus, removeItem } = activitySlice.actions;

export default activitySlice.reducer;