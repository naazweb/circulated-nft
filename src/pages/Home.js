import React, { useEffect, useState } from "react";
import {buyNFT} from "../utils/utility"
import {checkIfWalletIsConnected, connectWallet } from "../utils/common"
import Topi from "../abis/Topi.json";
import TopiContract from "../abis/contract-address.json";

function Home() {

	const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));

	const isMetamaskConnected = !!currentAccount;

	useEffect(() => {
		checkIfWalletIsConnected(setCurrentAccount);
	}, []);

	async function handleBuyNFT() {
		// setRequestLoading(true)
		if (!isMetamaskConnected)
		{
			connectWallet(setCurrentAccount)
		}
		else{
			await buyNFT(
				TopiContract.TopiContractAddr,
				Topi.abi,
				1000000000000000000
			);
		}
	}

	return (
		<div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}} >
		<label style={{ fontSize:"35px", color:"MenuText", padding:"20px"}} >Circulated NFT</label>
		<div style={{border:"8px", borderColor:"grey", borderStyle:"solid", display:"flex", flexDirection:"column", }}>
			<img
			src="/images/daring-nft.jpg" height="auto" width="800px" />
						
				<button style={{width:"800px", fontSize:"25px"}} onClick={() => handleBuyNFT()}
				title="BUY NOW">{isMetamaskConnected ? "BUY NOW":"Connect Wallet"}</button>
		</div>
	</div>
	);
};
export default Home;