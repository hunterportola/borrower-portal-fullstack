import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import type { AppDispatch, RootState } from '../store/store';
import { setConnecting, setConnected, setDisconnected, setError, setUsdcBalance, setNativeBalance } from '../store/walletSlice';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

interface WalletDetailsSectionProps {
  isActive: boolean;
}

export function WalletDetailsSection({ isActive }: WalletDetailsSectionProps) {
  const dispatch: AppDispatch = useDispatch();
  const { address, status, networkName, nativeBalance, usdcBalance } = useSelector((state: RootState) => state.wallet);

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      dispatch(setError("No wallet found. Please install a browser wallet."));
      return;
    }
    try {
      dispatch(setConnecting());
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();

      const payload = {
        address: userAddress,
        networkName: network.name,
        chainId: network.chainId.toString(),
      };
      
      dispatch(setConnected(payload));
      localStorage.setItem('walletAddress', payload.address);
      localStorage.setItem('walletNetworkName', payload.networkName);
      localStorage.setItem('walletChainId', payload.chainId);

    } catch (err: any) {
      dispatch(setError(err.message || "An unexpected error occurred."));
    }
  };

  const handleDisconnect = () => {
    dispatch(setDisconnected());
  };

  useEffect(() => {
    if (isActive && status === 'connected' && address) {
      const fetchBalances = async () => {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const nativeBal = await provider.getBalance(address);
          dispatch(setNativeBalance(formatUnits(nativeBal, 18)));

          const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, provider);
          const usdcBal = await usdcContract.balanceOf(address);
          const decimals = await usdcContract.decimals();
          dispatch(setUsdcBalance(formatUnits(usdcBal, decimals)));
        } catch (err) {
          console.error("Failed to fetch balances:", err);
          dispatch(setUsdcBalance("Error"));
          dispatch(setNativeBalance("Error"));
        }
      };
      fetchBalances();
    }
  }, [isActive, status, address, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'connected' ? (
          <>
            <div className="p-4 border border-pebble rounded-md bg-sand">
              <div className="space-y-2 text-left">
                <p className="font-mono text-xs text-portola-green break-all leading-snug">
                  <strong className="font-sans text-steel text-sm block">Address:</strong> {address}
                </p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug">
                  <strong className="font-sans text-steel text-sm block">Network:</strong> {networkName}
                </p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug">
                  <strong className="font-sans text-steel text-sm block">ETH Balance:</strong> {nativeBalance ?? 'Loading...'}
                </p>
                <p className="font-mono text-xs text-portola-green break-all leading-snug">
                  <strong className="font-sans text-steel text-sm block">USDC Balance:</strong> {usdcBalance ?? 'Loading...'}
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm" className="w-full" onClick={handleDisconnect}>Disconnect Wallet</Button>
          </>
        ) : (
          <div className="p-4 border-2 border-dashed border-pebble rounded-md bg-sand text-center">
            <p className="font-serif text-lg text-portola-green">No Wallet Connected</p>
            <p className="font-sans text-sm text-steel mt-1">Click the button below to get started.</p>
          </div>
        )}

        {status !== 'connected' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleConnectWallet}
            disabled={status === 'connecting'}
          >
            {status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}