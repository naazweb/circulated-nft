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
			let transaction = await topiContract.buyNft({value: amount});
			let receipt = await transaction.wait();
			console.log(receipt);
		} catch (err) {
			console.log(err);
		}
	}
}

export async function getCurrentPrice(contractAddr, artifact) {
	if (typeof window.ethereum != undefined) {
		await requestAccount();

		const topiContract = getSignedContract(contractAddr, artifact);
		try {
			let transaction = await topiContract.getCurrentPrice({gasLimit:12400500 });
			return transaction/(10**18)
		} catch (err) {
			console.log(err);
		}
	}
}

export async function getAllOwners(contractAddr, artifact) {
	if (typeof window.ethereum != undefined) {
		await requestAccount();

		const topiContract = getSignedContract(contractAddr, artifact);
		try {
			let transaction = await topiContract.getAllOwners({gasLimit:12450000});
			return transaction
		} catch (err) {
			console.log(err);
		}
	}
}
