# RWA Tokenization Platform - Frontend

A modern React-based dashboard for managing Real-World Asset (RWA) tokenization built with Vite, Tailwind CSS, and ethers.js.

## Features

### For Investors
- **Wallet Connection**: Connect MetaMask wallet to interact with the platform
- **Token Balance**: View your RWA token balance and holdings
- **Transfer Tokens**: Send tokens to other verified users
- **Identity Status**: Check your KYC/verification status
- **Real-time Updates**: Automatic refresh of balances and status

### For Administrators
- **Token Issuance**: Issue new RWA tokens to verified users
- **Token Redemption**: Redeem tokens from circulation
- **Identity Management**: Register and verify user identities
- **Compliance Controls**: Set transfer restrictions by country
- **Role-based Access**: Different permissions for Admin, Issuer, and Agent roles

## Technology Stack

- **React 18**: Modern functional components with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ethers.js v6**: Ethereum blockchain interaction
- **React Router**: Client-side routing
- **React Hot Toast**: User-friendly notifications
- **Lucide React**: Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MetaMask browser extension
- Local Anvil blockchain running on port 8545

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Setup

1. **Start Local Blockchain**:
   ```bash
   # In the root directory
   anvil
   ```

2. **Deploy Contracts**:
   ```bash
   # In the root directory
   forge script script/deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
   ```

3. **Configure MetaMask**:
   - Add Anvil network (Chain ID: 31337, RPC: http://127.0.0.1:8545)
   - Import test accounts from Anvil

## Usage Guide

### Connecting Your Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on Anvil network (Chain ID: 31337)
4. If not on correct network, click "Switch Network"

### Investor Dashboard

Once connected, you'll see:
- **Token Balance**: Your current RWA token holdings
- **Total Supply**: Total tokens in circulation
- **Identity Status**: Your verification status
- **Transfer Form**: Send tokens to other users

### Admin Panel

Access via `/admin` route if you have admin privileges:

#### Token Operations (Admin/Issuer)
- **Issue Tokens**: Create new tokens for verified users
- **Redeem Tokens**: Remove tokens from circulation

#### Identity Management (Admin/Agent)
- **Register Identity**: Add KYC data for users
- **Set Verification**: Mark users as verified

#### Compliance Management (Admin only)
- **Country Restrictions**: Block/allow transfers by country
- **Transfer Rules**: Set compliance policies

## Smart Contract Integration

The frontend interacts with three main contracts:

### RWAAssetToken
- **Address**: `0x5fbdb2315678afecb367f032d93f642f64180aa3`
- **Functions**: Transfer, issue, redeem tokens
- **Events**: Transfer, Issued, Redeemed

### IdentityRegistry
- **Address**: `0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0`
- **Functions**: Register and verify identities
- **Events**: IdentityRegistered

### ComplianceModule
- **Address**: `0xe7f1725e7734ce288f8367e1bb143e90bb3f0512`
- **Functions**: Check transfer compliance
- **Events**: TransferRestrictionSet

## Component Architecture

```
src/
├── components/
│   ├── ConnectWallet.jsx      # Wallet connection UI
│   ├── InvestorDashboard.jsx  # Main investor interface
│   └── AdminPanel.jsx         # Administrative controls
├── hooks/
│   └── useWallet.js          # Wallet state management
├── utils/
│   └── contracts.js          # Contract utilities and ABIs
├── App.jsx                   # Main application component
└── main.jsx                  # Application entry point
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Error Handling

The application includes comprehensive error handling:
- **Connection Errors**: MetaMask not installed or connection failed
- **Network Errors**: Wrong network or RPC issues
- **Transaction Errors**: Failed transactions with user-friendly messages
- **Permission Errors**: Insufficient roles or permissions

## Security Considerations

- **Role-based Access**: UI restricts functions based on user roles
- **Input Validation**: All forms validate user input
- **Transaction Confirmation**: Users must confirm all blockchain transactions
- **Error Boundaries**: Graceful handling of React component errors

## Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Ensure MetaMask is installed and unlocked
   - Check browser permissions

2. **Wrong network**
   - Click "Switch Network" button
   - Manually add Anvil network in MetaMask

3. **Transaction failures**
   - Check account has sufficient ETH for gas
   - Verify contract addresses are correct
   - Ensure user has required permissions

4. **Balance not updating**
   - Click refresh button
   - Check MetaMask account is correct

### Development Issues

1. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

2. **Tailwind CSS not working**
   - Verify postcss.config.js is correct
   - Check tailwind.config.js paths

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
