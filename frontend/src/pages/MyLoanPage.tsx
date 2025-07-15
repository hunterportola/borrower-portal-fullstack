import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchLoan } from '../store/loanSlice'; // <-- 1. IMPORT THE THUNK
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { TransactionHistory } from '../components/TransactionHistory';
import { PaymentSchedule } from '../components/PaymentSchedule';
import { PaymentOptions } from '../components/PaymentOptions';
import { StablecoinPaymentModal } from '../components/StableCoinPaymentModal';
import { ACHPaymentModal } from '../components/ACHPaymentModal';
import { CardPaymentModal } from '../components/CardPaymentModal';

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <p className="font-sans text-steel">{label}</p>
      <p className="font-serif text-portola-green font-medium">{value}</p>
    </div>
  );
}

export function MyLoanPage() {
  const dispatch: AppDispatch = useDispatch(); // <-- 2. GET THE DISPATCH FUNCTION
  const loan = useSelector((state: RootState) => state.loan);
  const [isTxHistoryOpen, setIsTxHistoryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isPayDebtOpen, setIsPayDebtOpen] = useState(false);
  const [isStablecoinModalOpen, setIsStablecoinModalOpen] = useState(false);
  const [isACHModalOpen, setIsACHModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // --- 3. FETCH THE LOAN DATA ON COMPONENT LOAD ---
  useEffect(() => {
    if (loan.status === 'idle') {
        dispatch(fetchLoan());
    }
  }, [loan.status, dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleOpenStablecoinModal = () => {
    setIsPayDebtOpen(false);
    setIsStablecoinModalOpen(true);
  };
  
  const handleOpenACHModal = () => {
    setIsPayDebtOpen(false);
    setIsACHModalOpen(true);
  };

  const handleOpenCardModal = () => {
    setIsPayDebtOpen(false);
    setIsCardModalOpen(true);
  };

  if (loan.status === 'loading' || loan.status === 'idle') {
    return <div className="text-center p-24 font-serif text-steel">Loading Loan Details...</div>;
  }

  return (
    <div className="px-24 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4 pl-6">
          <h1 className="text-4xl font-serif text-portola-green">My loan</h1>
          <span className="inline-block bg-grass/20 text-grass text-sm font-medium px-3 py-1 rounded-full">
            Active
          </span>
        </div>
        <Card className="mb-6">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-sans text-steel">Next payment by Dec 15</p>
                    <p className="text-3xl font-serif text-portola-green mt-1">{formatCurrency(loan.nextPaymentAmount)}</p>
                </div>
                <Button variant="success" size="lg" onClick={() => setIsPayDebtOpen(true)}>
                    Pay off debt
                </Button>
            </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent className="p-6 grid grid-cols-3 divide-x divide-pebble">
            <div className="pr-6">
              <p className="font-sans text-steel mb-1">Original loan amount</p>
              <p className="text-2xl font-serif text-portola-green">{formatCurrency(loan.originalAmount)}</p>
            </div>
            <div className="px-6">
              <p className="font-sans text-steel mb-1">Outstanding balance</p>
              <p className="text-2xl font-serif text-portola-green">{formatCurrency(loan.outstandingBalance)}</p>
            </div>
            <div className="pl-6">
              <p className="font-sans text-steel mb-1">Loan term</p>
              <p className="text-2xl font-serif text-portola-green">{loan.loanTerm} months</p>
            </div>
          </CardContent>
          <div className="p-4 border-t border-sand flex items-center gap-4">
             <Button variant="ghost" onClick={() => setIsTxHistoryOpen(true)}>Transactions history</Button>
             <Button variant="ghost" onClick={() => setIsScheduleOpen(true)}>Payment schedule</Button>
          </div>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <DetailRow label="Original loan amount" value={formatCurrency(loan.originalAmount)} />
              <DetailRow label="Loan term" value={`${loan.loanTerm} months`} />
              <DetailRow label="Interest rate" value={`${loan.interestRate}%`} />
              <DetailRow label="Issue date" value={loan.issueDate} />
              <DetailRow label="Principal debt" value={formatCurrency(loan.principalDebt)} />
              <DetailRow label="Maturity date" value={loan.maturityDate} />
              <DetailRow label="Interest balance" value={formatCurrency(loan.interestBalance)} />
              <DetailRow label="End date" value={loan.endDate} />
              <DetailRow label="Overdue principal debt" value={formatCurrency(loan.overduePrincipalDebt)} />
              <DetailRow label="Outstanding LTV,%" value={loan.outstandingLTV} />
              <DetailRow label="Overdue interest" value={formatCurrency(loan.overdueInterest)} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal 
        isOpen={isTxHistoryOpen} 
        onClose={() => setIsTxHistoryOpen(false)} 
        title="Transactions History"
      >
        <TransactionHistory />
      </Modal>
      <Modal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        title="Payment Schedule"
      >
        <PaymentSchedule />
      </Modal>
      <Modal isOpen={isPayDebtOpen} onClose={() => setIsPayDebtOpen(false)} title="Choose Payment Method">
        <PaymentOptions 
            onSelectACH={handleOpenACHModal}
            onSelectCard={handleOpenCardModal}
            onSelectStablecoin={handleOpenStablecoinModal}
        />
      </Modal>
      <ACHPaymentModal
        isOpen={isACHModalOpen}
        onClose={() => setIsACHModalOpen(false)}
      />
      <StablecoinPaymentModal 
        isOpen={isStablecoinModalOpen}
        onClose={() => setIsStablecoinModalOpen(false)}
      />
      <CardPaymentModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </div>
  );
}