const hre = require("hardhat");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET;
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const pinFileToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  data.append("file", fs.createReadStream("./public/images/daring-nft.jpg"));
  const res = await axios.post(url, data, {
    maxContentLength: "Infinity", 
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataApiKey, 
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });
  console.log(res.data);
  const metadata = {
    "name":"Topi",
    "image": "https://ipfs.io/ipfs/"+res.data.IpfsHash, 
    "description": "Aamir and Naazneen"
  }

  const meta_res = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, metadata, {
    maxContentLength: "Infinity", 
    headers: {
      pinata_api_key: pinataApiKey, 
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });
  console.log(meta_res.data)
  return "https://ipfs.io/ipfs/"+meta_res.data.IpfsHash
};


async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const uri = await pinFileToIPFS();

  const TopiContract = await hre.ethers.getContractFactory("Topi");
  console.log("deploying", uri)
  const topi = await TopiContract.deploy(uri, 0);
  console.log("topi", topi.address)
  await topi.deployed();
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
