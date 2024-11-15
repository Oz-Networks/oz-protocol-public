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

async function addCreator() {
    const factory = await getFactory();
    const creator = process.env.CREATOR_ADDRESS;

    if (!creator) {
        throw new Error("Please provide CREATOR_ADDRESS in .env");
    }

    const tx = await factory.handleCollectorCreator(creator, true);
    await tx.wait();
    console.log(`Added collector creator: ${creator}`);
}

async function removeCreator() {
    const factory = await getFactory();
    const creator = process.env.CREATOR_ADDRESS;

    if (!creator) {
        throw new Error("Please provide CREATOR_ADDRESS in .env");
    }

    const tx = await factory.handleCollectorCreator(creator, false);
    await tx.wait();
    console.log(`Removed collector creator: ${creator}`);
}

// Parse command line arguments
const command = process.argv[2];
switch (command) {
    case "add":
        addCreator().catch(console.error);
        break;
    case "remove":
        removeCreator().catch(console.error);
        break;
    default:
        console.log("Please provide a command: add or remove");
}
