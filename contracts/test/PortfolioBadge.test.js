const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PortfolioBadge ERC-1155 Contract", function () {
  let PortfolioBadge, badgeContract;
  let owner, serverSigner, explorer1, explorer2, fakeSigner;
  const URI = "https://api.portfolio.dev/metadata/{id}.json";
  const BADGE_ID = 1;

  beforeEach(async function () {
    [owner, serverSigner, explorer1, explorer2, fakeSigner] = await ethers.getSigners();
    PortfolioBadge = await ethers.getContractFactory("PortfolioBadge");
    badgeContract = await PortfolioBadge.deploy(URI, serverSigner.address);
    await badgeContract.waitForDeployment();
  });

  async function generateSignature(signer, recipientAddress, badgeId) {
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256"],
      [recipientAddress, badgeId]
    );
    // ethers signMessage handles the '\x19Ethereum Signed Message:\n32' prefix (ECDSA.toEthSignedMessageHash)
    return await signer.signMessage(ethers.getBytes(messageHash));
  }

  it("should deploy with correct initial state", async function () {
    expect(await badgeContract.serverSigner()).to.equal(serverSigner.address);
    expect(await badgeContract.uri(BADGE_ID)).to.equal(URI);
  });

  it("should mint badge successfully when provided valid server signature", async function () {
    const signature = await generateSignature(serverSigner, explorer1.address, BADGE_ID);

    await expect(badgeContract.connect(explorer1).mintWithSignature(BADGE_ID, signature))
      .to.emit(badgeContract, "BadgeMinted")
      .withArgs(explorer1.address, BADGE_ID);

    expect(await badgeContract.balanceOf(explorer1.address, BADGE_ID)).to.equal(1n);
    expect(await badgeContract.hasMinted(explorer1.address, BADGE_ID)).to.be.true;
  });

  it("should revert if user attempts to mint badge twice (replay prevention)", async function () {
    const signature = await generateSignature(serverSigner, explorer1.address, BADGE_ID);
    await badgeContract.connect(explorer1).mintWithSignature(BADGE_ID, signature);

    await expect(
      badgeContract.connect(explorer1).mintWithSignature(BADGE_ID, signature)
    ).to.be.revertedWith("Badge already claimed");
  });

  it("should revert if signature is signed by unauthorized key", async function () {
    const badSignature = await generateSignature(fakeSigner, explorer1.address, BADGE_ID);

    await expect(
      badgeContract.connect(explorer1).mintWithSignature(BADGE_ID, badSignature)
    ).to.be.revertedWith("Invalid signature");
  });

  it("should revert if signature is used by a different address", async function () {
    // Signature created for explorer1, but explorer2 submits it
    const signature = await generateSignature(serverSigner, explorer1.address, BADGE_ID);

    await expect(
      badgeContract.connect(explorer2).mintWithSignature(BADGE_ID, signature)
    ).to.be.revertedWith("Invalid signature");
  });

  it("should allow owner to update serverSigner", async function () {
    await expect(badgeContract.connect(owner).setServerSigner(explorer2.address))
      .to.emit(badgeContract, "ServerSignerUpdated")
      .withArgs(serverSigner.address, explorer2.address);

    expect(await badgeContract.serverSigner()).to.equal(explorer2.address);
  });
});
