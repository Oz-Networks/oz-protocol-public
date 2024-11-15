/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  ERC721Mock,
  ERC721MockInterface,
} from "../../../contracts/mocks/ERC721Mock";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
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
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "exists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getOwner",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620015c2380380620015c2833981016040819052620000349162000126565b8181600062000044838262000221565b50600162000053828262000221565b5050505050620002ed565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008657600080fd5b81516001600160401b0380821115620000a357620000a36200005e565b604051601f8301601f19908116603f01168101908282118183101715620000ce57620000ce6200005e565b8160405283815260209250866020858801011115620000ec57600080fd5b600091505b83821015620001105785820183015181830184015290820190620000f1565b6000602085830101528094505050505092915050565b600080604083850312156200013a57600080fd5b82516001600160401b03808211156200015257600080fd5b620001608683870162000074565b935060208501519150808211156200017757600080fd5b50620001868582860162000074565b9150509250929050565b600181811c90821680620001a557607f821691505b602082108103620001c657634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021c576000816000526020600020601f850160051c81016020861015620001f75750805b601f850160051c820191505b81811015620002185782815560010162000203565b5050505b505050565b81516001600160401b038111156200023d576200023d6200005e565b62000255816200024e845462000190565b84620001cc565b602080601f8311600181146200028d5760008415620002745750858301515b600019600386901b1c1916600185901b17855562000218565b600085815260208120601f198616915b82811015620002be578886015182559484019460019091019084016200029d565b5085821015620002dd5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6112c580620002fd6000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c80634f558e79116100a2578063a22cb46511610071578063a22cb46514610238578063b88d4fde1461024b578063c41a360a1461025e578063c87b56dd14610271578063e985e9c51461028457600080fd5b80634f558e79146101d95780636352211e146101fc57806370a082311461020f57806395d89b411461023057600080fd5b806323b872dd116100de57806323b872dd1461018d57806340c10f19146101a057806342842e0e146101b357806342966c68146101c657600080fd5b806301ffc9a71461011057806306fdde0314610138578063081812fc1461014d578063095ea7b314610178575b600080fd5b61012361011e366004610f35565b610297565b60405190151581526020015b60405180910390f35b6101406102e9565b60405161012f9190610fa2565b61016061015b366004610fb5565b61037b565b6040516001600160a01b03909116815260200161012f565b61018b610186366004610fea565b6103a4565b005b61018b61019b366004611014565b6103b3565b61018b6101ae366004610fea565b610443565b61018b6101c1366004611014565b610593565b61018b6101d4366004610fb5565b6105b3565b6101236101e7366004610fb5565b60009081526006602052604090205460ff1690565b61016061020a366004610fb5565b610684565b61022261021d366004611050565b61068f565b60405190815260200161012f565b6101406106d7565b61018b61024636600461106b565b6106e6565b61018b6102593660046110bd565b6106f1565b61016061026c366004610fb5565b610708565b61014061027f366004610fb5565b610766565b610123610292366004611199565b6107db565b60006001600160e01b031982166380ac58cd60e01b14806102c857506001600160e01b03198216635b5e139f60e01b145b806102e357506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600080546102f8906111cc565b80601f0160208091040260200160405190810160405280929190818152602001828054610324906111cc565b80156103715780601f1061034657610100808354040283529160200191610371565b820191906000526020600020905b81548152906001019060200180831161035457829003601f168201915b5050505050905090565b600061038682610809565b506000828152600460205260409020546001600160a01b03166102e3565b6103af828233610842565b5050565b6001600160a01b0382166103e257604051633250574960e11b8152600060048201526024015b60405180910390fd5b60006103ef83833361084f565b9050836001600160a01b0316816001600160a01b03161461043d576040516364283d7b60e01b81526001600160a01b03808616600483015260248201849052821660448201526064016103d9565b50505050565b6001600160a01b0382166104995760405162461bcd60e51b815260206004820152601b60248201527f43616e6e6f74206d696e7420746f207a65726f2061646472657373000000000060448201526064016103d9565b60008181526006602052604090205460ff16156104f85760405162461bcd60e51b815260206004820152601760248201527f546f6b656e20494420616c72656164792065786973747300000000000000000060448201526064016103d9565b6105028282610948565b6000818152600660205260409020805460ff191660011790556001600160a01b03821661052e82610684565b6001600160a01b0316146103af5760405162461bcd60e51b815260206004820152602660248201527f546f6b656e207761736e2774206d696e74656420746f20636f7272656374206160448201526564647265737360d01b60648201526084016103d9565b6105ae838383604051806020016040528060008152506106f1565b505050565b60008181526006602052604090205460ff166106085760405162461bcd60e51b8152602060048201526014602482015273151bdad95b88191bd95cc81b9bdd08195e1a5cdd60621b60448201526064016103d9565b600061061382610684565b90506001600160a01b0381166106625760405162461bcd60e51b8152602060048201526014602482015273151bdad95b88185b1c9958591e48189d5c9b995960621b60448201526064016103d9565b61066b82610962565b506000908152600660205260409020805460ff19169055565b60006102e382610809565b60006001600160a01b0382166106bb576040516322718ad960e21b8152600060048201526024016103d9565b506001600160a01b031660009081526003602052604090205490565b6060600180546102f8906111cc565b6103af33838361099d565b6106fc8484846103b3565b61043d84848484610a3c565b60008181526006602052604081205460ff1661075d5760405162461bcd60e51b8152602060048201526014602482015273151bdad95b88191bd95cc81b9bdd08195e1a5cdd60621b60448201526064016103d9565b6102e382610684565b606061077182610809565b50600061078960408051602081019091526000815290565b905060008151116107a957604051806020016040528060008152506107d4565b806107b384610b65565b6040516020016107c4929190611206565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6000818152600260205260408120546001600160a01b0316806102e357604051637e27328960e01b8152600481018490526024016103d9565b6105ae8383836001610bf8565b6000828152600260205260408120546001600160a01b039081169083161561087c5761087c818486610cfe565b6001600160a01b038116156108ba57610899600085600080610bf8565b6001600160a01b038116600090815260036020526040902080546000190190555b6001600160a01b038516156108e9576001600160a01b0385166000908152600360205260409020805460010190555b60008481526002602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b6103af828260405180602001604052806000815250610d62565b6000610971600083600061084f565b90506001600160a01b0381166103af57604051637e27328960e01b8152600481018390526024016103d9565b6001600160a01b0382166109cf57604051630b61174360e31b81526001600160a01b03831660048201526024016103d9565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561043d57604051630a85bd0160e11b81526001600160a01b0384169063150b7a0290610a7e903390889087908790600401611235565b6020604051808303816000875af1925050508015610ab9575060408051601f3d908101601f19168201909252610ab691810190611272565b60015b610b22573d808015610ae7576040519150601f19603f3d011682016040523d82523d6000602084013e610aec565b606091505b508051600003610b1a57604051633250574960e11b81526001600160a01b03851660048201526024016103d9565b805181602001fd5b6001600160e01b03198116630a85bd0160e11b14610b5e57604051633250574960e11b81526001600160a01b03851660048201526024016103d9565b5050505050565b60606000610b7283610d79565b600101905060008167ffffffffffffffff811115610b9257610b926110a7565b6040519080825280601f01601f191660200182016040528015610bbc576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610bc657509392505050565b8080610c0c57506001600160a01b03821615155b15610cce576000610c1c84610809565b90506001600160a01b03831615801590610c485750826001600160a01b0316816001600160a01b031614155b8015610c5b5750610c5981846107db565b155b15610c845760405163a9fbf51f60e01b81526001600160a01b03841660048201526024016103d9565b8115610ccc5783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b5050600090815260046020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b610d09838383610e51565b6105ae576001600160a01b038316610d3757604051637e27328960e01b8152600481018290526024016103d9565b60405163177e802f60e01b81526001600160a01b0383166004820152602481018290526044016103d9565b610d6c8383610eb7565b6105ae6000848484610a3c565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610db85772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610de4576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610e0257662386f26fc10000830492506010015b6305f5e1008310610e1a576305f5e100830492506008015b6127108310610e2e57612710830492506004015b60648310610e40576064830492506002015b600a83106102e35760010192915050565b60006001600160a01b03831615801590610eaf5750826001600160a01b0316846001600160a01b03161480610e8b5750610e8b84846107db565b80610eaf57506000828152600460205260409020546001600160a01b038481169116145b949350505050565b6001600160a01b038216610ee157604051633250574960e11b8152600060048201526024016103d9565b6000610eef8383600061084f565b90506001600160a01b038116156105ae576040516339e3563760e11b8152600060048201526024016103d9565b6001600160e01b031981168114610f3257600080fd5b50565b600060208284031215610f4757600080fd5b81356107d481610f1c565b60005b83811015610f6d578181015183820152602001610f55565b50506000910152565b60008151808452610f8e816020860160208601610f52565b601f01601f19169290920160200192915050565b6020815260006107d46020830184610f76565b600060208284031215610fc757600080fd5b5035919050565b80356001600160a01b0381168114610fe557600080fd5b919050565b60008060408385031215610ffd57600080fd5b61100683610fce565b946020939093013593505050565b60008060006060848603121561102957600080fd5b61103284610fce565b925061104060208501610fce565b9150604084013590509250925092565b60006020828403121561106257600080fd5b6107d482610fce565b6000806040838503121561107e57600080fd5b61108783610fce565b91506020830135801515811461109c57600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600080600080608085870312156110d357600080fd5b6110dc85610fce565b93506110ea60208601610fce565b925060408501359150606085013567ffffffffffffffff8082111561110e57600080fd5b818701915087601f83011261112257600080fd5b813581811115611134576111346110a7565b604051601f8201601f19908116603f0116810190838211818310171561115c5761115c6110a7565b816040528281528a602084870101111561117557600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600080604083850312156111ac57600080fd5b6111b583610fce565b91506111c360208401610fce565b90509250929050565b600181811c908216806111e057607f821691505b60208210810361120057634e487b7160e01b600052602260045260246000fd5b50919050565b60008351611218818460208801610f52565b83519083019061122c818360208801610f52565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061126890830184610f76565b9695505050505050565b60006020828403121561128457600080fd5b81516107d481610f1c56fea264697066735822122065a8ce4f1285566d374944c919f932692e51824cb038b974519d9514b7c3298464736f6c63430008180033";

type ERC721MockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721MockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Mock__factory extends ContractFactory {
  constructor(...args: ERC721MockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override deploy(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(name, symbol, overrides || {}) as Promise<
      ERC721Mock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC721Mock__factory {
    return super.connect(runner) as ERC721Mock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721MockInterface {
    return new Interface(_abi) as ERC721MockInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ERC721Mock {
    return new Contract(address, _abi, runner) as unknown as ERC721Mock;
  }
}
