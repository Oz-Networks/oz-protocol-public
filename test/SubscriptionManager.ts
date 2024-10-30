import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("SubscriptionManager", () => {
  let SubscriptionManagerContract: any;
  let manager: any;
  let owner: any;
  let dataProvider1: any;
  let dataProvider2: any;
  let subscriber1: any;
  let subscriber2: any;
  let nft: any;

  const feePerDay = ethers.parseEther("1");
  const collectorFee = ethers.parseEther("0.2");

  before(async () => {
    [owner, dataProvider1, dataProvider2, subscriber1, subscriber2] = await ethers.getSigners();

    // Deploy a mock ERC721 contract
    const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
    nft = await ERC721Mock.deploy("MockNFT", "MNFT");

    // Deploy the SubscriptionManager contract
    SubscriptionManagerContract = await ethers.getContractFactory("SubscriptionManager");
  });

  describe("constructor", () => {
    it("should fail to create contract for invalid args", async () => {
      await expect(
        SubscriptionManagerContract.deploy(
          owner.address,
          ethers.ZeroAddress,
          feePerDay,
          collectorFee
        )).to.be.revertedWithCustomError(SubscriptionManagerContract, "ZeroAddress");
    });

    it("should set variables", async () => {
      await nft.connect(owner).mint(owner.address, 1);

      manager = await SubscriptionManagerContract.deploy(
        owner.address,
        nft.target,
        feePerDay,
        collectorFee
      );

      expect(await manager.owner()).to.be.eq(owner.address);
      expect(await manager.nft()).to.be.eq(nft.target);
      expect(await manager.feePerDay()).to.be.eq(feePerDay);
      expect(await manager.collectorFee()).to.be.eq(collectorFee);
    });
  });

  describe("setFeePerDay", () => {
    it("should fail to set feePerDay as non-owner", async () => {
      await expect(manager.connect(subscriber1).setFeePerDay(feePerDay * 2n))
        .to.be.revertedWithCustomError(manager, "OwnableUnauthorizedAccount");
    });

    it("should set feePerDay as owner", async () => {
      await expect(manager.connect(owner).setFeePerDay(feePerDay * 2n))
        .to.emit(manager, "FeePerDayUpdated");

      expect(await manager.feePerDay()).to.be.eq(feePerDay * 2n);

      await manager.connect(owner).setFeePerDay(feePerDay);
    });
  });

  describe("setCollectorFee", () => {
    it("should fail to set collectorFee as non-owner", async () => {
      await expect(manager.connect(subscriber1).setCollectorFee(collectorFee * 2n))
        .to.be.revertedWithCustomError(manager, "OwnableUnauthorizedAccount");
    });

    it("should set collectorFee as owner", async () => {
      await expect(manager.connect(owner).setCollectorFee(collectorFee * 2n))
        .to.emit(manager, "CollectorFeeUpdated");

      expect(await manager.collectorFee()).to.be.eq(collectorFee * 2n);

      await manager.connect(owner).setCollectorFee(collectorFee);
    });
  });

  describe("subscribe", () => {
    it("should fail to subscribe to invalid data provider", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await expect(manager.connect(subscriber1).subscribe(dataProvider1.address, "recipient1", endTime))
        .to.be.revertedWithCustomError(manager, "InvalidDataProvider");
    });

    it("should subscribe for a minimum duration", async () => {
      await nft.mint(dataProvider1.address, 2);
      const endTime = Math.floor(Date.now() / 1000) + 3600
      await expect(manager.connect(subscriber1).subscribe(dataProvider1.address, "recipient1", endTime))
        .to.be.revertedWithCustomError(manager, "SubscriptionPeriodTooShort");
    });

    it("should send enough value for fee", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await expect(manager.connect(subscriber1).subscribe(dataProvider1.address, "recipient1", endTime))
        .to.be.revertedWithCustomError(manager, "LessSubscriptionFeeSent");
    });

    it("should subscribe", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await expect(manager.connect(subscriber1).subscribe(dataProvider1.address, "recipient1", endTime, { value: ethers.parseEther("2.5") }))
        .to.emit(manager, "SubscriptionCreated");
    });

    it("should fail to subscribe twice", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await expect(manager.connect(subscriber1).subscribe(dataProvider1.address, "recipient1", endTime))
        .to.be.revertedWithCustomError(manager, "AlreadySubscribed");
    });
  });

  describe("renewSubscription", () => {
    it("should fail to renew subscription to invalid data provider", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await expect(manager.connect(subscriber1).renewSubscription(dataProvider2.address, "recipient1", endTime, 80))
        .to.be.revertedWithCustomError(manager, "InvalidDataProvider");
    });

    it("should renew subscription for a minimum duration", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2 + 3600;
      await expect(manager.connect(subscriber1).renewSubscription(dataProvider1.address, "recipient1", endTime, 80))
        .to.be.revertedWithCustomError(manager, "SubscriptionPeriodTooShort");
    });

    it("should renew existing subscription", async () => {
      await nft.mint(dataProvider2.address, 3);
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 4;
      await expect(manager.connect(subscriber1).renewSubscription(dataProvider2.address, "recipient1", endTime, 80))
        .to.be.revertedWithCustomError(manager, "SubscriptionNotFound");
    });

    it("should send enough value for fee", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 4;
      await expect(manager.connect(subscriber1).renewSubscription(dataProvider1.address, "recipient1", endTime, 80))
        .to.be.revertedWithCustomError(manager, "LessSubscriptionFeeSent");
    });

    it("should renew subscription", async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 4;
      await expect(manager.connect(subscriber1).renewSubscription(dataProvider1.address, "recipient1", endTime, 80, { value: ethers.parseEther("2.5") }))
        .to.emit(manager, "SubscriptionRenewed");
    });
  });

  describe("cancelSubscription", () => {
    it("should fail to cancel subscription to invalid data provider", async () => {
      await expect(manager.connect(subscriber1).cancelSubscription(subscriber2.address, 20))
        .to.be.revertedWithCustomError(manager, "InvalidDataProvider");
    });

    it("should cancel existing subscription", async () => {
      await expect(manager.connect(subscriber2).cancelSubscription(dataProvider1.address, 30))
        .to.be.revertedWithCustomError(manager, "SubscriptionNotFound");
    });

    it("should cancel subscription", async () => {
      await expect(manager.connect(subscriber1).cancelSubscription(dataProvider1.address, 30))
        .to.emit(manager, "SubscriptionCancelled");
    });
  });

  describe("endSubscription", () => {
    before(async () => {
      const endTime = Math.floor(Date.now() / 1000) + 86400 * 2;
      await manager.connect(subscriber2).subscribe(dataProvider2.address, "recipient2", endTime, { value: ethers.parseEther("2.5") });
    });

    it("should end existing subscription", async () => {
      await expect(manager.connect(subscriber2).endSubscription(dataProvider1.address, 30))
        .to.be.revertedWithCustomError(manager, "SubscriptionNotFound");
    });

    it("should fail to end subscription while subscription is active", async () => {
      await expect(manager.connect(subscriber2).endSubscription(dataProvider2.address, 30))
        .to.be.revertedWithCustomError(manager, "ActiveSubscription");
    });

    it("should end subscription", async () => {
      await network.provider.send("evm_increaseTime", [86400 * 2]);
      await network.provider.send("evm_mine");

      await expect(manager.connect(subscriber2).endSubscription(dataProvider2.address, 30))
        .to.emit(manager, "SubscriptionEnded");
    });
  });
});
