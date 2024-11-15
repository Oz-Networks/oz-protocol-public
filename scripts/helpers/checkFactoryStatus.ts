import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const network = (await ethers.provider.getNetwork()).name;
    const deploymentPath = path.join(__dirname, '../../deployments.json');
    const deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

    const registryAddress = deployments[network]?.registry;
    if (!registryAddress) {
        console.log("Registry not deployed on this network");
        return;
    }

    const registry = await ethers.getContractAt("CollectorRegistry", registryAddress);
    const currentFactory = await registry.currentFactory();
    const factoryHistory = await registry.getFactoryHistory();

    console.log("\nCurrent Factory:", currentFactory);
    console.log("\nFactory History:");
    console.log("----------------");

    for (const factory of factoryHistory) {
        console.log(`Address: ${factory.factoryAddress}`);
        console.log(`Deployed: ${new Date(Number(factory.timestamp) * 1000).toLocaleString()}`);
        console.log(`Version: ${factory.version}`);
        console.log(`Active: ${factory.active}`);
        console.log("----------------");
    }
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
