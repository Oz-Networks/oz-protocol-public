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

async function setCollectorValidity() {
    const factory = await getFactory();
    const collector = process.env.COLLECTOR_ADDRESS;
    const validity = process.env.VALIDITY === 'true';

    if (!collector) {
        throw new Error("Please provide COLLECTOR_ADDRESS in .env");
    }

    const tx = await factory.handleCollectorValidity(collector, validity);
    await tx.wait();
    console.log(`Set collector ${collector} validity to: ${validity}`);
}

setCollectorValidity().catch(console.error);
