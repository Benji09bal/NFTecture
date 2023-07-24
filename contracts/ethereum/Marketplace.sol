 // SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsSold;
    Counters.Counter private _nftCount;
    uint256 public LISTING_FEE = 0.0001 ether;
    address payable private _marketOwner;
    mapping(uint256 => NFT) private _idToNFT;
    mapping(address => Architect) public architects;
    mapping(address => Client) public clients;
    mapping(string => address) public profileNames;
    
   

    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
    }

    struct Architect {
        string name;
        string surname;
        string country;
        string education;
        string experience;
        string socialMediaUrl;
        string profileName;
        string collectionName;
        string collectionSymbol;
        mapping(uint256 => NFT) nfts;
        mapping(uint256 => bool) nftExists;
        uint256[] nftIds;
    }

    struct Client {
        string name;
        string surname;
        string country;
        string profileName;
        mapping(uint256 => NFT) ownedNFTs;
        mapping(uint256 => bool) nftOwned;
    }

    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );
    event NFTSold(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event Withdrawn(uint256 amount);

    constructor() {
        _marketOwner = payable(msg.sender);
    }

    function resetProfiles() external {
        require(msg.sender == _marketOwner, "Only the market owner can reset profiles");
        for (uint256 i = 0; i < _nftCount.current(); i++) {
            delete architects[_idToNFT[i + 1].owner];
            delete clients[_idToNFT[i + 1].owner];
        }
        _nftCount.reset();
        _nftsSold.reset();
    }

function authenticateUser() public {
    address userAddress = msg.sender;
    string memory profileType = "";

    // Check if the user is already registered as an architect
    if (bytes(architects[userAddress].profileName).length > 0) {
        profileType = "architect";
    }
    // Check if the user is already registered as a client
    else if (bytes(clients[userAddress].profileName).length > 0) {
        profileType = "client";
    }

    // If the user is not registered, no action is needed
    // They will be prompted to choose their profile type on the front-end

    // Emit an event to notify the front-end about the authentication result
    emit UserAuthenticated(userAddress, profileType);
}

event UserAuthenticated(address indexed userAddress, string profileType);


    function createArchitectProfile(
        string memory _name,
        string memory _surname,
        string memory _country,
        string memory _education,
        string memory _experience,
        string memory _socialMediaUrl,
        string memory _profileName,
        string memory _collectionName,
        string memory _collectionSymbol
    ) public {
        Architect storage architect = architects[msg.sender];
        require(bytes(architect.profileName).length == 0, "Architect profile already exists");

        architect.name = _name;
        architect.surname = _surname;
        architect.country = _country;
        architect.education = _education;
        architect.experience = _experience;
        architect.socialMediaUrl = _socialMediaUrl;
        architect.profileName = _profileName;
        architect.collectionName = _collectionName;
        architect.collectionSymbol = _collectionSymbol;
    }

    function createClientProfile(
        string memory _name,
        string memory _surname,
        string memory _country,
        string memory _profileName
    ) public {
        Client storage client = clients[msg.sender];
        require(bytes(client.profileName).length == 0, "Client profile already exists");

        client.name = _name;
        client.surname = _surname;
        client.country = _country;
        client.profileName = _profileName;
    }

  // List the NFT on the marketplace
  function listNft(address _nftContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
    _marketOwner.transfer(LISTING_FEE);
    _nftCount.increment();

    _idToNFT[_tokenId] = NFT(
      _nftContract,
      _tokenId, 
      payable(msg.sender),
      payable(address(this)),
      _price,
      true
    );

    emit NFTListed(_nftContract, _tokenId, msg.sender, address(this), _price);
  }

  // Buy an NFT
  function buyNft(address _nftContract, uint256 _tokenId) public payable nonReentrant {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.value >= nft.price, "Not enough ether to cover asking price");

    address payable buyer = payable(msg.sender);
    payable(nft.seller).transfer(msg.value);
    IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
    nft.owner = buyer;
    nft.listed = false;

    _nftsSold.increment();
    emit NFTSold(_nftContract, nft.tokenId, nft.seller, buyer, msg.value);
  }

  // Resell an NFT purchased from the marketplace
  function resellNft(address _nftContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

    NFT storage nft = _idToNFT[_tokenId];
    nft.seller = payable(msg.sender);
    nft.owner = payable(address(this));
    nft.listed = true;
    nft.price = _price;

    _nftsSold.decrement();
    emit NFTListed(_nftContract, _tokenId, msg.sender, address(this), _price);
  }

 function withdrawContractBalance() public {
    require(msg.sender == _marketOwner, "Only the marketplace owner can withdraw contract balance");
    uint256 balanceToWithdraw = address(this).balance;
    payable(_marketOwner).transfer(balanceToWithdraw);
    emit Withdrawn(balanceToWithdraw);
}


function getListingFee() public view returns (uint256) {
    return LISTING_FEE;
}


  function getListedNfts() public view returns (NFT[] memory) {
    uint256 nftCount = _nftCount.current();
    uint256 unsoldNftsCount = nftCount - _nftsSold.current();

    NFT[] memory nfts = new NFT[](unsoldNftsCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].listed) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyListedNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed) {
        myListedNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

 function getClientNfts(address clientAddress) public view returns (NFT[] memory) {
        Client storage client = clients[clientAddress];
        require(bytes(client.profileName).length > 0, "Client profile not found");

        uint256 nftCount = _nftCount.current();
        uint256 clientNftCount = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == clientAddress) {
                clientNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](clientNftCount);
        uint256 nftsIndex = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == clientAddress) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getClientListedNfts(address clientAddress) public view returns (NFT[] memory) {
        Architect storage architect = architects[clientAddress];
        require(bytes(architect.profileName).length > 0, "Architect profile not found");

        uint256 nftCount = architect.nftIds.length;
        uint256 clientListedNftCount = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            uint256 tokenId = architect.nftIds[i];
            if (architect.nfts[tokenId].listed) {
                clientListedNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](clientListedNftCount);
        uint256 nftsIndex = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            uint256 tokenId = architect.nftIds[i];
            if (architect.nfts[tokenId].listed) {
                nfts[nftsIndex] = architect.nfts[tokenId];
                nftsIndex++;
            }
        }
        return nfts;
    }
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

