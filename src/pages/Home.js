import React, { useEffect, useState } from "react";
import { buyNFT, getAllOwners, getCurrentPrice } from "../utils/utility";
import { checkIfWalletIsConnected, connectWallet } from "../utils/common";
import Topi from "../abis/Topi.json";
import TopiContract from "../abis/contract-address.json";
import { ethers } from "ethers";

function Home() {
  const [currentAccount, setCurrentAccount] = useState(
    localStorage.getItem("currentAccount")
  );
  const [currentPrice, setCurrentPrice] = useState(0);
  const [allOwners, setAllOwners] = useState([]);
  const contractAddress = TopiContract.TopiContractAddr;
  const isMetamaskConnected = !!currentAccount;

  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount);
    getCurrentPrice(TopiContract.TopiContractAddr, Topi.abi).then((res) => {
      // console.log("currentPrice", res);
      setCurrentPrice(res);
      getAllOwners(TopiContract.TopiContractAddr, Topi.abi).then((res) => {
        if (res) {
          setAllOwners(res);
        }
      });
    });
    
  }, []);

  async function handleBuyNFT() {
    // setRequestLoading(true)
    if (!isMetamaskConnected) {
      connectWallet(setCurrentAccount);
    } else {
      await buyNFT(
        TopiContract.TopiContractAddr,
        Topi.abi,
        currentPrice.toString()
      );
      getCurrentPrice(TopiContract.TopiContractAddr, Topi.abi).then((res) => {
        setCurrentPrice(res);
      });
      getAllOwners(TopiContract.TopiContractAddr, Topi.abi).then((res) => {
        setAllOwners(res);
      });
    }
  }

  return (
    <>   <h1 style={{textAlign:"center", fontSize: "35px", color: "MenuText", padding: "20px" }}>
    Circulated NFT
  </h1>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
   
      <div>
      
      <div
        style={{
          border: "8px",
          borderColor: "grey",
          borderStyle: "solid",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img src="/images/daring-nft.jpg" height="auto" width="800px" />
        <div style={{ width: "800px", fontSize: "25px", textAlign: "center" }}>
          {currentPrice} Eth
        </div>
        <button
          style={{ width: "800px", fontSize: "25px" }}
          onClick={() => handleBuyNFT()}
          title="BUY NOW"
        >
          {isMetamaskConnected ? "BUY NOW" : "Connect Wallet"}
        </button>
      </div>
      <a target="_blank" href={`https://testnets.opensea.io/assets/rinkeby/${contractAddress}/1`}>View on OpenSea</a>
      </div>
      <div style={{align:"self",overflowY:"scroll", height:520, padding:5}}>
      <h2>Owners</h2>
      <div style={{backgroundColor:"#d0d0d0", padding:20}}>
        {allOwners.length > 0 &&
          allOwners.map((owner) => {
            return (
              <p key={allOwners.indexOf(owner)}>
                Address: {owner[0]}
                <br /> Timestamp:{" "}
                {ethers.utils.formatEther(owner[1]) * 10 ** 18}
                <hr />
              </p>
            );
          })}
          
      </div>
      </div>
      
    </div>
    <div style={{paddingLeft:"50%", backgroundColor:"#ffffff", color:"#979191"}}>
    <p style={{paddingTop:10, position:"absolute", bottom:0}}>Thanks! 😊</p>

    </div>
    </>
  );
}
export default Home;
