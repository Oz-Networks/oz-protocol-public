// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CollectorRegistry is Ownable {
    address public currentFactory;

    // Store history of factories
    struct FactoryInfo {
        address factoryAddress;
        uint256 timestamp;
        string version;
        bool active;
    }

    FactoryInfo[] public factoryHistory;

    event FactoryUpdated(address indexed oldFactory, address indexed newFactory, string version);

    constructor() Ownable(msg.sender) {}

    function updateFactory(address newFactory, string memory version) external onlyOwner {
        address oldFactory = currentFactory;
        currentFactory = newFactory;

        // Add to history
        factoryHistory.push(FactoryInfo({
            factoryAddress: newFactory,
            timestamp: block.timestamp,
            version: version,
            active: true
        }));

        // Mark old factory as inactive
        if (factoryHistory.length > 1) {
            factoryHistory[factoryHistory.length - 2].active = false;
        }

        emit FactoryUpdated(oldFactory, newFactory, version);
    }

    function getFactoryHistory() external view returns (FactoryInfo[] memory) {
        return factoryHistory;
    }
}
