import { ethers } from "ethers";
import { requestAccount, getSignedContract } from "./common";

// SmartContract function calls

export async function buyNFT(contractAddr, artifact, amount) {
	if (typeof window.ethereum != undefined) {
		await requestAccount();

		const topiContract = getSignedContract(contractAddr, artifact);
		try {

			let transaction = await topiContract.buyNft(amount);

			let receipt = await transaction.wait();
			console.log(receipt);
		} catch (err) {
			console.log(err);
		}
	}
}
