const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const TopiContract = await hre.ethers.getContractFactory("Topi");
  // TODO: IPFS - get URI
  // const topi = await TopiContract.deploy("some_uri", 0);
  const topi = await TopiContract.deploy(
    "https://ipfs.io/ipfs/QmbwuizkDS1CEqXRJMQCdcTZqfDFrJqVQewQv1qFaJs5G4/",
    1
  );
  await topi.deployed();
  console.log(topi);
  console.log(`Topi deployed to address: ${topi.address}`);

  saveFrontendFiles(topi);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ TopiContractAddr: contract.address }, undefined, 2)
  );

  const TopiArtifact = artifacts.readArtifactSync("Topi");

  fs.writeFileSync(
    contractsDir + "/Topi.json",
    JSON.stringify(TopiArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
