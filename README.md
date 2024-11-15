# Collector Protocol

A decentralized protocol for managing data provider subscriptions with integrated reputation tracking and NFT-based access control.

## Overview

The Collector Protocol consists of three main contracts:
- `CollectorRegistry`: Single source of truth for the current factory implementation
- `CollectorFactory`: Creates and manages Collector and SubscriptionManager pairs
- `SubscriptionManager`: Handles subscription logic and payment distribution

### Key Features

- **Create Collectors**: Allows whitelisted addresses to create new collector contracts
- **Request Reputation**: Collectors can request reputation scores from approved reputation providers
- **Store Reputation**: Reputation providers can store reputation scores for collectors
- **Handle Collector Creator**: Owners can activate or deactivate who can create collectors
- **Manage Validity**: Owners can activate or deactivate collectors
- **NFT-Based Access**: Uses NFTs for data provider access control

## Installation & Setup

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
COLLECTOR_NAME="Your Collector Name"
COLLECTOR_SYMBOL="SYMB"
TOKEN_URI="your_token_uri_here"
FEE_PER_DAY=1
COLLECTOR_FEE=0.2
```

## Deployment Flow

### 1. Initial Setup

```bash
# First deploy the Registry (only needed once per network)
npm run deploy:registry

# Deploy the Factory and register it with the Registry
npm run deploy:factory

# Verify deployment
npm run factory:status
```

### 2. Creating New Collectors

```bash
# Deploy a new collector instance
npm run deploy:collector
```

## Management Scripts

### List & Monitor

```bash
# List all collectors
npm run list:collectors

# Check factory status and history
npm run factory:status
```

### Reputation Management

```bash
# Check reputation score
npm run reputation:check

# Add/Remove reputation providers
npm run reputation:add
npm run reputation:remove
```

### Creator Management

```bash
# Add/Remove collector creators
npm run creator:add
npm run creator:remove
```

### Collector Management

```bash
# Set collector validity
npm run collector:validity
```

## Smart Contract Interaction

### Using ethers.js

To deploy the `CollectorFactory` contract:

```typescript
const { ethers } = require("ethers");

async function deployCollectorFactory() {
  const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_PROVIDER_URL");
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

  const CollectorFactory = await ethers.getContractFactory("CollectorFactory", wallet);
  const collectorFactory = await CollectorFactory.deploy();

  await collectorFactory.deployed();

  console.log("CollectorFactory deployed to:", collectorFactory.address);
}
```

### Using viem/wagmi in React

Example of creating a collector:

```typescript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'createCollector',
  args: [nftAddress, feePerDay, collectorFee],
});

write();
```

See [Contract Functions](#contract-functions) for more interaction examples.

## Contract Functions

Detailed documentation of contract functions and their usage is available in the [Contract Functions Documentation](./CONTRACT_FUNCTIONS.md).

## Architecture

### Registry Pattern

The protocol uses a registry pattern to maintain upgradeability:
1. Registry maintains the current factory address
2. New factory versions can be deployed without breaking existing collectors
3. Full history of factory deployments is maintained on-chain

### Collector Creation Flow

```
CollectorRegistry
└─ Points to current CollectorFactory
   └─ Creates new collector instances:
      ├─ Deploys Collector (NFT)
      └─ Deploys SubscriptionManager
```

## Version Management

Update contract versions in versions.json:

```bash
CONTRACT=SubscriptionManager VERSION=1.0.1 npm run version:update
```

## Deployment History

All deployments are tracked in `deployments.json` with the following information:
- Contract addresses
- Versions
- Deployment timestamps
- Parameters used
- Network information

## Testing

```bash
npm test
```

## Network Support

Currently supports:
- Oz Protocol Testnet

## Security Considerations

- NFT-based access control for data providers
- Reputation system for quality assurance
- Whitelisted collector creators
- Valid collector registry

## License

Copyright 2024 Oz Networks Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
