
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import { UserState, AppTab, WalletNetwork } from './types';

const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    walletAddress: null,
    network: null,
    balance: 0,
    vipLevel: 0
  });

  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.HOME);

  const handleLogin = (walletAddress: string, network: WalletNetwork) => {
    setUser({
      isLoggedIn: true,
      walletAddress: walletAddress,
      network: network,
      balance: 0.00, // Initial balance
      vipLevel: 1
    });
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      walletAddress: null,
      network: null,
      balance: 0,
      vipLevel: 0
    });
    setCurrentTab(AppTab.HOME);
  };

  const updateBalance = (amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  const refreshBalance = async () => {
    // Simulate backend balance check delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real application, this would fetch the latest balance from the server
    // setUser(prev => ({ ...prev, balance: fetchedBalance }));
  };

  const handleWithdraw = (amount: number, address: string) => {
      // Logic handled in Lobby visual feedback, here we just update state
      // In a real app, this would call a backend
  };

  return (
    <HashRouter>
       <Routes>
         <Route path="/" element={
           !user.isLoggedIn ? (
             <Login onLogin={handleLogin} />
           ) : (
             <Navigate to="/lobby" replace />
           )
         } />
         
         <Route path="/lobby" element={
            user.isLoggedIn ? (
                <Lobby 
                  user={user} 
                  currentTab={currentTab} 
                  setTab={setCurrentTab}
                  updateBalance={updateBalance}
                  withdraw={handleWithdraw}
                  refreshBalance={refreshBalance}
                  onLogout={handleLogout}
                />
            ) : (
                <Navigate to="/" replace />
            )
         } />
       </Routes>
    </HashRouter>
  );
};

export default App;
