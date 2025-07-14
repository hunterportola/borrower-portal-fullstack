import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import type { AppDispatch } from '../store/store';
import { exchangePlaidTokenAndRefreshBankInfo } from '../store/userSlice';
import type { UserState } from '../store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

interface BankDetailsSectionProps {
  user: UserState;
}

export function BankDetailsSection({ user }: BankDetailsSectionProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/create_link_token');
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Failed to generate Plaid link token:", error);
      }
    };
    generateToken();
  }, []);
  
  const onSuccess = useCallback(async (public_token: string) => {
    dispatch(exchangePlaidTokenAndRefreshBankInfo(public_token));
  }, [dispatch]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {user.bankName ? (
              <div className="p-4 border border-pebble rounded-md bg-sand">
                  <p className="font-sans text-sm text-steel">Connected Account</p>
                  <p className="font-serif text-lg text-portola-green mt-1">{user.bankName}</p>
                  <p className="font-mono text-sm text-steel">
                    {user.accountHolderName} - *******{user.accountNumber?.slice(-4)}
                  </p>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-pebble rounded-md bg-sand text-center">
                   <p className="font-serif text-lg text-portola-green">Connect your Account</p>
                   <p className="font-sans text-sm text-steel mt-1">Click the button below to get started.</p>
              </div>
            )}

            <Button 
                variant="outline" 
                className="w-full"
                onClick={() => open()}
                disabled={!ready || !linkToken}
            >
                {user.bankName ? 'Connect a Different Account' : 'Connect Account with Plaid'}
            </Button>
            <p className="text-xs text-center text-steel">
                Securely connect your bank account using Plaid.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}