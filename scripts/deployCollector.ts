import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Creating new Collector instance with account:", deployer.address);

    // Load versions
    const versionsPath = path.join(__dirname, '../versions.json');
    if (!fs.existsSync(versionsPath)) {
        throw new Error("versions.json not found");
    }
    const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));

    // Get deployment info
    const network = (await ethers.provider.getNetwork()).name;
    const deploymentPath = path.join(__dirname, '../deployments.json');

    if (!fs.existsSync(deploymentPath)) {
        throw new Error("No deployments.json found. Please deploy CollectorFactory first.");
    }

    const deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const factoryAddress = deployments[network]?.factories[0]?.address;

    if (!factoryAddress) {
        throw new Error(`No CollectorFactory deployment found for network ${network}`);
    }

    // Get parameters
    const name = process.env.COLLECTOR_NAME || "Default Collector";
    const symbol = process.env.COLLECTOR_SYMBOL || "COLL";
    const tokenURI = process.env.TOKEN_URI || "https://default-uri.com";
    const feePerDay = ethers.parseEther(process.env.FEE_PER_DAY || "1");
    const collectorFee = ethers.parseEther(process.env.COLLECTOR_FEE || "0.2");

    console.log("\nDeployment Parameters:");
    console.log("----------------------");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Token URI:", tokenURI);
    console.log("Fee per day:", ethers.formatEther(feePerDay));
    console.log("Collector fee:", ethers.formatEther(collectorFee));

    // First deploy the Collector NFT
    const Collector = await ethers.getContractFactory("Collector");
    const collectorNFT = await Collector.deploy(
        name,
        symbol,
        tokenURI,
        deployer.address
    );
    await collectorNFT.waitForDeployment();
    const collectorNFTAddress = await collectorNFT.getAddress();
    console.log("\nCollector NFT deployed to:", collectorNFTAddress);

    // Get the factory contract
    const factory = await ethers.getContractAt("CollectorFactory", factoryAddress);

    // Create collector instance through factory
    const tx = await factory.createCollector(
        collectorNFTAddress,
        feePerDay,
        collectorFee
    );
    const receipt = await tx.wait();

    // Get the collector address from the CollectorCreated event
    const event = receipt.logs.find((log: any) =>
        log.eventName === 'CollectorCreated'
    );
    const collectorAddress = event?.args?.collector;

    console.log("\nNew collector instance created at:", collectorAddress);

    // Update deployments.json
    if (!deployments[network].collectors) {
        deployments[network].collectors = [];
    }

    deployments[network].collectors.push({
        nft: {
            address: collectorNFTAddress,
            version: versions.contracts.Collector
        },
        collector: {
            address: collectorAddress,
            version: versions.contracts.SubscriptionManager
        },
        deployedAt: new Date().toISOString(),
        deployedBy: deployer.address,
        params: {
            name,
            symbol,
            tokenURI,
            feePerDay: ethers.formatEther(feePerDay),
            collectorFee: ethers.formatEther(collectorFee)
        }
    });

    fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
    console.log("\nDeployment info updated in deployments.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
