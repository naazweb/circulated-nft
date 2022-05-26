import { ethers } from "ethers";
import { requestAccount, getSignedContract } from "./common";
// import { web3 } from "web3";

// SmartContract function calls

export async function buyNFT(contractAddr, artifact, amount) {
  if (typeof window.ethereum != undefined) {
    await requestAccount();

    const topiContract = getSignedContract(contractAddr, artifact);
    try {
      amount = ethers.utils.parseEther(amount);
      let transaction = await topiContract.buyNft({ value: amount });
      let receipt = await transaction.wait();
      console.log(receipt);
    } catch (err) {
      if (err.code === "INSUFFICIENT_FUNDS"){
        alert("You don't have sufficient balance. Please get Rinkeby Eth.")
      }
      else{
        alert("30 Seconds has not passed since last transaction. Please wait.")
      }
  }
  }
}

export async function getCurrentPrice(contractAddr, artifact) {
  await requestAccount();

  const topiContract = getSignedContract(contractAddr, artifact);
  try {
    // console.log(topiContract);
    let transaction = await topiContract.getCurrentPrice();
    // console.log("Transaction", transaction);
    return transaction / 10 ** 18;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllOwners(contractAddr, artifact) {
  if (typeof window.ethereum != undefined) {
    await requestAccount();

    const topiContract = getSignedContract(contractAddr, artifact);
    try {
      let transaction = await topiContract.getAllOwners();
      return transaction;
    } catch (err) {
      console.log(err);
    }
  }
}
