import React, { useEffect, useState } from "react";
import {buyNFT, getAllOwners, getCurrentPrice} from "../utils/utility"
import {checkIfWalletIsConnected, connectWallet } from "../utils/common"
import Topi from "../abis/Topi.json";
import TopiContract from "../abis/contract-address.json";

function Home() {

	const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));
	const [currentPrice, setCurrentPrice] = useState(0);

	const isMetamaskConnected = !!currentAccount;

	useEffect(() => {
		checkIfWalletIsConnected(setCurrentAccount);
		getCurrentPrice(
			TopiContract.TopiContractAddr,
			Topi.abi).then((res)=>{
			setCurrentPrice(res)

		})
		// getAllOwners(
		// 	TopiContract.TopiContractAddr,
		// 	Topi.abi
		// )
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
				currentPrice.toString()
			);
			getCurrentPrice(
				TopiContract.TopiContractAddr,
				Topi.abi,).then((res)=>{
				setCurrentPrice(res)
			})
			getAllOwners(
				TopiContract.TopiContractAddr,
				Topi.abi
			)
		}
	}

	return (
		<div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}} >
		<label style={{ fontSize:"35px", color:"MenuText", padding:"20px"}} >Circulated NFT</label>
		<div style={{border:"8px", borderColor:"grey", borderStyle:"solid", display:"flex", flexDirection:"column", }}>
			<img
			src="/images/daring-nft.jpg" height="auto" width="800px" />
				<div style={{width:"800px", fontSize:"25px", textAlign:"center"}} >
					{currentPrice} Eth</div>
				<button style={{width:"800px", fontSize:"25px"}} onClick={() => handleBuyNFT()}
				title="BUY NOW">{isMetamaskConnected ? "BUY NOW":"Connect Wallet"}</button>
		</div>
	</div>
	);
};
export default Home;