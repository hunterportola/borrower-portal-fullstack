import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Add new properties for transaction tracking
export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  actionType: 'sign' | 'add-info' | 'transaction'; // New actionType
  txHash?: string; // Optional transaction hash
  txStatus?: 'pending' | 'success' | 'failed'; // Optional transaction status
}

export interface ActivityState {
  items: ActivityItem[];
}

const initialState: ActivityState = {
  items: [
    { id: '1', message: 'Please, sign the agreement for the loan application', timestamp: 'Nov 29, 20:48', actionType: 'sign' },
    { id: '2', message: 'Please, provide an additional information for the loan application', timestamp: 'Nov 29, 20:48', actionType: 'add-info' },
  ],
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    // New reducer to add a pending transaction notification
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
    // New reducer to update the status of a transaction notification
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
});

export const { addPendingTransaction, updateTransactionStatus, removeItem } = activitySlice.actions;

export default activitySlice.reducer;