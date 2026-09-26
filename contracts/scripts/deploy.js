const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying PortfolioBadge with account:", deployer.address);

  const serverSigner = process.env.SERVER_SIGNER_ADDRESS || deployer.address;
  const metadataUri = process.env.METADATA_URI || "https://portfolio.web3/api/metadata/{id}.json";

  const PortfolioBadge = await hre.ethers.getContractFactory("PortfolioBadge");
  const badge = await PortfolioBadge.deploy(metadataUri, serverSigner);
  await badge.waitForDeployment();

  const contractAddress = await badge.getAddress();
  console.log("----------------------------------------------------");
  console.log("PortfolioBadge deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Server Signer Address:", serverSigner);
  console.log("Metadata URI:", metadataUri);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
