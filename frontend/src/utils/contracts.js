import { ethers } from 'ethers'

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  RWAAssetToken: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  ComplianceModule: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  IdentityRegistry: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
}

// Contract ABIs (simplified for demo)
export const RWA_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function issue(address to, uint256 amount)",
  "function redeem(uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Issued(address indexed to, uint256 amount)",
  "event Redeemed(address indexed from, uint256 amount)"
]

export const COMPLIANCE_MODULE_ABI = [
  "function canTransfer(address from, address to, uint256 amount) view returns (bool)",
  "function setTransferRestriction(string memory country, bool allowed)",
  "function getTransferRestriction(string memory country) view returns (bool)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "event TransferRestrictionSet(string country, bool allowed)"
]

export const IDENTITY_REGISTRY_ABI = [
  "function registerIdentity(address user, string memory country, bool isAccredited)",
  "function getIdentity(address user) view returns (string memory country, bool isAccredited, bool isVerified, uint256 verificationDate)",
  "function isVerified(address user) view returns (bool)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "event IdentityRegistered(address indexed user, string country, bool isAccredited)"
]

// Role constants
export const ROLES = {
  ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  ISSUER_ROLE: ethers.keccak256(ethers.toUtf8Bytes('ISSUER_ROLE')),
  AGENT_ROLE: ethers.keccak256(ethers.toUtf8Bytes('AGENT_ROLE'))
}

// Get contract instance
export const getContract = (address, abi, signerOrProvider) => {
  return new ethers.Contract(address, abi, signerOrProvider)
}

// Format token amount (assumes 18 decimals)
export const formatTokenAmount = (amount, decimals = 18) => {
  return ethers.formatUnits(amount, decimals)
}

// Parse token amount (assumes 18 decimals)
export const parseTokenAmount = (amount, decimals = 18) => {
  return ethers.parseUnits(amount.toString(), decimals)
}

// Format address for display
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Check if address has role
export const hasRole = async (contract, role, address) => {
  try {
    return await contract.hasRole(role, address)
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}
