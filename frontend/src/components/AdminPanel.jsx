import React, { useState, useEffect } from 'react'
import { Shield, Users, Settings, Plus, Minus, Globe, RefreshCw } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { 
  CONTRACT_ADDRESSES, 
  RWA_TOKEN_ABI, 
  IDENTITY_REGISTRY_ABI,
  COMPLIANCE_MODULE_ABI,
  ROLES,
  getContract,
  formatTokenAmount,
  parseTokenAmount,
  hasRole
} from '../utils/contracts'
import toast from 'react-hot-toast'

const AdminPanel = ({ account }) => {
  const { signer, provider } = useWallet()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAgent, setIsAgent] = useState(false)
  const [isIssuer, setIsIssuer] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Token operations
  const [issueAmount, setIssueAmount] = useState('')
  const [issueTo, setIssueTo] = useState('')
  const [redeemAmount, setRedeemAmount] = useState('')
  
  // Identity operations
  const [identityAddress, setIdentityAddress] = useState('')
  const [identityCountry, setIdentityCountry] = useState('')
  const [isAccredited, setIsAccredited] = useState(false)
  
  // Compliance operations
  const [restrictionCountry, setRestrictionCountry] = useState('')
  const [restrictionAllowed, setRestrictionAllowed] = useState(true)

  const checkUserRoles = async () => {
    try {
      setLoading(true)
      
      const tokenContract = getContract(
        CONTRACT_ADDRESSES.RWAAssetToken,
        RWA_TOKEN_ABI,
        provider
      )
      
      const identityContract = getContract(
        CONTRACT_ADDRESSES.IdentityRegistry,
        IDENTITY_REGISTRY_ABI,
        provider
      )
      
      const complianceContract = getContract(
        CONTRACT_ADDRESSES.ComplianceModule,
        COMPLIANCE_MODULE_ABI,
        provider
      )

      const [adminRole, issuerRole, agentRole] = await Promise.all([
        hasRole(tokenContract, ROLES.ADMIN_ROLE, account),
        hasRole(tokenContract, ROLES.ISSUER_ROLE, account),
        hasRole(identityContract, ROLES.AGENT_ROLE, account)
      ])

      setIsAdmin(adminRole)
      setIsIssuer(issuerRole)
      setIsAgent(agentRole)
      
    } catch (error) {
      console.error('Error checking roles:', error)
      toast.error('Failed to check user roles')
    } finally {
      setLoading(false)
    }
  }

  const handleIssueTokens = async (e) => {
    e.preventDefault()
    if (!issueAmount || !issueTo) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const tokenContract = getContract(
        CONTRACT_ADDRESSES.RWAAssetToken,
        RWA_TOKEN_ABI,
        signer
      )

      const amount = parseTokenAmount(issueAmount)
      const tx = await tokenContract.issue(issueTo, amount)
      
      toast.loading('Issuing tokens...', { id: 'issue' })
      await tx.wait()
      
      toast.success('Tokens issued successfully!', { id: 'issue' })
      setIssueAmount('')
      setIssueTo('')
      
    } catch (error) {
      console.error('Issue error:', error)
      toast.error('Failed to issue tokens: ' + (error.reason || error.message), { id: 'issue' })
    }
  }

  const handleRedeemTokens = async (e) => {
    e.preventDefault()
    if (!redeemAmount) {
      toast.error('Please enter redeem amount')
      return
    }

    try {
      const tokenContract = getContract(
        CONTRACT_ADDRESSES.RWAAssetToken,
        RWA_TOKEN_ABI,
        signer
      )

      const amount = parseTokenAmount(redeemAmount)
      const tx = await tokenContract.redeem(amount)
      
      toast.loading('Redeeming tokens...', { id: 'redeem' })
      await tx.wait()
      
      toast.success('Tokens redeemed successfully!', { id: 'redeem' })
      setRedeemAmount('')
      
    } catch (error) {
      console.error('Redeem error:', error)
      toast.error('Failed to redeem tokens: ' + (error.reason || error.message), { id: 'redeem' })
    }
  }

  const handleRegisterIdentity = async (e) => {
    e.preventDefault()
    if (!identityAddress || !identityCountry) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const identityContract = getContract(
        CONTRACT_ADDRESSES.IdentityRegistry,
        IDENTITY_REGISTRY_ABI,
        signer
      )

      const tx = await identityContract.registerIdentity(
        identityAddress,
        identityCountry,
        isAccredited
      )
      
      toast.loading('Registering identity...', { id: 'identity' })
      await tx.wait()
      
      toast.success('Identity registered successfully!', { id: 'identity' })
      setIdentityAddress('')
      setIdentityCountry('')
      setIsAccredited(false)
      
    } catch (error) {
      console.error('Identity registration error:', error)
      toast.error('Failed to register identity: ' + (error.reason || error.message), { id: 'identity' })
    }
  }

  const handleSetRestriction = async (e) => {
    e.preventDefault()
    if (!restrictionCountry) {
      toast.error('Please enter country code')
      return
    }

    try {
      const complianceContract = getContract(
        CONTRACT_ADDRESSES.ComplianceModule,
        COMPLIANCE_MODULE_ABI,
        signer
      )

      const tx = await complianceContract.setTransferRestriction(
        restrictionCountry,
        restrictionAllowed
      )
      
      toast.loading('Setting transfer restriction...', { id: 'restriction' })
      await tx.wait()
      
      toast.success('Transfer restriction updated!', { id: 'restriction' })
      setRestrictionCountry('')
      
    } catch (error) {
      console.error('Restriction error:', error)
      toast.error('Failed to set restriction: ' + (error.reason || error.message), { id: 'restriction' })
    }
  }

  useEffect(() => {
    if (account && provider) {
      checkUserRoles()
    }
  }, [account, provider])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!isAdmin && !isIssuer && !isAgent) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">
          You don't have the necessary permissions to access the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
        <button
          onClick={checkUserRoles}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Role Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Shield size={14} className="mr-1" />
              Admin
            </span>
          )}
          {isIssuer && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Plus size={14} className="mr-1" />
              Issuer
            </span>
          )}
          {isAgent && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Users size={14} className="mr-1" />
              Agent
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Operations */}
        {(isAdmin || isIssuer) && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="mr-2" size={20} />
              Token Operations
            </h3>
            
            {/* Issue Tokens */}
            <form onSubmit={handleIssueTokens} className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Issue Tokens</h4>
              <input
                type="text"
                value={issueTo}
                onChange={(e) => setIssueTo(e.target.value)}
                placeholder="Recipient address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={issueAmount}
                onChange={(e) => setIssueAmount(e.target.value)}
                placeholder="Amount"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Issue Tokens
              </button>
            </form>
            
            {/* Redeem Tokens */}
            <form onSubmit={handleRedeemTokens} className="space-y-4">
              <h4 className="font-medium text-gray-700">Redeem Tokens</h4>
              <input
                type="number"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                placeholder="Amount to redeem"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Redeem Tokens
              </button>
            </form>
          </div>
        )}

        {/* Identity Management */}
        {(isAdmin || isAgent) && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Identity Management
            </h3>
            
            <form onSubmit={handleRegisterIdentity} className="space-y-4">
              <input
                type="text"
                value={identityAddress}
                onChange={(e) => setIdentityAddress(e.target.value)}
                placeholder="User address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={identityCountry}
                onChange={(e) => setIdentityCountry(e.target.value)}
                placeholder="Country code (e.g., US, UK, DE)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="accredited"
                  checked={isAccredited}
                  onChange={(e) => setIsAccredited(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="accredited" className="text-sm text-gray-700">
                  Accredited Investor
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Register Identity
              </button>
            </form>
          </div>
        )}

        {/* Compliance Management */}
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="mr-2" size={20} />
              Compliance Management
            </h3>
            
            <form onSubmit={handleSetRestriction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={restrictionCountry}
                  onChange={(e) => setRestrictionCountry(e.target.value)}
                  placeholder="Country code (e.g., US, UK, DE)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={restrictionAllowed}
                  onChange={(e) => setRestrictionAllowed(e.target.value === 'true')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Allow Transfers</option>
                  <option value="false">Block Transfers</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Set Transfer Restriction
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
