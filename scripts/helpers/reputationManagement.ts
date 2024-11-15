import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function getFactory() {
    const network = (await ethers.provider.getNetwork()).name;
    const deploymentPath = path.join(__dirname, '../../deployments.json');
    const deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const factoryAddress = deployments[network]?.collectorFactory;

    if (!factoryAddress) {
        throw new Error("No CollectorFactory found for this network.");
    }

    return await ethers.getContractAt("CollectorFactory", factoryAddress);
}

async function checkReputationScore() {
    const factory = await getFactory();
    const collector = process.env.COLLECTOR_ADDRESS;
    const dataProvider = process.env.DATA_PROVIDER_ADDRESS;

    if (!collector || !dataProvider) {
        throw new Error("Please provide COLLECTOR_ADDRESS and DATA_PROVIDER_ADDRESS in .env");
    }

    const score = await factory.getReputationScore(collector, dataProvider);
    console.log(`Reputation score: ${score}`);
}

async function addReputationProvider() {
    const factory = await getFactory();
    const provider = process.env.PROVIDER_ADDRESS;

    if (!provider) {
        throw new Error("Please provide PROVIDER_ADDRESS in .env");
    }

    const tx = await factory.handleReputationProvider(provider, true);
    await tx.wait();
    console.log(`Added reputation provider: ${provider}`);
}

async function removeReputationProvider() {
    const factory = await getFactory();
    const provider = process.env.PROVIDER_ADDRESS;

    if (!provider) {
        throw new Error("Please provide PROVIDER_ADDRESS in .env");
    }

    const tx = await factory.handleReputationProvider(provider, false);
    await tx.wait();
    console.log(`Removed reputation provider: ${provider}`);
}

// Parse command line arguments
const command = process.argv[2];
switch (command) {
    case "check":
        checkReputationScore().catch(console.error);
        break;
    case "add-provider":
        addReputationProvider().catch(console.error);
        break;
    case "remove-provider":
        removeReputationProvider().catch(console.error);
        break;
    default:
        console.log("Please provide a command: check, add-provider, or remove-provider");
}
