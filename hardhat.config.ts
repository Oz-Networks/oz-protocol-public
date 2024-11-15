import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    oztestnet: {
      url: "https://rpc.ozprotocol.com/ext/bc/v3bKtvrWywFjDNdP5LWsomJG6k9h5P7Ke8WQykoSzrL2CMuFb/rpc",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 7589,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000,
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
};

export default config;
