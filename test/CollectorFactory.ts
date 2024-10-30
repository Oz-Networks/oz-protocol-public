import { expect } from "chai";
import hre from "hardhat";

describe("CollectorFactory", function () {
  let collectorFactory: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let nft: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    // Deploy a mock ERC721 contract
    const ERC721Mock = await hre.ethers.getContractFactory("ERC721Mock");
    nft = await ERC721Mock.deploy("MockNFT", "MNFT");

    // Deploy the CollectorFactory contract
    const CollectorFactoryContract = await hre.ethers.getContractFactory("CollectorFactory");
    collectorFactory = await CollectorFactoryContract.deploy();
    await collectorFactory.handleReputationProvider(owner.address, true);
  });

  describe("handleCollectorCreator", function () {
    it("Should add and remove a creator for collectors", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      let isCreator = await collectorFactory.creatorList(addr1.address);
      expect(isCreator).to.equal(true);

      await collectorFactory.handleCollectorCreator(addr1.address, false);
      isCreator = await collectorFactory.creatorList(addr1.address);
      expect(isCreator).to.equal(false);
    });
  });

  describe("createCollector", function () {
    it("Should revert if the collector is not whitelisted", async function () {
      const feePerDay = 100;
      const collectorFee = 50;
      await expect(collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee))
        .to.be.revertedWithCustomError(collectorFactory, 'InvalidCreator');
    });
    it("Should create a new collector and emit CollectorCreated event", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      const feePerDay = 100;
      const collectorFee = 50;
      await expect(collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee))
        .to.emit(collectorFactory, "CollectorCreated");

      const collectorInfo = await collectorFactory.collectorList(await collectorFactory.collectors(0));
      expect(collectorInfo.collectorOwner).to.equal(addr1.address);
      expect(collectorInfo.validity).to.equal(true);
    });
  });

  describe("requestReputation", function () {
    it("Should allow a collector to request reputation", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      const feePerDay = 100;
      const collectorFee = 50;

      await collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee);
      const collectorAddress = await collectorFactory.collectors(0);

      await collectorFactory.connect(addr1).requestReputation(collectorAddress, addr2.address);

      const request = await collectorFactory.reputationRequest(collectorAddress, addr2.address);
      expect(request).to.equal(true);
    });

    it("Should revert if the collector is not found", async function () {
      await expect(collectorFactory.connect(addr1).requestReputation(owner.address, addr2.address))
        .to.be.revertedWithCustomError(collectorFactory, 'CollectorNotFound');
    });
  });

  describe("storeReputationScore", function () {
    it("Should store the reputation score", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      const feePerDay = 100;
      const collectorFee = 50;

      await collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee);
      const collectorAddress = await collectorFactory.collectors(0);

      await collectorFactory.connect(addr1).requestReputation(collectorAddress, addr2.address);
      await collectorFactory.storeReputationScore(collectorAddress, addr2.address, 80);

      const score = await collectorFactory.reputationScores(collectorAddress, addr2.address);
      expect(score).to.equal(80);
    });

    it("Should revert if the request is not found", async function () {
      await expect(collectorFactory.storeReputationScore(addr1.address, addr2.address, 80))
        .to.be.revertedWithCustomError(collectorFactory, "ReputationRequestNotFound");
    });

    it("Should revert if the caller is not a reputation provider", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      const feePerDay = 100;
      const collectorFee = 50;

      await collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee);
      const collectorAddress = await collectorFactory.collectors(0);

      await collectorFactory.connect(addr1).requestReputation(collectorAddress, addr2.address);
      await expect(collectorFactory.connect(addr2).storeReputationScore(collectorAddress, addr2.address, 80))
        .to.be.revertedWithCustomError(collectorFactory, "InvalidProvider");
    });
  });

  describe("listCollectorsByValidation", function () {
    it("Should return a list of collectors by validation status", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      await collectorFactory.handleCollectorCreator(addr2.address, true);
      const feePerDay = 100;
      const collectorFee = 50;

      await collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee);
      await collectorFactory.connect(addr2).createCollector(nft.target, feePerDay, collectorFee);

      const validCollectors = await collectorFactory.listCollectorsByValidation(true);
      expect(validCollectors.length).to.equal(2);

      // Mark one collector as invalid
      const collectorAddress = await collectorFactory.collectors(0);

      await expect(collectorFactory.connect(owner).handleCollectorValidity(collectorAddress, false))
        .to.emit(collectorFactory, "CollectorValidityChanged");

      const updatedValidCollectors = await collectorFactory.listCollectorsByValidation(true);
      expect(updatedValidCollectors.length).to.equal(1);
    });
  });

  describe("handleReputationProvider", function () {
    it("Should add and remove a reputation provider", async function () {
      await collectorFactory.handleReputationProvider(addr1.address, true);
      let isProvider = await collectorFactory.reputationProviders(addr1.address);
      expect(isProvider).to.equal(true);

      await collectorFactory.handleReputationProvider(addr1.address, false);
      isProvider = await collectorFactory.reputationProviders(addr1.address);
      expect(isProvider).to.equal(false);
    });
  });

  describe("getReputationScore", function () {
    it("Should return the reputation score", async function () {
      await collectorFactory.handleCollectorCreator(addr1.address, true);
      const feePerDay = 100;
      const collectorFee = 50;

      await collectorFactory.connect(addr1).createCollector(nft.target, feePerDay, collectorFee);
      const collectorAddress = await collectorFactory.collectors(0);

      await collectorFactory.connect(addr1).requestReputation(collectorAddress, addr2.address);
      await collectorFactory.storeReputationScore(collectorAddress, addr2.address, 80);

      const score = await collectorFactory.getReputationScore(collectorAddress, addr2.address);
      expect(score).to.equal(80);
    });
  });
});
