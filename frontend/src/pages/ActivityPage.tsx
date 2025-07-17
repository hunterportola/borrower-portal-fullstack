import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchActivities } from '../store/activitySlice'; 
import type { ActivityItem } from '../store/activitySlice';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';

// Component to render transaction-specific activities
function TransactionActivity({ item }: { item: ActivityItem }) {
  const getStatusStyles = () => {
    switch(item.txStatus) {
      case 'success':
        return { icon: '✅', color: 'text-grass' };
      case 'failed':
        return { icon: '❌', color: 'text-alert' };
      case 'pending':
      default:
        return { icon: '⏳', color: 'text-steel' };
    }
  };

  const { icon, color } = getStatusStyles();

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-xl">{icon}</span>
        <div>
          <p className={`font-sans ${color}`}>{item.message}</p>
          <p className="text-xs font-sans text-steel mt-1">{new Date(item.timestamp).toLocaleString()}</p>
        </div>
      </div>
      {item.txHash && (
        <Button 
          variant="pebble-outline"
          size="sm"
          onClick={() => window.open(`https://etherscan.io/tx/${item.txHash}`, '_blank')}
        >
          View on Etherscan
        </Button>
      )}
    </div>
  );
}

export function ActivityPage() {
  const dispatch: AppDispatch = useDispatch();
  const { items: activities, status } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    // Fetch activities periodically to get updates
    const interval = setInterval(() => {
        dispatch(fetchActivities());
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  if (status === 'loading' && activities.length === 0) {
    return <div className="text-center p-24 font-serif text-steel">Loading Activities...</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-2">
        <h1 className="text-4xl font-serif text-portola-green mb-6">
          Activity
        </h1>
        
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-0">
                  {activity.actionType === 'transaction' ? (
                    <TransactionActivity item={activity} />
                  ) : (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {activity.actionType === 'payment_success' && <span className="text-xl">✅</span>}
                        <div>
                          <p className="font-sans text-charcoal">{activity.message}</p>
                          <p className="text-xs font-sans text-steel mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="font-sans text-steel text-center py-12">You have no pending activities.</p>
        )}
      </div>
    </div>
  );
}