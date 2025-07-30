# Quick Start Guide - RWA Tokenization Platform

Get up and running with the RWA Tokenization Platform in under 5 minutes!

## 🚀 One-Command Setup

```bash
# Clone, install, and start everything
git clone <repository-url> && cd Technical_Task_023072025 && forge install && cd frontend && npm install && cd .. && anvil &
```

## 📋 Prerequisites Checklist

- [ ] **Node.js 16+** installed ([Download](https://nodejs.org/))
- [ ] **MetaMask** browser extension ([Install](https://metamask.io/))
- [ ] **Git** installed ([Download](https://git-scm.com/))

## 🎯 3-Step Quick Start

### Step 1: Start Local Blockchain (Terminal 1)
```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Start Anvil
anvil
```
**✅ Success**: You should see "Listening on 127.0.0.1:8545"

### Step 2: Deploy Contracts (Terminal 2)
```bash
# Deploy smart contracts
forge script script/deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**✅ Success**: You should see deployment addresses for all three contracts

### Step 3: Start Frontend (Terminal 3)
```bash
# Navigate to frontend and start
cd frontend
npm install
npm run dev
```
**✅ Success**: Open `http://localhost:3000` in your browser

## 🔧 MetaMask Setup (2 minutes)

### Add Anvil Network
1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Fill in:
   - **Network Name**: `Anvil Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency**: `ETH`

### Import Test Account
1. MetaMask → Account menu → "Import Account"
2. Paste private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
3. This account has Admin privileges and 10,000 ETH

## 🎮 Try It Out!

### For Investors
1. **Connect Wallet**: Click "Connect Wallet" button
2. **View Dashboard**: See your token balance and identity status
3. **Transfer Tokens**: Send tokens to another address (requires identity verification)

### For Administrators
1. **Access Admin Panel**: Navigate to `/admin`
2. **Issue Tokens**: Create new RWA tokens for users
3. **Register Identity**: Add KYC data for users
4. **Set Restrictions**: Configure compliance rules

## 🔍 Test Scenarios

### Scenario 1: Token Issuance
```bash
# Admin issues 100 tokens to investor
1. Go to /admin
2. Enter recipient: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
3. Enter amount: 100
4. Click "Issue Tokens"
```

### Scenario 2: Identity Registration
```bash
# Register an investor identity
1. Go to /admin → Identity Management
2. Enter address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
3. Enter country: US
4. Check "Accredited Investor"
5. Click "Register Identity"
```

### Scenario 3: Transfer Tokens
```bash
# Transfer tokens between verified users
1. Switch to investor account in MetaMask
2. Go to main dashboard
3. Enter recipient and amount
4. Click "Transfer Tokens"
```

## 🚨 Troubleshooting

### ❌ "MetaMask not found"
**Solution**: Install MetaMask browser extension and refresh page

### ❌ "Network not supported"
**Solution**: Add Anvil network to MetaMask (see setup above)

### ❌ "Transaction failed"
**Solution**: Ensure account has ETH for gas fees

### ❌ "Connection refused"
**Solution**: Check Anvil is running on port 8545

### ❌ "Contracts not deployed"
**Solution**: Run deployment script again

## 📚 What's Included

### Smart Contracts
- **RWAAssetToken**: ERC20 token with compliance
- **ComplianceModule**: Transfer restrictions and rules
- **IdentityRegistry**: KYC and identity verification

### Frontend Features
- **Wallet Integration**: MetaMask connection
- **Investor Dashboard**: Token management interface
- **Admin Panel**: Administrative controls
- **Real-time Updates**: Automatic data refresh

## 🎯 Next Steps

### Explore Features
- [ ] Try token transfers between accounts
- [ ] Set up additional test accounts
- [ ] Experiment with compliance restrictions
- [ ] Test identity verification workflow

### Customize Platform
- [ ] Modify token name and symbol
- [ ] Add custom compliance rules
- [ ] Integrate with external APIs
- [ ] Deploy to testnet

### Learn More
- [ ] Read [Architecture Guide](./ARCHITECTURE.md)
- [ ] Review [Deployment Guide](./DEPLOYMENT.md)
- [ ] Explore smart contract code
- [ ] Check out frontend components

## 📞 Need Help?

### Common Commands
```bash
# Restart everything
pkill -f anvil && anvil &
forge script script/deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
cd frontend && npm run dev

# Check if services are running
curl http://127.0.0.1:8545 # Anvil
curl http://localhost:3000 # Frontend

# View contract addresses
cat broadcast/deploy.s.sol/31337/run-latest.json | jq '.transactions[].contractAddress'
```

### Test Account Addresses
```
Admin Account:
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Test User Account:
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### Contract Addresses (Local)
```
RWAAssetToken: 0x5fbdb2315678afecb367f032d93f642f64180aa3
ComplianceModule: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
IdentityRegistry: 0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
```

---

🎉 **Congratulations!** You now have a fully functional RWA tokenization platform running locally. Start exploring and building!
