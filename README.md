# RWA Asset Tokenization Platform

A **Real World Asset (RWA) tokenization platform** built with Foundry and React, enabling compliant tokenization of real-world assets with identity verification and transfer restrictions.

## 🏗️ Architecture

This project consists of three main components working together to create a compliant RWA tokenization platform:

### Smart Contracts (`src/`)

#### `RWAAssetToken.sol` - Main Token Contract
- **Purpose**: ERC20 token with built-in compliance checks for RWA tokenization
- **Key Features**:
  - Role-based access control (Admin, Issuer, Agent)
  - Automatic compliance verification on every transfer
  - Token issuance and redemption capabilities
  - Integration with ComplianceModule for transfer restrictions

**Core Functions:**
- `issue(address to, uint256 amount)` - Mint new tokens (Issuer only)
- `redeem(address from, uint256 amount)` - Burn tokens (Issuer only)
- `setComplianceModule(address)` - Update compliance rules (Admin only)

#### `ComplianceModule.sol` - Transfer Compliance Engine
- **Purpose**: Enforces regulatory compliance rules for token transfers
- **Compliance Checks**:
  - Identity verification requirements
  - Country-based restrictions (allowlist/blocklist)
  - Accredited investor requirements
  - Automatic validation on minting and transfers

**Configuration:**
- `setTransferRestriction()` - Configure compliance rules
- `canTransfer(address from, address to)` - Check if transfer is compliant

#### `IdentityRegistry.sol` - KYC/Identity Management
- **Purpose**: Manages investor identity verification and KYC data
- **Identity Data**:
  - Verification status
  - Country code (ISO format)
  - Verification timestamp
  - Accredited investor status

**Functions:**
- `registerIdentity(address, string, bool)` - Add verified investor (Agent only)
- `revokeIdentity(address)` - Remove investor access (Agent only)
- `getIdentity(address)` - Retrieve investor details

### Frontend Dashboard (`frontend/`)

**Modern React Interface for RWA Token Management**

- **Technology Stack**: React 18 + Vite + Tailwind CSS + ethers.js
- **Wallet Integration**: Seamless MetaMask connection and network management
- **User Interfaces**:
  - **Investor Dashboard**: Token balance, transfer functionality, identity status
  - **Admin Panel**: Token issuance, identity registration, compliance management
- **Key Features**:
  - Real-time balance updates and transaction status
  - Role-based UI access (Admin, Issuer, Agent permissions)
  - Mobile-responsive design with modern UI components
  - Comprehensive error handling and user feedback
  - Network detection and automatic switching to Anvil local network

**Main Components:**
- `ConnectWallet.jsx` - MetaMask integration and wallet management
- `InvestorDashboard.jsx` - Main interface for token holders
- `AdminPanel.jsx` - Administrative controls for platform management
- Built with Create React App and ethers.js for blockchain integration

### Deployment & Testing
- Foundry-based smart contract development environment
- Automated deployment scripts and comprehensive test suites

## 📋 Deployed Contracts

### Local Development Network (Anvil - Chain ID: 31337)

| Contract | Address | Description |
|----------|---------|-------------|
| **IdentityRegistry** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | KYC/Identity management contract |
| **ComplianceModule** | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` | Transfer compliance validation engine |
| **RWAAssetToken** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | Main ERC20 token contract ("Real Estate Token" - RET) |

> **Note**: These addresses are for local development using Anvil. For testnet or mainnet deployments, addresses will be different.

### Contract Verification

You can verify the deployment by calling the contracts directly:

```bash
# Check token name and symbol
cast call 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 "name()" --rpc-url http://localhost:8545
cast call 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 "symbol()" --rpc-url http://localhost:8545

# Check if ComplianceModule is properly linked
cast call 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 "complianceModule()" --rpc-url http://localhost:8545

# Check IdentityRegistry address in ComplianceModule
cast call 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "identityRegistry()" --rpc-url http://localhost:8545
```

## 📋 Features

### 🔒 Compliance & Regulatory Features
- **Automated KYC/AML Checks**: Every transfer automatically verified against identity registry
- **Geographic Restrictions**: Support for country allowlists and blocklists
- **Accredited Investor Requirements**: Configurable accreditation requirements
- **Real-time Compliance Validation**: Pre-transfer compliance checks prevent non-compliant transactions

### 👥 Role-Based Access Control
- **Admin Role**: Full system control, can update compliance modules and grant roles
- **Issuer Role**: Can mint and burn tokens, manage token supply
- **Agent Role**: Can register/revoke investor identities and KYC status

### 🏢 Token Management
- **Controlled Issuance**: Only authorized issuers can mint new tokens
- **Redemption Capability**: Burn tokens from circulation when assets are redeemed
- **Transfer Restrictions**: All transfers subject to compliance validation
- **Event Logging**: Comprehensive event emission for auditing and tracking

### 🌐 Frontend Integration
- **Web3 Interface**: React-based dashboard for token management
- **Real-time Updates**: Live blockchain data integration via ethers.js
- **User-friendly UX**: Intuitive interface for both issuers and investors

## 🚀 Use Cases

### Real Estate Tokenization
- Tokenize commercial or residential properties
- Enable fractional ownership of high-value real estate
- Automated compliance for property investment regulations

### Private Securities
- Represent private company shares as compliant tokens
- Manage accredited investor requirements automatically
- Streamline private placement administration

### Commodities & Assets
- Tokenize physical commodities (gold, oil, etc.)
- Create digital representations of valuable assets
- Enable compliant trading of traditionally illiquid assets

## 🛠️ Built With

- **Foundry** - Smart contract development framework
- **OpenZeppelin** - Secure smart contract libraries
- **React** - Frontend user interface
- **ethers.js** - Ethereum blockchain interaction

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Technical_Task_023072025
```

2. **Install Foundry dependencies**
```bash
forge install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

## 🔧 Development

### Smart Contracts

#### Build contracts
```bash
forge build
```

#### Run tests
```bash
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testTokenIssuance
```

#### Deploy contracts locally
```bash
# Start local Anvil node
anvil

# Deploy contracts (in another terminal)
forge script script/deploy.s.sol --rpc-url http://localhost:8545 --private-key <your_private_key> --broadcast

# Verify deployment worked
cast call <TOKEN_ADDRESS> "name()" --rpc-url http://localhost:8545
```

#### Format code
```bash
forge fmt
```

#### Generate gas snapshots
```bash
forge snapshot
```

#### Advanced Testing
```bash
# Fork testing against mainnet
forge test --fork-url https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY

# Coverage reporting
forge coverage
```

### Frontend Dashboard

#### Start development server
```bash
cd frontend
npm run dev
# App will be available at http://localhost:3000
```

#### Quick Start Frontend
For the fastest setup, use the provided start script:
```bash
cd frontend
./start.sh  # Automated setup and start
```

#### MetaMask Configuration
1. **Add Anvil Network**:
   - Network Name: `Anvil Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account** (for testing):
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ```

#### Using the Dashboard

**For Investors:**
- Connect MetaMask wallet
- View token balance and transaction history
- Transfer tokens to other verified users
- Check identity verification status

**For Administrators:**
- Access admin panel at `/admin`
- Issue new RWA tokens to verified users
- Register and verify user identities
- Set compliance restrictions by country
- Manage platform permissions

#### Build for production
```bash
cd frontend
npm run build
# Build files will be in frontend/dist/
```

#### Environment Setup
Create `frontend/.env` with the deployed contract addresses:
```bash
# Local development with Anvil
REACT_APP_IDENTITY_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_COMPLIANCE_MODULE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
REACT_APP_RWA_TOKEN_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
REACT_APP_RPC_URL=http://localhost:8545
REACT_APP_CHAIN_ID=31337

# For testnet deployment, update with actual deployed addresses
# REACT_APP_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
# REACT_APP_CHAIN_ID=11155111
```

## 🔧 Configuration

### Compliance Rules Configuration

The `ComplianceModule` can be configured with various restriction rules:

```solidity
// Example: US-only, accredited investors required
string[] memory allowedCountries = ["US"];
string[] memory restrictedCountries = [];
compliance.setTransferRestriction(
    true,              // requireAccreditation
    allowedCountries,  // allowedCountries
    restrictedCountries // restrictedCountries
);
```

### Identity Registry Setup

Register investors through the `IdentityRegistry`:

```solidity
// Register a US accredited investor
registry.registerIdentity(
    investorAddress,
    "US",    // countryCode
    true     // isAccredited
);
```

### Role Management

Grant roles for system operation:

```solidity
// Grant issuer role
token.grantRole(token.ISSUER_ROLE(), issuerAddress);

// Grant agent role for KYC management
registry.grantRole(registry.AGENT_ROLE(), agentAddress);
```

## 📁 Project Structure

```
├── src/                      # Smart contracts source code
│   ├── RWAAssetToken.sol    # Main ERC20 token with compliance
│   ├── ComplianceModule.sol # Transfer compliance validation
│   └── IdentityRegistry.sol # KYC/identity management
├── script/
│   └── deploy.s.sol         # Foundry deployment script
├── test/
│   └── RWATest.t.sol        # Comprehensive contract tests
├── frontend/                # React dashboard application
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── index.js        # React entry point
│   │   └── setupProxy.js   # Development proxy config
│   ├── public/             # Static assets
│   ├── build/              # Production build output
│   └── package.json        # Frontend dependencies
├── lib/                     # Foundry dependencies
│   ├── forge-std/          # Foundry standard library
│   └── openzeppelin-contracts/  # OpenZeppelin contracts
├── broadcast/              # Deployment artifacts
├── cache/                  # Build cache
├── foundry.toml           # Foundry configuration
├── package.json           # Root package dependencies
└── README.md              # Project documentation
```

### Key Configuration Files

- **`foundry.toml`**: Foundry project configuration, compiler settings, and dependencies
- **`frontend/package.json`**: React app dependencies and build scripts
- **`script/deploy.s.sol`**: Automated deployment script for all contracts
- **`test/RWATest.t.sol`**: Comprehensive test suite covering all functionality

## 🔐 Security & Compliance

### Access Control Architecture
- **Hierarchical Roles**: Three-tier role system (Admin > Issuer/Agent > Users)
- **Role Separation**: Clear separation between token management and identity management
- **OpenZeppelin AccessControl**: Battle-tested role management implementation

### Compliance Framework
- **Pre-Transfer Validation**: All transfers validated before execution
- **Identity Verification**: Comprehensive KYC integration through IdentityRegistry
- **Geographic Controls**: Flexible country-based allow/deny lists
- **Accreditation Checks**: Configurable accredited investor requirements
- **Audit Trail**: Complete event logging for regulatory compliance

### Security Best Practices
- **Immutable References**: Critical contract addresses set as immutable
- **Input Validation**: Comprehensive validation of all external inputs
- **Reentrancy Protection**: Protected against common attack vectors
- **Role-based Authorization**: All administrative functions properly protected

### Regulatory Compliance Features
- **AML/KYC Integration**: Built-in identity verification requirements
- **Transfer Restrictions**: Configurable compliance rules for different jurisdictions
- **Audit Ready**: Comprehensive event emission for regulatory reporting
- **Upgradeable Compliance**: Compliance rules can be updated as regulations evolve

## 📊 Testing & Quality Assurance

### Comprehensive Test Suite
The project includes extensive testing covering:

```bash
# Run all tests
forge test

# Key test scenarios covered:
# - Token issuance to compliant investors
# - Transfer restrictions enforcement  
# - Identity registration and revocation
# - Role-based access control
# - Compliance rule updates
# - Edge cases and error conditions
```

### Test Coverage Areas
- **Identity Management**: Registration, verification, and revocation flows
- **Compliance Validation**: All compliance rule combinations
- **Token Operations**: Minting, burning, and transfer scenarios
- **Access Control**: Role assignment and permission verification
- **Edge Cases**: Invalid inputs, unauthorized access attempts

### Gas Optimization
- **Efficient Storage**: Optimized struct packing for gas efficiency
- **Minimal External Calls**: Reduced cross-contract calls where possible
- **Event Optimization**: Strategic event emission for monitoring without excessive gas usage

## 🚀 Deployment Guide

### Local Development Deployment

1. **Start Anvil (Local Node)**
```bash
anvil --host 0.0.0.0 --port 8545
```

2. **Deploy Contracts**
```bash
# Set environment variables
export ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Deploy all contracts
forge script script/deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

3. **Verify Deployment**
```bash
# Check token deployment
cast call <TOKEN_ADDRESS> "name()" --rpc-url http://localhost:8545

# Check compliance module
cast call <COMPLIANCE_ADDRESS> "identityRegistry()" --rpc-url http://localhost:8545
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
forge script script/deploy.s.sol \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Production Considerations

- **Multi-signature Wallets**: Use multi-sig for admin roles in production
- **Timelock Contracts**: Consider timelock for critical parameter changes
- **Emergency Pause**: Implement emergency pause mechanisms if required
- **Monitoring**: Set up monitoring for all critical events and transactions

## 📚 Documentation & Resources

### 📖 Comprehensive Guides

- **[Quick Start Guide](./QUICKSTART.md)** - Get running in under 5 minutes
- **[Architecture Documentation](./ARCHITECTURE.md)** - Deep dive into system design
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Frontend Documentation](./frontend/README.md)** - React dashboard user guide

### Smart Contract Documentation

#### RWAAssetToken Interface
```solidity
// Core token functions
function issue(address to, uint256 amount) external;
function redeem(address from, uint256 amount) external;
function setComplianceModule(address _complianceModule) external;

// Inherited from ERC20
function transfer(address to, uint256 amount) external returns (bool);
function balanceOf(address account) external view returns (uint256);
function totalSupply() external view returns (uint256);
```

#### ComplianceModule Interface
```solidity
// Compliance configuration
function setTransferRestriction(
    bool _requireAccreditation,
    string[] memory _allowedCountries,
    string[] memory _restrictedCountries
) external;

// Transfer validation
function canTransfer(address from, address to) external view returns (bool);
```

#### IdentityRegistry Interface  
```solidity
// Identity management
function registerIdentity(address investor, string memory countryCode, bool isAccredited) external;
function revokeIdentity(address investor) external;
function getIdentity(address investor) external view returns (Identity memory);
function isVerified(address investor) external view returns (bool);
```

### Integration Examples

#### Basic Token Issuance Flow
```javascript
// Contract addresses (local development)
const IDENTITY_REGISTRY = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const COMPLIANCE_MODULE = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RWA_TOKEN = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Initialize contracts
const identityRegistry = new ethers.Contract(IDENTITY_REGISTRY, identityRegistryABI, signer);
const rwaToken = new ethers.Contract(RWA_TOKEN, rwaTokenABI, signer);

// 1. Register investor identity
await identityRegistry.registerIdentity(
    investorAddress, 
    "US", 
    true // isAccredited
);

// 2. Issue tokens to compliant investor
await rwaToken.issue(investorAddress, ethers.parseEther("1000"));

// 3. Investor can now transfer tokens to other compliant addresses
await rwaToken.transfer(otherInvestorAddress, ethers.parseEther("100"));
```

#### Compliance Rule Configuration
```javascript
// Initialize ComplianceModule
const complianceModule = new ethers.Contract(COMPLIANCE_MODULE, complianceModuleABI, signer);

// Configure for US-only accredited investors
const allowedCountries = ["US"];
const restrictedCountries = [];
const requireAccreditation = true;

await complianceModule.setTransferRestriction(
    requireAccreditation,
    allowedCountries,
    restrictedCountries
);
```

#### Quick Contract Interaction Examples
```bash
# Using the deployed addresses with cast
export IDENTITY_REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3
export COMPLIANCE_MODULE=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
export RWA_TOKEN=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
export RPC_URL=http://localhost:8545

# Check token details
cast call $RWA_TOKEN "name()" --rpc-url $RPC_URL
cast call $RWA_TOKEN "symbol()" --rpc-url $RPC_URL
cast call $RWA_TOKEN "totalSupply()" --rpc-url $RPC_URL

# Check if an address is verified
cast call $IDENTITY_REGISTRY "isVerified(address)" 0xYourAddress --rpc-url $RPC_URL

# Check if a transfer would be compliant
cast call $COMPLIANCE_MODULE "canTransfer(address,address)" 0xFromAddress 0xToAddress --rpc-url $RPC_URL
```

### External Resources

#### Foundry Documentation
- [Foundry Book](https://book.getfoundry.sh/) - Complete Foundry documentation
- [Forge Commands](https://book.getfoundry.sh/forge/) - Command reference
- [Testing Guide](https://book.getfoundry.sh/forge/tests) - Writing and running tests

#### OpenZeppelin Resources
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - Security-focused contract library
- [Access Control](https://docs.openzeppelin.com/contracts/access-control) - Role-based access patterns
- [ERC20 Guide](https://docs.openzeppelin.com/contracts/erc20) - Token standard implementation

#### Regulatory & Compliance
- [Security Token Standards](https://github.com/ethereum/EIPs/issues/1411) - ERC-1411 specification
- [Digital Securities](https://www.sec.gov/divisions/corpfin/guidance/digital-asset-securities-issuance-and-trading.htm) - SEC guidance
- [Compliance Requirements](https://www.investopedia.com/articles/markets/032615/guide-regulation-security-tokens.asp) - General compliance overview

## ❓ FAQ

### What types of assets can be tokenized?
This platform supports tokenization of various real-world assets including:
- Real estate properties (commercial, residential)
- Private company securities
- Commodities (gold, oil, agricultural products)
- Art and collectibles
- Debt instruments and loans

### How does compliance checking work?
The system performs automatic compliance checks on every token operation:
1. **Identity Verification**: Ensures all parties have verified KYC status
2. **Geographic Restrictions**: Validates country-based rules
3. **Accreditation Requirements**: Checks investor accreditation status
4. **Pre-transaction Validation**: Prevents non-compliant transfers

### Can compliance rules be updated?
Yes, compliance rules are configurable and can be updated by authorized administrators:
- Country allowlists and blocklists can be modified
- Accreditation requirements can be toggled
- New compliance checks can be added through contract upgrades

### Is the platform production-ready?
The smart contracts use battle-tested OpenZeppelin libraries and include comprehensive test coverage. However, for production deployment, consider:
- Professional security audit
- Multi-signature wallet setup for admin functions
- Comprehensive monitoring and alerting systems
- Legal review for regulatory compliance in target jurisdictions

### How do I integrate with existing KYC providers?
The IdentityRegistry is designed to work with external KYC providers:
1. Grant AGENT_ROLE to your KYC service
2. Implement integration to call `registerIdentity()` after successful verification
3. Use webhooks to update investor status in real-time

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
# ERC-3643-Invastment
