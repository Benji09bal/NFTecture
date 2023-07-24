// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArchitectureNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplaceContract;
    event NFTMinted(uint256);

    struct NFTMetadata {
        string name;
        string category;
        string style;
        string description;
        string materialList;
        uint256 cost;
    }

    mapping(uint256 => NFTMetadata) private _nftMetadata;

    constructor(address _marketplaceContract) ERC721("YourNFTName", "YNFT") {
        marketplaceContract = _marketplaceContract;
    }

    function mint(
        string memory _name,
        string memory _category,
        string memory _style,
        string memory _description,
        string memory _materialList,
        uint256 _cost,
        string memory _tokenURI
    ) public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        setApprovalForAll(marketplaceContract, true);

        // Store the metadata of the NFT
        _nftMetadata[newTokenId] = NFTMetadata(
            _name,
            _category,
            _style,
            _description,
            _materialList,
            _cost
        );

        emit NFTMinted(newTokenId);
    }

    // Get the metadata of a specific NFT
    function getNFTMetadata(uint256 tokenId)
        public
        view
        returns (NFTMetadata memory)
    {
        return _nftMetadata[tokenId];
    }
}
