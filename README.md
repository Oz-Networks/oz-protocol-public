
# Collector Factory Contract

The `CollectorFactory` contract is designed to create and manage collectors, handle reputation requests, and store reputation scores. This README provides a detailed guide on deploying the contract using ethers.js and interacting with its functions using viem/wagmi from a React.js dApp.

## Table of Contents

- [Contract Overview](#contract-overview)
- [Contract Deployment](#contract-deployment)
- [Functions](#functions)
  - [createCollector](#createcollector)
  - [requestReputation](#requestreputation)
  - [storeReputationScore](#storereputationscore)
  - [listCollectorsByValidation](#listcollectorsbyvalidation)
  - [handleCollectorCreator](#handlecollectorcreator)
  - [handleReputationProvider](#handlereputationprovider)
  - [handleCollectorValidity](#handlecollectorvalidity)
  - [getReputationScore](#getreputationscore)
- [Events](#events)
- [Errors](#errors)


## Contract Overview

The `CollectorFactory` contract includes functionalities to create collectors, request and store reputation scores, and manage collector validity and reputation providers.

### Key Features

- **Create Collectors**: Allows whitelisted addresses to create new collector contracts.
- **Request Reputation**: Collectors can request reputation scores from approved reputation providers.
- **Store Reputation**: Reputation providers can store reputation scores for collectors.
- **Handle Collector Creator**: Owners can activate or deactivate who can create collectors.
- **Manage Validity**: Owners can activate or deactivate collectors.

### Smart Contract

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SubscriptionManager } from "./SubscriptionManager.sol";

contract CollectorFactory is Ownable {
    // ... Contract code here
}
```

## Contract Deployment

To deploy the `CollectorFactory` contract, use the following ethers.js script:

```javascript
const { ethers } = require("ethers");

async function deployCollectorFactory() {
  const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_PROVIDER_URL");
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

  const CollectorFactory = await ethers.getContractFactory("CollectorFactory", wallet);
  const collectorFactory = await CollectorFactory.deploy();

  await collectorFactory.deployed();

  console.log("CollectorFactory deployed to:", collectorFactory.address);
}

deployCollectorFactory().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Replace `YOUR_RPC_PROVIDER_URL` and `YOUR_PRIVATE_KEY` with your actual RPC provider URL and private key.

## Functions

### createCollector

Creates a new collector. The connected wallet must be whitelisted using [handleCollectorCreator](#handlecollectorcreator) function

**Parameters:**
- `IERC721 nft_`: The address of the NFT contract.
- `uint256 feePerDay_`: The fee per day for the subscription.
- `uint256 collectorFee_`: The fee for the collector.

**Returns:**
- `address`: The address of the newly created collector.

**Usage:**
```javascript
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

### requestReputation

Requests reputation for a data provider.

**Parameters:**
- `address collector`: The address of the collector.
- `address dataProvider`: The address of the data provider.

**Usage:**
```javascript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'requestReputation',
  args: [collectorAddress, dataProviderAddress],
});

write();
```

### storeReputationScore

Stores the reputation score provided by a reputation provider.

**Parameters:**
- `address collector`: The address of the collector.
- `address dataProvider`: The address of the data provider.
- `uint256 score`: The reputation score. Must be within [0, 100]

**Usage:**
```javascript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'storeReputationScore',
  args: [collectorAddress, dataProviderAddress, score],
});

write();
```

### listCollectorsByValidation

Lists collectors based on their validity status.

**Parameters:**
- `bool validation`: The validity status to filter collectors.

**Returns:**
- `CollectorInfo[]`: An array of `CollectorInfo` structs.

**Usage:**
```javascript
import { useContractRead } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { data, isLoading } = useContractRead({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'listCollectorsByValidation',
  args: [validationStatus],
});
```

### handleCollectorCreator

Adds or removes a collector creator.

**Parameters:**
- `address collector`: The address of the creator to be handled.
- `bool active`: The status of the creator (true for adding, false for removing).

**Usage:**
```javascript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'handleCollectorCreator',
  args: [collectorAddress, activeStatus],
});

write();
```

### handleReputationProvider

Adds or removes a reputation provider.

**Parameters:**
- `address reputationProvider`: The address of the reputation provider.
- `bool active`: The status of the reputation provider (true for adding, false for removing).

**Usage:**
```javascript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'handleReputationProvider',
  args: [reputationProviderAddress, activeStatus],
});

write();
```

### handleCollectorValidity

Activates or disables a collector.

**Parameters:**
- `address collector`: The address of the collector.
- `bool validity`: The status of the collector.

**Usage:**
```javascript
import { useContractWrite } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { write } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'handleCollectorValidity',
  args: [collectorAddress, validityStatus],
});

write();
```

### getReputationScore

Retrieves the reputation score for a specific collector and data provider.

**Parameters:**
- `address collector`: The address of the collector.
- `address dataProvider`: The address of the data provider.

**Returns:**
- `uint256`: The reputation score.

**Usage:**
```javascript
import { useContractRead } from 'wagmi';
import { abi } from './CollectorFactory.json';

const { data, isLoading } = useContractRead({
  address: 'CONTRACT_ADDRESS',
  abi,
  functionName: 'getReputationScore',
  args: [collectorAddress, dataProviderAddress],
});
```

## Events

- `CollectorCreated(address collector, address collectorOwner)`
- `ReputationRequestCreated(address collector, address dataProvider, uint256 timestamp)`
- `ReputationScoreProvided(address collector, address dataProvider, uint256 score)`
- `ReputationProviderChanged(address reputationProvider, bool active)`
- `CollectorCreatorChanged(address collector, bool active)`
- `CollectorValidityChanged(address collector, bool validity)`

## Errors

- `CollectorNotFound`
- `ReputationRequestAlreadyExist`
- `ReputationRequestNotFound`
- `InvalidProvider`
- `InvalidCollectorOwner`
- `InvalidCreator`
- `InvalidScore`

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
