// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/// @title Subscription manager contract
/// @notice Handles new subscription, cancel subscription and renew subscription
contract SubscriptionManager is Ownable, ReentrancyGuard {
    /// ------- CONSTANTS -------

    /// @notice Minimum subscription period => 1 days
    uint256 public constant MIN_SUBSCRIPTION_PERIOD = 1 days;

    /// @notice Stores last 10 data quality for each provider
    uint256 public constant MAX_RECORD = 10;

    /// ------- STRUCTS -------

    /// @notice Subscription struct
    /// @param endTime Subscription end time
    /// @param recipient Recipient data
    struct Subscription {
        uint256 endTime;
        string recipient;
    }

    /// @notice Subscriber struct
    /// @param subscriber The address of the subscriber
    struct Subscriber {
        address subscriber;
        string recipient;
    }

    /// @notice Quality info item
    /// @param subscriber The address of subscriber
    /// @param quality The quality of the data. Must be within [0, 100]
    struct QualityInfo {
        address subscriber;
        uint8 quality;
    }

    /// @notice Historical quality info for the data provider
    ///         Stores only last 10 items
    /// @param qualities The last 10 quality info
    /// @param currentIndex The current index in the array
    struct DataProviderQualityInfo {
        QualityInfo[MAX_RECORD] qualities;
        uint256 currentIndex;
    }

    /// ------- STORAGE -------

    /// @notice Collector NFT token
    IERC721 public immutable nft;

    /// @notice Subscription fee per day
    uint256 public feePerDay;

    /// @notice Collector fee
    uint256 public collectorFee;

    /// @notice Subscriber => Data Provider => Subscription Info
    mapping(address => mapping(address => Subscription)) public subscriptions;

    /// @notice Data Provider => Subscribers
    mapping(address => Subscriber[]) public subscribers;

    /// @notice Data Provider => Quality Info
    mapping(address => DataProviderQualityInfo) public dataProviderQualities;

    /// ------------ ERRORS ------------

    /// @notice Zero address argument provided
    error ZeroAddress();

    /// @notice Invalid data provider address
    error InvalidDataProvider();

    /// @notice Quality value is out of [0, 100] range
    error QualityOutOfRange();

    /// @notice User already subscribed
    error AlreadySubscribed();

    /// @notice Subscription period is too short
    error SubscriptionPeriodTooShort();

    /// @notice Less subscription fee sent
    error LessSubscriptionFeeSent();

    /// @notice User has not subscribed
    error SubscriptionNotFound();

    /// @notice Subscription is still active
    error ActiveSubscription();

    /// @notice Subscription is already ended
    error SubscriptionAlreadyEnded();

    /// ------------ EVENTS ------------

    /// @notice Emitted when feePerDay is updated
    /// @param newFeePerDay New feePerDay amount
    event FeePerDayUpdated(uint256 indexed newFeePerDay);

    /// @notice Emitted when collectorFee is updated
    /// @param newCollectorFee New collectorFee amount
    event CollectorFeeUpdated(uint256 indexed newCollectorFee);

    /// @notice Emitted when new subscription is created
    /// @param dataProvider Data provider address
    /// @param subscriber Subscriber address
    /// @param recipient Recipient data
    /// @param endTime Subscription end time
    /// @param timestamp Event creation timestamp
    event SubscriptionCreated(
        address indexed dataProvider,
        address indexed subscriber,
        string recipient,
        uint256 indexed endTime,
        uint256 timestamp
    );

    /// @notice Emitted when subscription is renewed
    /// @param dataProvider Data provider address
    /// @param subscriber Subscriber address
    /// @param newRecipient New recipient data
    /// @param newEndTime Subscription's new end time
    /// @param timestamp Event creation timestamp
    event SubscriptionRenewed(
        address indexed dataProvider,
        address indexed subscriber,
        string newRecipient,
        uint256 indexed newEndTime,
        uint256 timestamp
    );

    /// @notice Emitted when a subscription is cancelled
    /// @param dataProvider Data provider address
    /// @param subscriber Subscriber address
    event SubscriptionCancelled(
        address indexed dataProvider,
        address indexed subscriber
    );

    /// @notice Emitted when a subscription is cancelled
    /// @param dataProvider Data provider address
    /// @param subscriber Subscriber address
    event SubscriptionEnded(
        address indexed dataProvider,
        address indexed subscriber
    );

    /// @notice Emitted when subscriber provides quality
    /// @param dataProvider Data provider address
    /// @param subscriber Subscriber address
    /// @param quality The quality provided
    event QualityProvided(
        address indexed dataProvider,
        address indexed subscriber,
        uint8 indexed quality
    );

    /// ----------- MODIFIERS ----------

    modifier validDataProvider(address dataProvider) {
        // Add some debug logs
        uint256 balance = nft.balanceOf(dataProvider);

        if (balance == 0) {
            revert InvalidDataProvider();
        }
        _;
    }

    modifier validQuality(uint8 quality) {
        if (quality > 100) {
            revert QualityOutOfRange();
        }
        _;
    }

    /// ---------- CONSTRUCTOR ---------

    /// @notice Collector Constructor
    /// @param owner_ Owner address
    /// @param nft_ Collector NFT token address
    /// @param feePerDay_ Subscription fee per day amount
    /// @param collectorFee_ Collector fee amount
    constructor(
        address owner_,
        IERC721 nft_,
        uint256 feePerDay_,
        uint256 collectorFee_
    ) Ownable(owner_) {
        if (address(nft_) == address(0)) {
            revert ZeroAddress();
        }

        nft = nft_;
        feePerDay = feePerDay_;
        collectorFee = collectorFee_;
    }

    /// ------- ADMIN FUNCTIONS --------

    /// @notice Updates feePerDay
    /// @dev Only owner can call this function
    /// @param feePerDay_ New subscription fee per day amount
    function setFeePerDay(uint256 feePerDay_) external onlyOwner {
        feePerDay = feePerDay_;

        emit FeePerDayUpdated(feePerDay_);
    }

    /// @notice Updates collectorFee
    /// @dev Only owner can call this function
    /// @param collectorFee_ New collector fee amount
    function setCollectorFee(uint256 collectorFee_) external onlyOwner {
        collectorFee = collectorFee_;
        emit CollectorFeeUpdated(collectorFee_);
    }

    /// ------- PUBLIC FUNCTIONS -------

    /// @notice Creates a new subscription
    /// @param dataProvider The address of the data provider
    /// @param recipient The recipient of the subscription
    /// @param endTime The subscription end time
    function subscribe(
        address dataProvider,
        string memory recipient,
        uint256 endTime
    ) external payable nonReentrant validDataProvider(dataProvider) {
        Subscription storage subscription = subscriptions[msg.sender][
            dataProvider
        ];
        if (subscription.endTime > 0) {
            revert AlreadySubscribed();
        }

        uint256 currentTime = block.timestamp;
        if (endTime < currentTime + MIN_SUBSCRIPTION_PERIOD) {
            revert SubscriptionPeriodTooShort();
        }

        // Calculate the total fee required for the subscription period
        uint256 duration = endTime - currentTime;
        uint256 providerFee = (duration * feePerDay) / 1 days;
        if (msg.value < providerFee + collectorFee) {
            revert LessSubscriptionFeeSent();
        }

        // Transfer the collector's fee & subscription fee
        payable(owner()).transfer(collectorFee);
        payable(dataProvider).transfer(providerFee);

        // Transfer remainder to subscriber
        if (msg.value > providerFee + collectorFee) {
            payable(msg.sender).transfer(
                msg.value - (providerFee + collectorFee)
            );
        }

        // Add subscriber to data providers list
        subscribers[dataProvider].push(Subscriber(msg.sender, recipient));

        // Store the subscription details
        subscription.recipient = recipient;
        subscription.endTime = endTime;

        // Emit an event for the new subscription
        emit SubscriptionCreated(
            dataProvider,
            msg.sender,
            recipient,
            endTime,
            currentTime
        );
    }

    /// @notice Renews an existing subscription
    /// @param dataProvider The address of the data provider
    /// @param newRecipient The new recipient data
    /// @param newEndTime The new end time for the subscription
    /// @param quality The quality of the data. Must be within [0, 100]
    function renewSubscription(
        address dataProvider,
        string memory newRecipient,
        uint256 newEndTime,
        uint8 quality
    ) external payable nonReentrant validDataProvider(dataProvider) {
        Subscription storage subscription = subscriptions[msg.sender][
            dataProvider
        ];
        uint256 currentTime = block.timestamp;

        // Check if the subscription exists
        if (subscription.endTime == 0) {
            revert SubscriptionNotFound();
        }

        // Check if the new end time is valid
        uint256 renewalTime = Math.max(subscription.endTime, currentTime);
        if (newEndTime < renewalTime + MIN_SUBSCRIPTION_PERIOD) {
            revert SubscriptionPeriodTooShort();
        }

        // Calculate the fee for the extended period
        uint256 extendedDuration = newEndTime - renewalTime;
        uint256 additionalFee = (extendedDuration * feePerDay) / 1 days;
        if (msg.value < additionalFee + collectorFee) {
            revert LessSubscriptionFeeSent();
        }

        // Transfer the collector's fee & additional subscription fee
        payable(owner()).transfer(collectorFee);
        payable(dataProvider).transfer(additionalFee);

        // Transfer remainder to subscriber
        if (msg.value > additionalFee + collectorFee) {
            payable(msg.sender).transfer(
                msg.value - (additionalFee + collectorFee)
            );
        }

        // Stores data quality
        _storeDataQuality(dataProvider, msg.sender, quality);

        // Update the subscription end time
        subscription.endTime = newEndTime;
        subscription.recipient = newRecipient;

        // Emit an event for the renewed subscription
        emit SubscriptionRenewed(
            dataProvider,
            msg.sender,
            newRecipient,
            newEndTime,
            block.timestamp
        );
    }

    /// @notice Cancels an existing subscription
    /// @param dataProvider The address of the data provider
    /// @param quality The quality of the data. Must be within [0, 100]
    function cancelSubscription(
        address dataProvider,
        uint8 quality
    ) external validDataProvider(dataProvider) {
        Subscription storage subscription = subscriptions[msg.sender][
            dataProvider
        ];
        if (subscription.endTime == 0) {
            revert SubscriptionNotFound();
        }

        if (block.timestamp >= subscription.endTime) {
            revert SubscriptionAlreadyEnded();
        }

        // Stores data quality
        _storeDataQuality(dataProvider, msg.sender, quality);

        // Reset the subscription details
        subscription.recipient = "";
        subscription.endTime = 0;

        // Emit an event for the cancelled subscription
        emit SubscriptionCancelled(dataProvider, msg.sender);
    }

    /// @notice Provides quality after subscription is ended
    /// @dev Can be called either when subscription is ended or the data provider loses the eligibility
    /// @param dataProvider The address of the data provider
    /// @param quality The quality of the data. Must be within [0, 100]
    function endSubscription(address dataProvider, uint8 quality) external {
        Subscription storage subscription = subscriptions[msg.sender][
            dataProvider
        ];
        if (subscription.endTime == 0) {
            revert SubscriptionNotFound();
        }

        // subscription is not ended and data provider still holds collector nft
        if (
            block.timestamp < subscription.endTime &&
            nft.balanceOf(dataProvider) > 0
        ) {
            revert ActiveSubscription();
        }

        // Stores data quality
        _storeDataQuality(dataProvider, msg.sender, quality);

        // Reset the subscription details
        subscription.recipient = "";
        subscription.endTime = 0;

        // Emit an event for the ended subscription
        emit SubscriptionEnded(dataProvider, msg.sender);
    }

    /// @notice Gets list of subscribers for data provider
    /// @param _dataProvider Address of data provider
    function getSubscribers(
        address _dataProvider
    ) public view returns(Subscriber [] memory){
        return subscribers[_dataProvider];
    }

    /// ------- INTERNAL FUNCTIONS -------

    /// @notice Store data quality for data aprovider
    /// @param dataProvider The address of the data provider
    /// @param subscriber The address of the subscriber
    /// @param quality The quality of the data. Must be within [0, 100]
    function _storeDataQuality(
        address dataProvider,
        address subscriber,
        uint8 quality
    ) internal validQuality(quality) {
        DataProviderQualityInfo storage qualityInfo = dataProviderQualities[
            dataProvider
        ];
        qualityInfo.qualities[qualityInfo.currentIndex] = QualityInfo({
            subscriber: subscriber,
            quality: quality
        });
        qualityInfo.currentIndex = (qualityInfo.currentIndex + 1) % MAX_RECORD;

        // Emits an event for the quality provision
        emit QualityProvided(dataProvider, subscriber, quality);
    }
}
