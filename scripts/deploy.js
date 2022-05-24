const hre = require("hardhat");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET;
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
'use strict';




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
    "image": "https://ipfs.io/ipfs/"+res.data.IpfsHash, 
    "description": "First NFT Ever By Aiolos Team", 
  "external_url": "https://www.aiolos.solutions/", 
  "type":"image", 
  "name": "Topi",
  "attributes": [ {
    "creator" : "Aamir Shaikh"
  },{
    "creator" : "Nazneen probably shaikh"
  }  ]
  }

    
let metadata_json = JSON.stringify(metadata);
fs.writeFileSync('./public/metadata.json', metadata_json);
  let metadata_data = new FormData();
  metadata_data.append("file", fs.createReadStream("./public/metadata.json"), {filepath:"any-directory/1"});


  const meta_res = await axios.post(url, metadata_data, {
    maxContentLength: "Infinity", 
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,

      pinata_api_key: pinataApiKey, 
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });
  console.log(meta_res.data)
  return "https://ipfs.io/ipfs/"+meta_res.data.IpfsHash+"/"
};


async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const uri = await pinFileToIPFS();

  const TopiContract = await hre.ethers.getContractFactory("Topi");
  // const topi = await TopiContract.deploy(
  //   "https://ipfs.io/ipfs/QmbwuizkDS1CEqXRJMQCdcTZqfDFrJqVQewQv1qFaJs5G4/",
  //   1
  // );
  console.log("deploying", uri)
  const topi = await TopiContract.deploy(uri, 1);
  console.log("topi", topi.address)
  await topi.deployed();
  // console.log(topi);
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
