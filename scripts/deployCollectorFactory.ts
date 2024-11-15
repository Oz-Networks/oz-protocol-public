import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying new CollectorFactory with account:", deployer.address);

    // Load versions and deployments
    const versionsPath = path.join(__dirname, '../versions.json');
    const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
    const deploymentPath = path.join(__dirname, '../deployments.json');
    const deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

    const network = (await ethers.provider.getNetwork()).name;
    const registryAddress = deployments[network]?.registry;

    if (!registryAddress) {
        throw new Error("Registry not deployed. Please deploy registry first.");
    }

    // Deploy new factory
    const CollectorFactory = await ethers.getContractFactory("CollectorFactory");
    const factory = await CollectorFactory.deploy();
    await factory.waitForDeployment();

    const factoryAddress = await factory.getAddress();
    console.log("\nNew CollectorFactory deployed to:", factoryAddress);

    // Update registry
    const registry = await ethers.getContractAt("CollectorRegistry", registryAddress);
    await registry.updateFactory(factoryAddress, versions.contracts.CollectorFactory);
    console.log("Registry updated with new factory address");

    // Update deployments.json
    if (!deployments[network].factories) {
        deployments[network].factories = [];
    }

    deployments[network].factories.push({
        address: factoryAddress,
        version: versions.contracts.CollectorFactory,
        subscriptionManagerVersion: versions.contracts.SubscriptionManager,
        deployedAt: new Date().toISOString(),
        deployedBy: deployer.address
    });

    fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
    console.log("\nDeployment info saved to deployments.json");
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
