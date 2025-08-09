import { useState, useEffect, createContext, useContext } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState(null)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed!')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const network = await provider.getNetwork()

        setAccount(accounts[0])
        setProvider(provider)
        setSigner(signer)
        setIsConnected(true)
        setChainId(network.chainId.toString())

        toast.success('Wallet connected successfully!')
        
        // Check if we're on the correct network (Anvil local network)
        if (network.chainId !== 31337n) {
          toast.error('Please switch to Anvil local network (Chain ID: 31337)')
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    setChainId(null)
    toast.success('Wallet disconnected')
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      })
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x7A69',
              chainName: 'Anvil Local',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545'],
              blockExplorerUrls: null
            }]
          })
        } catch (addError) {
          toast.error('Failed to add Anvil network')
        }
      } else {
        toast.error('Failed to switch network')
      }
    }
  }

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16).toString())
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [])

  const value = {
    account,
    provider,
    signer,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet,
    switchNetwork
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
