import { expect } from "chai";
import { ethers } from "hardhat";
import { Collector, Collector__factory } from "../typechain-types";
import { Signer } from "ethers";

describe("Collector", () => {
    let CollectorFactory: Collector__factory;
    let collector: Collector;
    let owner: Signer;
    let user1: Signer;
    let user2: Signer;

    const name = "Test Collector";
    const symbol = "TEST";
    const tokenURI = "https://test-uri.com/metadata";

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        // This is the correct way to get the factory
        const CollectorFactory = await ethers.getContractFactory("Collector");
        collector = await CollectorFactory.deploy(
            name,
            symbol,
            tokenURI,
            await owner.getAddress()
        ) as unknown as Collector;

        await collector.waitForDeployment();
    });

    describe("Deployment", () => {
        it("should set the correct name and symbol", async () => {
            expect(await collector.name()).to.equal(name);
            expect(await collector.symbol()).to.equal(symbol);
        });

        it("should set the correct owner", async () => {
            expect(await collector.owner()).to.equal(await owner.getAddress());
        });
    });

    describe("TokenURI", () => {
        it("should return the correct token URI after minting", async () => {
            await collector.safeMint(await user1.getAddress());
            expect(await collector.tokenURI(0)).to.equal(tokenURI);
        });

        it("should revert when querying URI for non-existent token", async () => {
            await expect(collector.tokenURI(0))
                .to.be.revertedWithCustomError(collector, "ERC721NonexistentToken")
                .withArgs(0);
        });
    });

    describe("Minting", () => {
        it("should mint tokens with sequential IDs", async () => {
            await collector.safeMint(await user1.getAddress());
            await collector.safeMint(await user2.getAddress());

            expect(await collector.ownerOf(0)).to.equal(await user1.getAddress());
            expect(await collector.ownerOf(1)).to.equal(await user2.getAddress());
        });

        it("should increment balances correctly", async () => {
            await collector.safeMint(await user1.getAddress());
            await collector.safeMint(await user1.getAddress());

            expect(await collector.balanceOf(await user1.getAddress())).to.equal(2);
        });

        it("should emit Transfer event", async () => {
            const userAddress = await user1.getAddress();
            await expect(collector.safeMint(userAddress))
                .to.emit(collector, "Transfer")
                .withArgs(ethers.ZeroAddress, userAddress, 0);
        });

        it("should allow minting multiple tokens", async () => {
            const userAddress = await user1.getAddress();

            await collector.safeMint(userAddress);
            await collector.safeMint(userAddress);
            await collector.safeMint(userAddress);

            expect(await collector.balanceOf(userAddress)).to.equal(3);
            expect(await collector.ownerOf(0)).to.equal(userAddress);
            expect(await collector.ownerOf(1)).to.equal(userAddress);
            expect(await collector.ownerOf(2)).to.equal(userAddress);
        });

        it("should allow anyone to mint (not just owner)", async () => {
            await collector.connect(user1).safeMint(await user2.getAddress());
            expect(await collector.ownerOf(0)).to.equal(await user2.getAddress());
        });
    });

    describe("ERC721 Standard Functionality", () => {
        beforeEach(async () => {
            // Mint a token to user1 for transfer tests
            await collector.safeMint(await user1.getAddress());
        });

        it("should allow token transfers", async () => {
            await collector.connect(user1).transferFrom(
                await user1.getAddress(),
                await user2.getAddress(),
                0
            );
            expect(await collector.ownerOf(0)).to.equal(await user2.getAddress());
        });

        it("should not allow unauthorized transfers", async () => {
            await expect(
                collector.connect(user2).transferFrom(
                    await user1.getAddress(),
                    await user2.getAddress(),
                    0
                )
            ).to.be.revertedWithCustomError(collector, "ERC721InsufficientApproval");
        });

        it("should handle approvals correctly", async () => {
            await collector.connect(user1).approve(await user2.getAddress(), 0);
            expect(await collector.getApproved(0)).to.equal(await user2.getAddress());

            // Should now allow transfer by approved address
            await collector.connect(user2).transferFrom(
                await user1.getAddress(),
                await user2.getAddress(),
                0
            );
            expect(await collector.ownerOf(0)).to.equal(await user2.getAddress());
        });

        it("should handle approval for all correctly", async () => {
            await collector.connect(user1).setApprovalForAll(await user2.getAddress(), true);
            expect(await collector.isApprovedForAll(
                await user1.getAddress(),
                await user2.getAddress()
            )).to.be.true;
        });
    });

    describe("Edge Cases", () => {
        it("should not allow minting to zero address", async () => {
            await expect(
                collector.safeMint(ethers.ZeroAddress)
            ).to.be.revertedWithCustomError(collector, "ERC721InvalidReceiver")
                .withArgs(ethers.ZeroAddress);
        });

        it("should handle non-sequential token queries correctly", async () => {
            await collector.safeMint(await user1.getAddress()); // token 0
            await expect(collector.tokenURI(1))
                .to.be.revertedWithCustomError(collector, "ERC721NonexistentToken")
                .withArgs(1);
        });
    });
});
