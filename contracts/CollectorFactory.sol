// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SubscriptionManager } from "./SubscriptionManager.sol";

/// @title Collector Factory Contract
/// @notice This contract is used to create and manage collectors, handle reputation requests, and store reputation scores.
contract CollectorFactory is Ownable {
    /// ------- STRUCTS -------
    
    /// @notice Information about each collector
    struct CollectorInfo {
        /// @notice The address of the collector contract
        address collectorAddress;
        /// @notice The owner of the collector
        address collectorOwner;
        /// @notice The timestamp when the collector was created
        uint256 timestamp;
        /// @notice Indicates if the collector is valid
        bool validity;
    }

    /// ------- STORAGE -------

    /// @dev Mapping for admins who can provide reputation scores
    mapping(address => bool) public reputationProviders;

    /// @dev Array of collector addresses
    address[] public collectors;

    /// @dev Mapping from collector addresses to their respective CollectorInfo
    mapping(address => CollectorInfo) public collectorList;

    /// @dev Mapping for requests for the data providers from collectors
    mapping(address => mapping(address => bool)) public reputationRequest;

    /// @dev Mapping for storing reputation scores
    mapping(address => mapping(address => uint256)) public reputationScores;

    /// @dev Mapping for whitelist of the collector creators
    mapping(address => bool) public creatorList;

    /// ------------ EVENTS ------------

    /// @dev Event emitted when a new collector is created
    event CollectorCreated(address collector, address collectorOwner);

    /// @dev Event emitted when a new reputation request is created
    event ReputationRequestCreated(address collector, address dataProvider, uint256 timestamp);

    /// @dev Event emitted when reputation provider provides the score
    event ReputationScoreProvided(address collector, address dataProvider, uint256 score);

    /// @dev Event emitted when reputation provider added or removed
    event ReputationProviderChanged(address reputationProvider, bool active);

    /// @dev Event emitted when creator added or removed
    event CollectorCreatorChanged(address collector, bool active);

    /// @dev Event emitted when collector activated / disabled.
    event CollectorValidityChanged(address collector, bool validity);

    /// ------------ ERRORS ------------

    /// @notice Only collectors can request reputation
    error CollectorNotFound();

    /// @notice Reputation request is active
    error ReputationRequestAlreadyExist();

    /// @notice Reputation request does not exist
    error ReputationRequestNotFound();

    /// @notice Sender is not the reputation provider
    error InvalidProvider();

    /// @notice Only owner can ask the collector reputation
    error InvalidCollectorOwner();

    /// @notice Only whitelisted addresses can create collectors
    error InvalidCreator();

    /// @notice Score must be within [0, 100]
    error InvalidScore();

    /// ----------- MODIFIERS ----------

    modifier onlyCollectorCreator(address collector) {
        if (!creatorList[collector]) {
            revert InvalidCreator();
        }
        _;
    }

    /**
     * @notice Constructor initializes the contract owner.
     */
    constructor() Ownable(_msgSender()) {}

    /**
     * @notice Creates a new collector.
     * @param nft_ The address of the NFT contract.
     * @param feePerDay_ The fee per day for the subscription.
     * @param collectorFee_ The fee for the collector.
     * @return The address of the newly created collector.
     */
    function createCollector(
        IERC721 nft_,
        uint256 feePerDay_,
        uint256 collectorFee_
    ) external onlyCollectorCreator(msg.sender) returns (address) {
        address collector = address(new SubscriptionManager(msg.sender, nft_, feePerDay_, collectorFee_));
        collectors.push(collector);
        collectorList[collector] = CollectorInfo({
            collectorAddress: collector,
            collectorOwner: msg.sender,
            timestamp: block.timestamp,
            validity: true
        });

        emit CollectorCreated(collector, msg.sender);
        return collector;
    }

    /**
     * @notice Requests reputation for a data provider.
     * @param dataProvider The address of the data provider.
     */
    function requestReputation(address collector, address dataProvider) external {
        if (collectorList[collector].timestamp == 0) {
            revert CollectorNotFound();
        }
        if (collectorList[collector].collectorOwner != msg.sender) {
            revert InvalidCollectorOwner();
        }
        if (reputationRequest[collector][dataProvider]) {
            revert ReputationRequestAlreadyExist();
        }
        reputationRequest[collector][dataProvider] = true;

        emit ReputationRequestCreated(collector, dataProvider, block.timestamp);
    }

    /**
     * @notice Stores the reputation score provided by a reputation provider.
     * @param collector The address of the collector.
     * @param dataProvider The address of the data provider.
     * @param score The reputation score.
     */
    function storeReputationScore(address collector, address dataProvider, uint256 score) external {
        if (!reputationRequest[collector][dataProvider]) {
            revert ReputationRequestNotFound();
        }
        if (!reputationProviders[msg.sender]) {
            revert InvalidProvider();
        }
        if (score > 100) {
            revert InvalidScore();
        }

        reputationScores[collector][dataProvider] = score;
        reputationRequest[collector][dataProvider] = false;

        emit ReputationScoreProvided(collector, dataProvider, score);
    }

    /**
     * @notice Lists collectors based on their validity status.
     * @param validation The validity status to filter collectors.
     * @return An array of CollectorInfo structs.
     */
    function listCollectorsByValidation(bool validation) external view returns (CollectorInfo[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < collectors.length; i++) {
            if (collectorList[collectors[i]].validity == validation) {
                count++;
            }
        }

        CollectorInfo[] memory result = new CollectorInfo[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < collectors.length; i++) {
            if (collectorList[collectors[i]].validity == validation) {
                result[index] = collectorList[collectors[i]];
                index++;
            }
        }

        return result;
    }

    /**
     * @notice Adds or removes a collector creator.
     * @param collector The address of the creator to be handled.
     * @param active The status of the creator (true for adding, false for removing).
     */
    function handleCollectorCreator(address collector, bool active) external onlyOwner {
        creatorList[collector] = active;

        emit CollectorCreatorChanged(collector, active);
    }

    /**
     * @notice Adds or removes a reputation provider.
     * @param reputationProvider The address of the reputation provider.
     * @param active The status of the reputation provider (true for adding, false for removing).
     */
    function handleReputationProvider(address reputationProvider, bool active) external onlyOwner {
        reputationProviders[reputationProvider] = active;

        emit ReputationProviderChanged(reputationProvider, active);
    }

    /**
     * @notice Activate / Disable collector.
     * @param collector The address of the collector.
     * @param validity The status of the collector.
     */
    function handleCollectorValidity(address collector, bool validity) external onlyOwner {
        collectorList[collector].validity = validity;

        emit CollectorValidityChanged(collector, validity);
    }

    /**
     * @notice Retrieves the reputation score for a specific collector and data provider.
     * @param collector The address of the collector.
     * @param dataProvider The address of the data provider.
     * @return The reputation score.
     */
    function getReputationScore(address collector, address dataProvider) external view returns (uint256) {
        return reputationScores[collector][dataProvider];
    }
}
