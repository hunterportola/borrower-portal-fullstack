import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { removeItem } from '../store/activitySlice';
import type { ActivityItem } from '../store/activitySlice';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';

// New component to render transaction-specific activities
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
          <p className="text-xs font-sans text-steel mt-1">{item.timestamp}</p>
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
  const activities = useSelector((state: RootState) => state.activity.items);

  const handleActionClick = (id: string) => {
    console.log(`Performing action for activity: ${id}`);
    dispatch(removeItem(id));
  };

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
                      <div>
                        <p className="font-sans text-charcoal">{activity.message}</p>
                        <p className="text-xs font-sans text-steel mt-1">{activity.timestamp}</p>
                      </div>
                      <Button 
                        variant={activity.actionType === 'sign' ? 'primary' : 'secondary'}
                        onClick={() => handleActionClick(activity.id)}
                      >
                        {activity.actionType === 'sign' ? 'Sign' : 'Add info'}
                      </Button>
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