// SPDX-License-Identifier: MIT
/**
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Topi is ERC721 {
    event nftBought(address, uint256);
    uint8 constant tokenId = 0;
    string baseURI;
    address payable owner;
    uint256 ownerCounter;
    uint256 currentPrice;
    struct ownerDetail {
        address addressOfOwner;
        uint256 timeStamp;
    }
    mapping(uint256 => ownerDetail) allOwners;

    constructor(string memory _baseUri, uint256 _tokenId)
        payable
        ERC721("Topi", "TOPI")
    {
        owner = payable(msg.sender);
        baseURI = _baseUri;
        _safeMint(msg.sender, _tokenId);
        ownerCounter = 0;
        currentPrice = 1000000000000000000;
        updateOwners(ownerDetail(msg.sender, block.timestamp));
    }

    function _safeMint(address to, uint256 _tokenId) internal virtual override {
        _safeMint(to, _tokenId, "");
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function isBuyable() private view returns (bool) {
        uint256 startDate = getLastTransactionTimeStamp();
        uint256 timePassed = (block.timestamp - startDate) / 60;
        if (timePassed > 15) {
            return true;
        } else {
            return false;
        }
    }

    function getLastOwnerAddress() private view returns (address) {
        return allOwners[ownerCounter].addressOfOwner;
    }

    function getLastTransactionTimeStamp()
        private
        view
        returns (uint256 timeStamp)
    {
        return allOwners[ownerCounter].timeStamp;
    }

    function updateOwners(ownerDetail memory newOwnerDetail) private {
        allOwners[ownerCounter + 1] = newOwnerDetail;
        ownerCounter += 1;
    }

    function buyNft(uint256 amount) public payable virtual {
        require(
            isBuyable(),
            "ERC721: 15 min has not been passed from last transaction"
        );
        require(
            amount == currentPrice,
            "Ether sent should be equal to current Price"
        );
        _transfer(getLastOwnerAddress(), payable(msg.sender), tokenId);
        updateOwners(ownerDetail(msg.sender, block.timestamp));
        ownerCounter += 1;
        uint256 newPrice = ((10 * currentPrice) / 100) + currentPrice;
        owner.transfer(newPrice - currentPrice);
        currentPrice = newPrice;
        emit nftBought(msg.sender, msg.value);
    }

    function getCurrentOwner() public view returns (address, uint256) {
        return (
            allOwners[ownerCounter].addressOfOwner,
            allOwners[ownerCounter].timeStamp
        );
    }

    function getCurrentPrice() public view returns (uint256) {
        return currentPrice;
    }
}
