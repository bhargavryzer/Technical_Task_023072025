# Deployment Guide - RWA Tokenization Platform

This guide covers deploying the RWA Tokenization Platform in various environments.

## Prerequisites

### System Requirements
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Git**: For version control
- **MetaMask**: Browser extension for wallet integration

### Development Tools
- **Foundry**: Ethereum development framework
- **Anvil**: Local Ethereum node
- **VS Code**: Recommended IDE with Solidity extensions

## Local Development Deployment

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd Technical_Task_023072025

# Install Foundry dependencies
forge install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Start Local Blockchain

```bash
# Start Anvil local network
anvil

# Keep this terminal open - Anvil will run on port 8545
```

### 3. Deploy Smart Contracts

```bash
# In a new terminal, deploy contracts to local network
forge script script/deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# The private key above is the default Anvil account #0
```

### 4. Configure MetaMask

1. **Add Anvil Network**:
   - Network Name: `Anvil Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Accounts**:
   ```
   # Account #0 (Admin)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   
   # Account #1 (Test User)
   Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   ```

### 5. Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev

# Or use the convenience script
./start.sh
```

The application will be available at `http://localhost:3000`.

## Production Deployment

### Environment Setup

#### Ethereum Mainnet
```bash
# Set environment variables
export RPC_URL="https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
export PRIVATE_KEY="YOUR_DEPLOYER_PRIVATE_KEY"
export ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
```

#### Polygon Network
```bash
# Set environment variables for Polygon
export RPC_URL="https://polygon-rpc.com"
export PRIVATE_KEY="YOUR_DEPLOYER_PRIVATE_KEY"
export POLYGONSCAN_API_KEY="YOUR_POLYGONSCAN_API_KEY"
```

### Smart Contract Deployment

#### 1. Deploy to Mainnet

```bash
# Deploy to Ethereum mainnet
forge script script/deploy.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY

# For Polygon
forge script script/deploy.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --verifier-url https://api.polygonscan.com/api \
    --etherscan-api-key $POLYGONSCAN_API_KEY
```

#### 2. Update Contract Addresses

After deployment, update the contract addresses in:
- `frontend/src/utils/contracts.js`
- `README.md`

### Frontend Deployment

#### Build for Production

```bash
cd frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# The built files will be in the 'dist' directory
```

#### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Deploy to Netlify

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

#### Deploy to AWS S3 + CloudFront

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Invalidate CloudFront**:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## Docker Deployment

### Create Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    
  anvil:
    image: ghcr.io/foundry-rs/foundry:latest
    command: anvil --host 0.0.0.0
    ports:
      - "8545:8545"
```

### Run with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Environment Configuration

### Development Environment

Create `.env.local` in frontend directory:
```env
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_RWA_TOKEN=0x5fbdb2315678afecb367f032d93f642f64180aa3
VITE_CONTRACT_COMPLIANCE=0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
VITE_CONTRACT_IDENTITY=0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
```

### Production Environment

```env
VITE_CHAIN_ID=1
VITE_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_CONTRACT_RWA_TOKEN=YOUR_DEPLOYED_TOKEN_ADDRESS
VITE_CONTRACT_COMPLIANCE=YOUR_DEPLOYED_COMPLIANCE_ADDRESS
VITE_CONTRACT_IDENTITY=YOUR_DEPLOYED_IDENTITY_ADDRESS
```

## Monitoring and Maintenance

### Health Checks

Create monitoring endpoints:
```javascript
// health-check.js
export const healthCheck = async () => {
  try {
    // Check contract connectivity
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const blockNumber = await provider.getBlockNumber()
    
    return {
      status: 'healthy',
      blockNumber,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}
```

### Logging Setup

```javascript
// logger.js
export const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data)
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data)
  }
}
```

## Security Checklist

### Pre-deployment Security

- [ ] Smart contracts audited
- [ ] Private keys secured
- [ ] Environment variables properly set
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Error messages don't leak sensitive information

### Post-deployment Monitoring

- [ ] Set up transaction monitoring
- [ ] Configure alert systems
- [ ] Monitor gas usage patterns
- [ ] Track unusual activity
- [ ] Regular security scans
- [ ] Update dependencies regularly

## Troubleshooting

### Common Deployment Issues

1. **Contract Deployment Failures**
   ```bash
   # Check gas price and limit
   forge script script/deploy.s.sol --gas-estimate
   
   # Verify network connectivity
   curl -X POST -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     $RPC_URL
   ```

2. **Frontend Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node.js version
   node --version
   ```

3. **MetaMask Connection Issues**
   - Verify network configuration
   - Check contract addresses
   - Confirm account has ETH for gas

### Performance Optimization

1. **Smart Contract Optimization**
   ```bash
   # Optimize for gas usage
   forge build --optimize --optimizer-runs 200
   ```

2. **Frontend Optimization**
   ```bash
   # Analyze bundle size
   npm run build
   npx vite-bundle-analyzer dist
   ```

## Backup and Recovery

### Smart Contract Data
- Monitor all events and transactions
- Maintain off-chain backup of critical data
- Document all contract addresses and deployment details

### Frontend Assets
- Regular backups of source code
- Version control with Git
- Database backups if applicable

### Recovery Procedures
1. Identify the issue scope
2. Stop affected services
3. Restore from known good state
4. Verify system integrity
5. Resume operations with monitoring
