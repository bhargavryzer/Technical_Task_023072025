import React from 'react'
import { Wallet, LogOut, AlertTriangle } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'

const ConnectWallet = () => {
  const { account, isConnected, chainId, connectWallet, disconnectWallet, switchNetwork } = useWallet()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isCorrectNetwork = chainId === '31337'

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        {!isCorrectNetwork && (
          <button
            onClick={switchNetwork}
            className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors"
          >
            <AlertTriangle size={16} />
            <span>Switch Network</span>
          </button>
        )}
        
        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
          <Wallet size={16} />
          <span className="font-medium">{formatAddress(account)}</span>
        </div>
        
        <button
          onClick={disconnectWallet}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
    >
      <Wallet size={20} />
      <span>Connect Wallet</span>
    </button>
  )
}

export default ConnectWallet
