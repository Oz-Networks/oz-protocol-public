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
import type { NonPayableOverrides } from "../../common";
import type {
  CollectorRegistry,
  CollectorRegistryInterface,
} from "../../contracts/CollectorRegistry";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldFactory",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newFactory",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "version",
        type: "string",
      },
    ],
    name: "FactoryUpdated",
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
    inputs: [],
    name: "currentFactory",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "factoryHistory",
    outputs: [
      {
        internalType: "address",
        name: "factoryAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFactoryHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "factoryAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "version",
            type: "string",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct CollectorRegistry.FactoryInfo[]",
        name: "",
        type: "tuple[]",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "newFactory",
        type: "address",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
    ],
    name: "updateFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50338061003757604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61004081610046565b50610096565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6109af806100a56000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c95e53651161005b578063c95e5365146100c9578063cea3877d146100ec578063f2fde38b146100ff578063ff441cc41461011257600080fd5b8063715018a6146100825780638da5cb5b1461008c578063bff485a5146100b6575b600080fd5b61008a610127565b005b6000546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b600154610099906001600160a01b031681565b6100dc6100d7366004610594565b61013b565b6040516100ad94939291906105f3565b61008a6100fa36600461065f565b61020d565b61008a61010d366004610721565b6103b1565b61011a6103f4565b6040516100ad9190610743565b61012f610517565b6101396000610544565b565b6002818154811061014b57600080fd5b60009182526020909120600490910201805460018201546002830180546001600160a01b039093169450909291610181906107de565b80601f01602080910402602001604051908101604052809291908181526020018280546101ad906107de565b80156101fa5780601f106101cf576101008083540402835291602001916101fa565b820191906000526020600020905b8154815290600101906020018083116101dd57829003601f168201915b5050506003909301549192505060ff1684565b610215610517565b600180546001600160a01b03198082166001600160a01b0386811691821785556040805160808101825292835242602084019081529083018781526060840187905260028054978801815560005283517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace6004909802978801805490961690841617855590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf8701555193169390927f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad0909101906102f49082610869565b50606091909101516003909101805460ff19169115159190911790556002546001101561036157600280546000919061032e908290610929565b8154811061033e5761033e610950565b60009182526020909120600490910201600301805460ff19169115159190911790555b826001600160a01b0316816001600160a01b03167f5b7087b875cca572d373ed89470b98495bb4ec7b125f0b6cd0fb23887e84badd846040516103a49190610966565b60405180910390a3505050565b6103b9610517565b6001600160a01b0381166103e857604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6103f181610544565b50565b60606002805480602002602001604051908101604052809291908181526020016000905b8282101561050e576000848152602090819020604080516080810182526004860290920180546001600160a01b031683526001810154938301939093526002830180549293929184019161046b906107de565b80601f0160208091040260200160405190810160405280929190818152602001828054610497906107de565b80156104e45780601f106104b9576101008083540402835291602001916104e4565b820191906000526020600020905b8154815290600101906020018083116104c757829003601f168201915b50505091835250506003919091015460ff1615156020918201529082526001929092019101610418565b50505050905090565b6000546001600160a01b031633146101395760405163118cdaa760e01b81523360048201526024016103df565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156105a657600080fd5b5035919050565b6000815180845260005b818110156105d3576020818501810151868301820152016105b7565b506000602082860101526020601f19601f83011685010191505092915050565b60018060a01b038516815283602082015260806040820152600061061a60808301856105ad565b9050821515606083015295945050505050565b80356001600160a01b038116811461064457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561067257600080fd5b61067b8361062d565b9150602083013567ffffffffffffffff8082111561069857600080fd5b818501915085601f8301126106ac57600080fd5b8135818111156106be576106be610649565b604051601f8201601f19908116603f011681019083821181831017156106e6576106e6610649565b816040528281528860208487010111156106ff57600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b60006020828403121561073357600080fd5b61073c8261062d565b9392505050565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b838110156107d057888303603f19018552815180516001600160a01b031684528781015188850152868101516080888601819052906107ad828701826105ad565b60609384015115159690930195909552509487019492509086019060010161076c565b509098975050505050505050565b600181811c908216806107f257607f821691505b60208210810361081257634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610864576000816000526020600020601f850160051c810160208610156108415750805b601f850160051c820191505b818110156108605782815560010161084d565b5050505b505050565b815167ffffffffffffffff81111561088357610883610649565b6108978161089184546107de565b84610818565b602080601f8311600181146108cc57600084156108b45750858301515b600019600386901b1c1916600185901b178555610860565b600085815260208120601f198616915b828110156108fb578886015182559484019460019091019084016108dc565b50858210156109195787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b8181038181111561094a57634e487b7160e01b600052601160045260246000fd5b92915050565b634e487b7160e01b600052603260045260246000fd5b60208152600061073c60208301846105ad56fea2646970667358221220f46e669ad437b4132335eef27febd265a866932ef1ef652335baa358d96e3f7264736f6c63430008180033";

type CollectorRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollectorRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CollectorRegistry__factory extends ContractFactory {
  constructor(...args: CollectorRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      CollectorRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CollectorRegistry__factory {
    return super.connect(runner) as CollectorRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollectorRegistryInterface {
    return new Interface(_abi) as CollectorRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CollectorRegistry {
    return new Contract(address, _abi, runner) as unknown as CollectorRegistry;
  }
}
