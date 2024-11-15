import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying CollectorRegistry with account:", deployer.address);

    const Registry = await ethers.getContractFactory("CollectorRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();

    const registryAddress = await registry.getAddress();
    console.log("\nCollectorRegistry deployed to:", registryAddress);

    // Save deployment info
    const network = (await ethers.provider.getNetwork()).name;
    const deploymentPath = path.join(__dirname, '../deployments.json');

    let deployments = {};
    if (fs.existsSync(deploymentPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    }

    deployments[network] = {
        ...deployments[network],
        registry: registryAddress
    };

    fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
    console.log("\nRegistry address saved to deployments.json");
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
