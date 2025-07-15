import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchUser } from '../store/userSlice'; // <-- 1. IMPORT THE THUNK
import { PersonalInfoSection } from '../components/PersonalInfoSection';
import { BankDetailsSection } from '../components/BankDetailsSection';
import { EmploymentInfoSection } from '../components/EmploymentInfoSection';
import { IdDocumentSection } from '../components/IdDocumentSection';
import { WalletDetailsSection } from '../components/WalletDetailsSection';
import { CardDetailsSection } from '../components/CardDetailsSection';

type ProfileTab = 'personal-info' | 'bank-details' | 'wallet-details' | 'card-details' | 'employment-info' | 'id-document';

function ProfileNavLink({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${ isActive ? 'bg-pebble text-portola-green' : 'text-steel hover:bg-sand hover:text-portola-green' }`}>{label}</button>
  );
}

export function BorrowerProfilePage() {
    const dispatch: AppDispatch = useDispatch(); // <-- 2. GET THE DISPATCH FUNCTION
    const user = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<ProfileTab>('personal-info');
    
    // --- 3. FETCH THE USER DATA ON COMPONENT LOAD ---
    useEffect(() => {
        if (user.status === 'idle') {
            dispatch(fetchUser());
        }
    }, [user.status, dispatch]);


    if (user.status === 'loading' || user.status === 'idle') {
      return <div className="text-center p-24 font-serif text-steel">Loading Profile...</div>;
    }
  
    const navigate = (tab: ProfileTab) => {
      setActiveTab(tab);
    };
  
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-2">
          <h1 className="text-4xl font-serif text-portola-green mb-6">{user.firstName} {user.lastName}</h1>
          <div className="grid grid-cols-4 gap-8 items-start">
            <div className="col-span-1 space-y-1">
               <ProfileNavLink label="Personal info" isActive={activeTab === 'personal-info'} onClick={() => navigate('personal-info')} />
               <ProfileNavLink label="Bank details" isActive={activeTab === 'bank-details'} onClick={() => navigate('bank-details')} />
               <ProfileNavLink label="Wallet details" isActive={activeTab === 'wallet-details'} onClick={() => navigate('wallet-details')} />
               <ProfileNavLink label="Card details" isActive={activeTab === 'card-details'} onClick={() => navigate('card-details')} />
               <ProfileNavLink label="Employment info" isActive={activeTab === 'employment-info'} onClick={() => navigate('employment-info')} />
               <ProfileNavLink label="ID document" isActive={activeTab === 'id-document'} onClick={() => navigate('id-document')} />
            </div>
            <div className="col-span-3">
              {activeTab === 'personal-info' && <PersonalInfoSection user={user} errors={{}} showErrors={false} />}
              {activeTab === 'bank-details' && <BankDetailsSection />}
              {activeTab === 'wallet-details' && <WalletDetailsSection />}
              {activeTab === 'card-details' && <CardDetailsSection />}
              {activeTab === 'employment-info' && <EmploymentInfoSection user={user} />}
              {activeTab === 'id-document' && <IdDocumentSection user={user} />}
            </div>
          </div>
        </div>
      </div>
    );
}