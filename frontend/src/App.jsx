import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ConnectWallet from './components/ConnectWallet'
import InvestorDashboard from './components/InvestorDashboard'
import AdminPanel from './components/AdminPanel'
import { useWallet, WalletProvider } from './hooks/useWallet'

function AppContent() {
  const { account, isConnected } = useWallet()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  RWA Tokenization Platform
                </h1>
              </div>
              <ConnectWallet />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                isConnected ? (
                  <InvestorDashboard account={account} />
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome to RWA Tokenization Platform
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Connect your wallet to access real-world asset tokenization
                    </p>
                    <ConnectWallet />
                  </div>
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                isConnected ? (
                  <AdminPanel account={account} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">
                      Please connect your wallet to access admin panel
                    </p>
                  </div>
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App
