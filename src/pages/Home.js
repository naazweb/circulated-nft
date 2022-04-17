
function Home() {
	return (
		<div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}} >
		<label style={{ fontSize:"35px", color:"MenuText", padding:"20px"}} >Circulated NFT</label>
		<div style={{border:"8px", borderColor:"grey", borderStyle:"solid", display:"flex", flexDirection:"column", }}>
			<img
			src="/images/daring-nft.jpg" height="auto" width="800px" />
			<button style={{width:"800px", fontSize:"25px"}} title="BUY NOW">BUY NOW</button>
		</div>
	</div>
	);
};
export default Home;