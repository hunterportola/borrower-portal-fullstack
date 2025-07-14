import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MyLoanPage } from './pages/MyLoanPage';
import { BorrowerProfilePage } from './pages/BorrowerProfilePage';
import { ActivityPage } from './pages/ActivityPage';

function App() {
  // We no longer need to dispatch actions here
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MyLoanPage />} />
            <Route path="/profile" element={<BorrowerProfilePage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;