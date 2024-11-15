import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const network = (await ethers.provider.getNetwork()).name;
    console.log(`Listing collectors for network: ${network}\n`);

    const deploymentPath = path.join(__dirname, '../../deployments.json');
    if (!fs.existsSync(deploymentPath)) {
        console.log("No deployments found.");
        return;
    }

    const deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const factoryAddress = deployments[network]?.collectorFactory;

    if (!factoryAddress) {
        console.log("No CollectorFactory found for this network.");
        return;
    }

    const factory = await ethers.getContractAt("CollectorFactory", factoryAddress);

    // Get valid collectors
    const validCollectors = await factory.listCollectorsByValidation(true);
    console.log("Valid Collectors:");
    console.log("----------------");
    for (const collector of validCollectors) {
        console.log(`Address: ${collector.collectorAddress}`);
        console.log(`Owner: ${collector.collectorOwner}`);
        console.log(`Created: ${new Date(Number(collector.timestamp) * 1000).toLocaleString()}`);
        console.log("----------------");
    }

    // Get invalid collectors
    const invalidCollectors = await factory.listCollectorsByValidation(false);
    if (invalidCollectors.length > 0) {
        console.log("\nInvalid Collectors:");
        console.log("------------------");
        for (const collector of invalidCollectors) {
            console.log(`Address: ${collector.collectorAddress}`);
            console.log(`Owner: ${collector.collectorOwner}`);
            console.log(`Created: ${new Date(Number(collector.timestamp) * 1000).toLocaleString()}`);
            console.log("------------------");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
