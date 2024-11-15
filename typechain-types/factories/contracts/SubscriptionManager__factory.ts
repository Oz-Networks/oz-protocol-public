/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  SubscriptionManager,
  SubscriptionManagerInterface,
} from "../../contracts/SubscriptionManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
      {
        internalType: "contract IERC721",
        name: "nft_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "feePerDay_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collectorFee_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ActiveSubscription",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadySubscribed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDataProvider",
    type: "error",
  },
  {
    inputs: [],
    name: "LessSubscriptionFeeSent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "QualityOutOfRange",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "SubscriptionAlreadyEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "SubscriptionNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "SubscriptionPeriodTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newCollectorFee",
        type: "uint256",
      },
    ],
    name: "CollectorFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newFeePerDay",
        type: "uint256",
      },
    ],
    name: "FeePerDayUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "quality",
        type: "uint8",
      },
    ],
    name: "QualityProvided",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
    ],
    name: "SubscriptionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recipient",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SubscriptionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
    ],
    name: "SubscriptionEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newRecipient",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newEndTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SubscriptionRenewed",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_RECORD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_SUBSCRIPTION_PERIOD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "quality",
        type: "uint8",
      },
    ],
    name: "cancelSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collectorFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "dataProviderQualities",
    outputs: [
      {
        internalType: "uint256",
        name: "currentIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "quality",
        type: "uint8",
      },
    ],
    name: "endSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feePerDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dataProvider",
        type: "address",
      },
    ],
    name: "getSubscribers",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
          {
            internalType: "string",
            name: "recipient",
            type: "string",
          },
        ],
        internalType: "struct SubscriptionManager.Subscriber[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nft",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        internalType: "string",
        name: "newRecipient",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "newEndTime",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "quality",
        type: "uint8",
      },
    ],
    name: "renewSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "collectorFee_",
        type: "uint256",
      },
    ],
    name: "setCollectorFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "feePerDay_",
        type: "uint256",
      },
    ],
    name: "setFeePerDay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dataProvider",
        type: "address",
      },
      {
        internalType: "string",
        name: "recipient",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "subscribers",
    outputs: [
      {
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        internalType: "string",
        name: "recipient",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "subscriptions",
    outputs: [
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "recipient",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b506040516200189238038062001892833981016040819052620000349162000120565b836001600160a01b0381166200006457604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200006f81620000b7565b50600180556001600160a01b0383166200009c5760405163d92e233d60e01b815260040160405180910390fd5b6001600160a01b03909216608052600255600355506200016d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200011d57600080fd5b50565b600080600080608085870312156200013757600080fd5b8451620001448162000107565b6020860151909450620001578162000107565b6040860151606090960151949790965092505050565b6080516116ed620001a5600039600081816101560152818161058d015281816107ba01528181610b030152610e3501526116ed6000f3fe6080604052600436106101095760003560e01c806372cb3e8211610095578063a322f94811610064578063a322f948146102e2578063ac5c7c5314610302578063d9ef52d114610332578063f103eaaf14610347578063f2fde38b1461035d57600080fd5b806372cb3e821461027657806386779b521461029a5780638da5cb5b146102ad578063968ba8ef146102cb57600080fd5b80636207d31b116100dc5780636207d31b146101e0578063692a8a801461020e5780636ae5c9b01461022e5780636b6c616d1461024e578063715018a61461026157600080fd5b806307e7080a1461010e57806347ccca02146101445780635f5bafcc146101905780635fd5bffd146101be575b600080fd5b34801561011a57600080fd5b5061012e610129366004611153565b61037d565b60405161013b91906111b4565b60405180910390f35b34801561015057600080fd5b506101787f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161013b565b34801561019c57600080fd5b506101b06101ab366004611233565b610499565b60405161013b92919061125d565b3480156101ca57600080fd5b506101de6101d936600461129a565b610569565b005b3480156101ec57600080fd5b506102006101fb3660046112cd565b6106eb565b60405161013b9291906112f7565b34801561021a57600080fd5b506101de610229366004611310565b610718565b34801561023a57600080fd5b506101de610249366004611310565b610753565b6101de61025c3660046113cc565b61078e565b34801561026d57600080fd5b506101de610ac3565b34801561028257600080fd5b5061028c60025481565b60405190815260200161013b565b6101de6102a8366004611423565b610ad7565b3480156102b957600080fd5b506000546001600160a01b0316610178565b3480156102d757600080fd5b5061028c6201518081565b3480156102ee57600080fd5b506101de6102fd36600461129a565b610dc3565b34801561030e57600080fd5b5061028c61031d366004611153565b6006602052600090815260409020600a015481565b34801561033e57600080fd5b5061028c600a81565b34801561035357600080fd5b5061028c60035481565b34801561036957600080fd5b506101de610378366004611153565b610f2a565b6001600160a01b0381166000908152600560209081526040808320805482518185028101850190935280835260609492939192909184015b8282101561048e576000848152602090819020604080518082019091526002850290910180546001600160a01b0316825260018101805492939192918401916103fd9061148b565b80601f01602080910402602001604051908101604052809291908181526020018280546104299061148b565b80156104765780601f1061044b57610100808354040283529160200191610476565b820191906000526020600020905b81548152906001019060200180831161045957829003601f168201915b505050505081525050815260200190600101906103b5565b505050509050919050565b600560205281600052604060002081815481106104b557600080fd5b6000918252602090912060029091020180546001820180546001600160a01b0390921694509192506104e69061148b565b80601f01602080910402602001604051908101604052809291908181526020018280546105129061148b565b801561055f5780601f106105345761010080835404028352916020019161055f565b820191906000526020600020905b81548152906001019060200180831161054257829003601f168201915b5050505050905082565b6040516370a0823160e01b81526001600160a01b03808416600483015283916000917f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa1580156105d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f891906114c5565b90508060000361061b57604051636af73fb160e11b815260040160405180910390fd5b3360009081526004602090815260408083206001600160a01b03881684529091528120805490910361066057604051631a00354f60e01b815260040160405180910390fd5b8054421061068157604051636406fa1560e01b815260040160405180910390fd5b61068c853386610f6d565b60408051602081019091526000815260018201906106aa908261152e565b50600080825560405133916001600160a01b038816917f4f63ff9c987ba9233a93b549bdb283252838f696fe1349ef76a85e2ae7f822e39190a35050505050565b6004602090815260009283526040808420909152908252902080546001820180549192916104e69061148b565b610720611076565b600381905560405181907f526f715cfc9d0f558989a57a9e26f5a05ac1042d2325f75d59bb381fa2a47de290600090a250565b61075b611076565b600281905560405181907feb144f1c5f6ec578479c4044f98979b433ee3348bf4c1eecb39f0e7e3fdb3c8b90600090a250565b6107966110a3565b6040516370a0823160e01b81526001600160a01b03808516600483015284916000917f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610801573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061082591906114c5565b90508060000361084857604051636af73fb160e11b815260040160405180910390fd5b3360009081526004602090815260408083206001600160a01b0389168452909152902080541561088b57604051632fec509960e11b815260040160405180910390fd5b426108996201518082611604565b8510156108b9576040516349cb49f560e01b815260040160405180910390fd5b60006108c58287611617565b9050600062015180600254836108db919061162a565b6108e59190611657565b9050600354816108f59190611604565b3410156109155760405163d90d516f60e01b815260040160405180910390fd5b600080546003546040516001600160a01b039092169281156108fc029290818181858888f19350505050158015610950573d6000803e3d6000fd5b506040516001600160a01b038a169082156108fc029083906000818181858888f19350505050158015610987573d6000803e3d6000fd5b506003546109959082611604565b3411156109e35760035433906108fc906109af9084611604565b6109b99034611617565b6040518115909202916000818181858888f193505050501580156109e1573d6000803e3d6000fd5b505b6001600160a01b03898116600090815260056020908152604080832081518083019092523382528183018d815281546001808201845592865293909420825160029094020180546001600160a01b03191693909516929092178455915191929190820190610a51908261152e565b50505060018401610a62898261152e565b50868455604051879033906001600160a01b038c16907fa096d55fe0953227eb38bd4cae5ab7f659a80d663b3b9e889999e9c90891423d90610aa7908d90899061166b565b60405180910390a4505050505050610abe60018055565b505050565b610acb611076565b610ad560006110cd565b565b610adf6110a3565b6040516370a0823160e01b81526001600160a01b03808616600483015285916000917f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610b4a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b6e91906114c5565b905080600003610b9157604051636af73fb160e11b815260040160405180910390fd5b3360009081526004602090815260408083206001600160a01b038a16845290915281208054909142919003610bd957604051631a00354f60e01b815260040160405180910390fd5b6000610be983600001548361111d565b9050610bf86201518082611604565b871015610c18576040516349cb49f560e01b815260040160405180910390fd5b6000610c248289611617565b905060006201518060025483610c3a919061162a565b610c449190611657565b905060035481610c549190611604565b341015610c745760405163d90d516f60e01b815260040160405180910390fd5b600080546003546040516001600160a01b039092169281156108fc029290818181858888f19350505050158015610caf573d6000803e3d6000fd5b506040516001600160a01b038c169082156108fc029083906000818181858888f19350505050158015610ce6573d6000803e3d6000fd5b50600354610cf49082611604565b341115610d425760035433906108fc90610d0e9084611604565b610d189034611617565b6040518115909202916000818181858888f19350505050158015610d40573d6000803e3d6000fd5b505b610d4d8b338a610f6d565b88855560018501610d5e8b8261152e565b5088336001600160a01b03168c6001600160a01b03167f7e8eb2c1af97a3780b1a02bef48aa99bd50f08bae7654aabcbab9f3bc4ee0f7b8d42604051610da592919061166b565b60405180910390a450505050505050610dbd60018055565b50505050565b3360009081526004602090815260408083206001600160a01b038616845290915281208054909103610e0857604051631a00354f60e01b815260040160405180910390fd5b805442108015610ea457506040516370a0823160e01b81526001600160a01b0384811660048301526000917f0000000000000000000000000000000000000000000000000000000000000000909116906370a0823190602401602060405180830381865afa158015610e7e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ea291906114c5565b115b15610ec25760405163dff2758760e01b815260040160405180910390fd5b610ecd833384610f6d565b6040805160208101909152600081526001820190610eeb908261152e565b50600080825560405133916001600160a01b038616917fa36e542773a934d56325c3a8d3df287cc118d14dc700c17f406523f1f6447ca59190a3505050565b610f32611076565b6001600160a01b038116610f6157604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610f6a816110cd565b50565b8060648160ff161115610f93576040516303ea000960e61b815260040160405180910390fd5b6001600160a01b038085166000908152600660209081526040918290208251808401909352928616825260ff851690820152600a8083015483918110610fdb57610fdb61168d565b82519101805460209093015160ff16600160a01b026001600160a81b03199093166001600160a01b0390921691909117919091179055600a81810154611022906001611604565b61102c91906116a3565b600a82015560405160ff8416906001600160a01b0380871691908816907f44aedcfa4237cfb29d0f6850597741cb4f40c25e45b4265264100c7c1156675790600090a45050505050565b6000546001600160a01b03163314610ad55760405163118cdaa760e01b8152336004820152602401610f58565b6002600154036110c657604051633ee5aeb560e01b815260040160405180910390fd5b6002600155565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600081831161112c578161112e565b825b90505b92915050565b80356001600160a01b038116811461114e57600080fd5b919050565b60006020828403121561116557600080fd5b61112e82611137565b6000815180845260005b8181101561119457602081850181015186830182015201611178565b506000602082860101526020601f19601f83011685010191505092915050565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b8381101561122557888303603f19018552815180516001600160a01b031684528701518784018790526112128785018261116e565b95880195935050908601906001016111dd565b509098975050505050505050565b6000806040838503121561124657600080fd5b61124f83611137565b946020939093013593505050565b6001600160a01b03831681526040602082018190526000906112819083018461116e565b949350505050565b803560ff8116811461114e57600080fd5b600080604083850312156112ad57600080fd5b6112b683611137565b91506112c460208401611289565b90509250929050565b600080604083850312156112e057600080fd5b6112e983611137565b91506112c460208401611137565b828152604060208201526000611281604083018461116e565b60006020828403121561132257600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261135057600080fd5b813567ffffffffffffffff8082111561136b5761136b611329565b604051601f8301601f19908116603f0116810190828211818310171561139357611393611329565b816040528381528660208588010111156113ac57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000606084860312156113e157600080fd5b6113ea84611137565b9250602084013567ffffffffffffffff81111561140657600080fd5b6114128682870161133f565b925050604084013590509250925092565b6000806000806080858703121561143957600080fd5b61144285611137565b9350602085013567ffffffffffffffff81111561145e57600080fd5b61146a8782880161133f565b9350506040850135915061148060608601611289565b905092959194509250565b600181811c9082168061149f57607f821691505b6020821081036114bf57634e487b7160e01b600052602260045260246000fd5b50919050565b6000602082840312156114d757600080fd5b5051919050565b601f821115610abe576000816000526020600020601f850160051c810160208610156115075750805b601f850160051c820191505b8181101561152657828155600101611513565b505050505050565b815167ffffffffffffffff81111561154857611548611329565b61155c81611556845461148b565b846114de565b602080601f83116001811461159157600084156115795750858301515b600019600386901b1c1916600185901b178555611526565b600085815260208120601f198616915b828110156115c0578886015182559484019460019091019084016115a1565b50858210156115de5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b80820180821115611131576111316115ee565b81810381811115611131576111316115ee565b8082028115828204841417611131576111316115ee565b634e487b7160e01b600052601260045260246000fd5b60008261166657611666611641565b500490565b60408152600061167e604083018561116e565b90508260208301529392505050565b634e487b7160e01b600052603260045260246000fd5b6000826116b2576116b2611641565b50069056fea2646970667358221220c6f46ac3b28a2c522da4ec91befe761d3f152b112770a26f5c9c24b2ca43f9e864736f6c63430008180033";

type SubscriptionManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SubscriptionManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SubscriptionManager__factory extends ContractFactory {
  constructor(...args: SubscriptionManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    owner_: AddressLike,
    nft_: AddressLike,
    feePerDay_: BigNumberish,
    collectorFee_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      owner_,
      nft_,
      feePerDay_,
      collectorFee_,
      overrides || {}
    );
  }
  override deploy(
    owner_: AddressLike,
    nft_: AddressLike,
    feePerDay_: BigNumberish,
    collectorFee_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      owner_,
      nft_,
      feePerDay_,
      collectorFee_,
      overrides || {}
    ) as Promise<
      SubscriptionManager & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): SubscriptionManager__factory {
    return super.connect(runner) as SubscriptionManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SubscriptionManagerInterface {
    return new Interface(_abi) as SubscriptionManagerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SubscriptionManager {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as SubscriptionManager;
  }
}