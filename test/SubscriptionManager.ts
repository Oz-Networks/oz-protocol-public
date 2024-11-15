import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import {
  SubscriptionManager,
  ERC721Mock,
} from "../typechain-types";

describe("SubscriptionManager", () => {
  let subscriptionContract: SubscriptionManager;
  let nft: ERC721Mock;
  let owner: Signer;
  let dataProvider1: Signer;
  let subscriber1: Signer;
  let currentTokenId: number = 0;  // Track token ID

  const feePerDay = ethers.parseEther("1");
  const collectorFee = ethers.parseEther("0.2");

  before(async () => {
    [owner, dataProvider1, subscriber1] = await ethers.getSigners();

    // Deploy a mock ERC721 contract
    const ERC721MockFactory = await ethers.getContractFactory("ERC721Mock");
    nft = await ERC721MockFactory.deploy("MockNFT", "MNFT") as unknown as ERC721Mock;
    await nft.waitForDeployment();
  });

  beforeEach(async () => {
    // Increment token ID for each test to ensure uniqueness
    currentTokenId++;

    // Deploy a fresh SubscriptionManager instance
    const SubscriptionManagerFactory = await ethers.getContractFactory("SubscriptionManager");
    subscriptionContract = await SubscriptionManagerFactory.deploy(
        await owner.getAddress(),
        await nft.getAddress(),
        feePerDay,
        collectorFee
    ) as unknown as SubscriptionManager;
    await subscriptionContract.waitForDeployment();

    // Set initial fees
    await subscriptionContract.connect(owner).setCollectorFee(collectorFee);
    await subscriptionContract.connect(owner).setFeePerDay(feePerDay);

    try {
      // Try to burn the token if it exists (ignore errors)
      try {
        await nft.connect(owner).burn(currentTokenId).catch(() => {});
      } catch {}

      // Mint new NFT to dataProvider1
      const dataProvider1Address = await dataProvider1.getAddress();
      console.log(`Minting new token ${currentTokenId} to ${dataProvider1Address}`);

      const mintTx = await nft.connect(owner).mint(dataProvider1Address, currentTokenId);
      await mintTx.wait();

      // Verify the mint
      const nftBalance = await nft.balanceOf(dataProvider1Address);
      const nftOwner = await nft.ownerOf(currentTokenId);

      console.log("Verification after mint:");
      console.log("Token ID:", currentTokenId);
      console.log("NFT Balance:", nftBalance.toString());
      console.log("NFT Owner:", nftOwner);
      console.log("Expected Owner:", dataProvider1Address);

    } catch (error) {
      console.error("Error in beforeEach:", error);
      throw error;
    }
  });

  // Optional: Clean up after all tests
  after(async () => {
    // Try to burn all tokens that might have been created
    for (let i = 1; i <= currentTokenId; i++) {
      try {
        await nft.connect(owner).burn(i).catch(() => {});
      } catch {}
    }
  });

  describe("subscribe", () => {
    it("should subscribe successfully", async () => {
      const dataProvider1Address = await dataProvider1.getAddress();

      // Verify NFT ownership before subscription
      const nftBalance = await nft.balanceOf(dataProvider1Address);
      console.log("NFT Balance before subscribe:", nftBalance.toString());
      console.log("Using token ID:", currentTokenId);

      const currentTime = Math.floor(Date.now() / 1000);
      const days = 10;
      const endTime = currentTime + (days * 24 * 60 * 60);

      const providerFee = feePerDay * BigInt(days);
      const totalFee = providerFee + collectorFee;

      // Subscribe
      const subscribeTx = await subscriptionContract.connect(subscriber1).subscribe(
          dataProvider1Address,
          "RecipientName",
          endTime,
          { value: totalFee }
      );

      await subscribeTx.wait();

      // Verify subscription
      const subscribers = await subscriptionContract.getSubscribers(dataProvider1Address);
      expect(subscribers.length).to.equal(1);
      expect(subscribers[0].subscriber).to.equal(await subscriber1.getAddress());
      expect(subscribers[0].recipient).to.equal("RecipientName");
    });

    it("should fail to subscribe with insufficient fee", async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const endTime = currentTime + 2 * 24 * 60 * 60; // 2 days from now

      await expect(
          subscriptionContract.connect(subscriber1).subscribe(
              await dataProvider1.getAddress(),
              "RecipientName",
              endTime,
              { value: ethers.parseEther("1") } // Insufficient fee
          )
      ).to.be.revertedWithCustomError(subscriptionContract, "LessSubscriptionFeeSent");
    });

    it("should fail to subscribe with short subscription period", async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const endTime = currentTime + 3600; // Less than a day

      await expect(
          subscriptionContract.connect(subscriber1).subscribe(
              await dataProvider1.getAddress(),
              "RecipientName",
              endTime,
              { value: ethers.parseEther("2") }
          )
      ).to.be.revertedWithCustomError(subscriptionContract, "SubscriptionPeriodTooShort");
    });
  });
});
