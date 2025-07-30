import React, { useState, useEffect } from 'react'
import { Coins, TrendingUp, User, AlertCircle, RefreshCw } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { 
  CONTRACT_ADDRESSES, 
  RWA_TOKEN_ABI, 
  IDENTITY_REGISTRY_ABI,
  getContract,
  formatTokenAmount,
  parseTokenAmount
} from '../utils/contracts'
import toast from 'react-hot-toast'

const InvestorDashboard = ({ account }) => {
  const { signer, provider } = useWallet()
  const [tokenBalance, setTokenBalance] = useState('0')
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', totalSupply: '0' })
  const [identity, setIdentity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get token contract
      const tokenContract = getContract(
        CONTRACT_ADDRESSES.RWAAssetToken,
        RWA_TOKEN_ABI,
        provider
      )

      // Get identity contract
      const identityContract = getContract(
        CONTRACT_ADDRESSES.IdentityRegistry,
        IDENTITY_REGISTRY_ABI,
        provider
      )

      // Load token info
      const [name, symbol, totalSupply, balance] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.balanceOf(account)
      ])

      setTokenInfo({
        name,
        symbol,
        totalSupply: formatTokenAmount(totalSupply)
      })
      setTokenBalance(formatTokenAmount(balance))

      // Load identity info
      try {
        const identityData = await identityContract.getIdentity(account)
        setIdentity({
          country: identityData[0],
          isAccredited: identityData[1],
          isVerified: identityData[2],
          verificationDate: identityData[3]
        })
      } catch (error) {
        // Identity not registered
        setIdentity(null)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (e) => {
    e.preventDefault()
    if (!transferAmount || !transferTo) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsTransferring(true)
      
      const tokenContract = getContract(
        CONTRACT_ADDRESSES.RWAAssetToken,
        RWA_TOKEN_ABI,
        signer
      )

      const amount = parseTokenAmount(transferAmount)
      const tx = await tokenContract.transfer(transferTo, amount)
      
      toast.loading('Transaction pending...', { id: 'transfer' })
      await tx.wait()
      
      toast.success('Transfer successful!', { id: 'transfer' })
      setTransferAmount('')
      setTransferTo('')
      loadDashboardData() // Refresh balance
      
    } catch (error) {
      console.error('Transfer error:', error)
      toast.error('Transfer failed: ' + (error.reason || error.message), { id: 'transfer' })
    } finally {
      setIsTransferring(false)
    }
  }

  useEffect(() => {
    if (account && provider) {
      loadDashboardData()
    }
  }, [account, provider])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Investor Dashboard</h2>
        <button
          onClick={loadDashboardData}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Balance</p>
              <p className="text-2xl font-bold text-gray-900">{tokenBalance}</p>
              <p className="text-sm text-gray-500">{tokenInfo.symbol}</p>
            </div>
            <Coins className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Supply</p>
              <p className="text-2xl font-bold text-gray-900">{tokenInfo.totalSupply}</p>
              <p className="text-sm text-gray-500">{tokenInfo.symbol}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Token Name</p>
              <p className="text-2xl font-bold text-gray-900">{tokenInfo.name}</p>
              <p className="text-sm text-gray-500">RWA Token</p>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Identity Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Identity Status</h3>
        {identity ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Country:</span>
              <span className="text-sm text-gray-900">{identity.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Accredited:</span>
              <span className={`text-sm ${identity.isAccredited ? 'text-green-600' : 'text-red-600'}`}>
                {identity.isAccredited ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Verified:</span>
              <span className={`text-sm ${identity.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {identity.isVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle size={20} />
            <span>Identity not registered. Contact an agent to register your identity.</span>
          </div>
        )}
      </div>

      {/* Transfer Tokens */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Tokens</h3>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label htmlFor="transferTo" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              id="transferTo"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="transferAmount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={isTransferring || !identity?.isVerified}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
          </button>
          
          {!identity?.isVerified && (
            <p className="text-sm text-yellow-600 text-center">
              You must have a verified identity to transfer tokens
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default InvestorDashboard
