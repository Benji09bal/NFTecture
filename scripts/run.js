const ArchitectureNFT = artifacts.require("ArchitectureNFT");
const Marketplace = artifacts.require("Marketplace");

async function createArchitectProfileIfNotExists(marketplace, profileData) {
  try {
    await marketplace.createArchitectProfile(...profileData);
    console.log(`Architect profile created: ${profileData[6]} - ${profileData[7]}`);
  } catch (err) {
    console.log(`Architect profile not created: ${profileData[6]} - ${profileData[7]}`);
  }
}

async function createClientProfileIfNotExists(marketplace, profileData) {
  try {
    await marketplace.createClientProfile(...profileData);
    console.log(`Client profile created: ${profileData[3]} - ${profileData[4]}`);
  } catch (err) {
    console.log(`Client profile not created: ${profileData[3]} - ${profileData[4]}`);
  }
}

module.exports = async function (callback) {
  try {
    const architecture = await ArchitectureNFT.deployed();
    const marketplace = await Marketplace.deployed();

    console.log('RESET PROFILES');
    await marketplace.resetProfiles();

    console.log('CREATE ARCHITECT PROFILES');

    const architectProfiles = [
      // Profile 1
      [
        "John",
        "Doe",
        "Country",
        "Education",
        "Experience",
        "Social Media URL",
        "Profile Name 1",
        "Collection Name",
        "Collection Symbol"
      ],
      // Profile 2
      [
        "Alice",
        "Smith",
        "Country",
        "Education",
        "Experience",
        "Social Media URL",
        "Profile Name 2",
        "Collection Name",
        "Collection Symbol"
      ],
      // Profile 3
      [
        "Bob",
        "Johnson",
        "Country",
        "Education",
        "Experience",
        "Social Media URL",
        "Profile Name 3",
        "Collection Name",
        "Collection Symbol"
      ]
    ];

    for (let i = 0; i < architectProfiles.length; i++) {
      await createArchitectProfileIfNotExists(marketplace, architectProfiles[i]);
    }

    console.log('CREATE CLIENT PROFILES');

    const clientProfiles = [
      // Profile 1
      [
        "Jane",
        "Doe",
        "Country",
        "jane_doe",
        web3.eth.accounts.create().address
      ],
      // Profile 2
      [
        "Emma",
        "Johnson",
        "Country",
        "emma_johnson",
        web3.eth.accounts.create().address
      ],
      // Profile 3
      [
        "Michael",
        "Smith",
        "Country",
        "michael_smith",
        web3.eth.accounts.create().address
      ]
    ];

    for (let i = 0; i < clientProfiles.length; i++) {
      await createClientProfileIfNotExists(marketplace, clientProfiles[i]);
    }

    async function logNftLists(marketplace) {
      let listedNfts = await marketplace.getListedNfts();
      const accounts = await web3.eth.getAccounts();
      const accountAddress = accounts[0];
      let myNfts = await marketplace.getMyNfts({ from: accountAddress });
      let myListedNfts = await marketplace.getMyListedNfts({ from: accountAddress });
      console.log(`listedNfts: ${listedNfts.length}`);
      console.log(`myNfts: ${myNfts.length}`);
      console.log(`myListedNfts ${myListedNfts.length}\n`);
    }

    console.log('MINT AND LIST 3 NFTs');
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    let txn1 = await architecture.mint(
      "Nom du NFT 1",
      "Catégorie du NFT 1",
      "Style d'architecture 1",
      "Description du NFT 1",
      "Liste du matériel du NFT 1",
      100, // Coût nécessaire à la réalisation du NFT 1 (en wei)
      "URI1"
    );
    let events1 = txn1.receipt.rawLogs;
    let tokenId1;
    for (const event of events1) {
      if (event.topics[0] === web3.utils.keccak256("Transfer(address,address,uint256)")) {
        tokenId1 = web3.utils.hexToNumber(event.topics[3]);
        break;
      }
    }
    await marketplace.listNft(architecture.address, tokenId1, 1, { value: listingFee });
    console.log(`Minted and listed ${tokenId1}`);

    let txn2 = await architecture.mint(
      "Nom du NFT 2",
      "Catégorie du NFT 2",
      "Style d'architecture 2",
      "Description du NFT 2",
      "Liste du matériel du NFT 2",
      200, // Coût nécessaire à la réalisation du NFT 2 (en wei)
      "URI2"
    );
    let events2 = txn2.receipt.rawLogs;
    let tokenId2;
    for (const event of events2) {
      if (event.topics[0] === web3.utils.keccak256("Transfer(address,address,uint256)")) {
        tokenId2 = web3.utils.hexToNumber(event.topics[3]);
        break;
      }
    }
    await marketplace.listNft(architecture.address, tokenId2, 1, { value: listingFee });
    console.log(`Minted and listed ${tokenId2}`);

    let txn3 = await architecture.mint(
      "Nom du NFT 3",
      "Catégorie du NFT 3",
      "Style d'architecture 3",
      "Description du NFT 3",
      "Liste du matériel du NFT 3",
      300, // Coût nécessaire à la réalisation du NFT 3 (en wei)
      "URI3"
    );
    let events3 = txn3.receipt.rawLogs;
    let tokenId3;
    for (const event of events3) {
      if (event.topics[0] === web3.utils.keccak256("Transfer(address,address,uint256)")) {
        tokenId3 = web3.utils.hexToNumber(event.topics[3]);
        break;
      }
    }

    await marketplace.listNft(architecture.address, tokenId3, 1, { value: listingFee });
    console.log(`Minted and listed ${tokenId3}`);

    await logNftLists(marketplace);

    console.log('BUY 2 NFTs');
    await marketplace.buyNft(architecture.address, tokenId1, { value: 1 });
    await marketplace.buyNft(architecture.address, tokenId2, { value: 1 });
    await logNftLists(marketplace);

    console.log('RESELL 1 NFT');
    await marketplace.resellNft(architecture.address, tokenId2, 1, { value: listingFee });
    await logNftLists(marketplace);

  } catch (err) {
    console.log('Doh! ', err);
  }

  callback();
};
