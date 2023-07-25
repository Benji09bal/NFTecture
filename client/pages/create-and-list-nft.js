import { useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Marketplace from '../contracts/ethereum-contracts/Marketplace.json';
import ArchitectureNFT from '../contracts/ethereum-contracts/ArchitectureNFT.json';

const projectId = process.env["NEXT_PUBLIC_IPFS_KEY"];
const projectSecret = process.env["NEXT_PUBLIC_IPFS_PROJECT_ID"];
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    category: '',
    architectureStyle: '',
    description: '',
    materialList: '',
    price: '',
    cost: '',
  });
  const router = useRouter();

  async function onChange(e) {
    // Charger l'image par IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://nftecture.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, category, architectureStyle, materialList, price, cost } = formInput;
    if (!name || !description || !category || !architectureStyle || !price || !fileUrl) {
      return;
    } else {
      // Premièrememnt, chargé les métadonnées sur IPFS
      const data = JSON.stringify({
        name,
        description,
        category,
        architectureStyle,
        materialList,
        image: fileUrl,
        cost,
      });
      try {
        const added = await client.add(data);
        const url = `https://nftecture.infura-ipfs.io/ipfs/${added.path}`;
        // Une fois les métadonnées téléchargées sur IPFS, renvoyez l'URL pour l'utiliser dans la transaction
        return url;
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  async function listNFTForSale() {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const url = await uploadToIPFS();
    const networkId = await web3.eth.net.getId();

    // Mint le NFT
    const architectureContractAddress = ArchitectureNFT.networks[networkId].address;
    const architectureContract = new web3.eth.Contract(ArchitectureNFT.abi, architectureContractAddress);
    const accounts = await web3.eth.getAccounts();
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address);
    let listingFee = await marketPlaceContract.methods.getListingFee().call();
    listingFee = listingFee.toString();
    architectureContract.methods.mint(
      formInput.name,
      formInput.category,
      formInput.architectureStyle,
      formInput.description,
      formInput.materialList,
      formInput.cost,
      url
    ).send({ from: accounts[0] }).on('receipt', function (receipt) {
      console.log('minted');

      
      // Lister le NFT
      const tokenId = receipt.events.NFTMinted.returnValues[0];
      marketPlaceContract.methods.listNft(architectureContractAddress, tokenId, Web3.utils.toWei(formInput.price, "ether"))
        .send({ from: accounts[0], value: listingFee }).on('receipt', function () {
          console.log('listed')
          router.push('/')
        });
    });
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Nom du NFT qui représentera votre création"
          className="mt-8 border front-bold rounded p-4 custom-input custom-input2 transparent-input"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <input
          placeholder="Catégorie du NFT"
          className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
          onChange={(e) => updateFormInput({ ...formInput, category: e.target.value })}
        />
        <input
          placeholder="Style d'architecture"
          className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
          onChange={(e) => updateFormInput({ ...formInput, architectureStyle: e.target.value })}
        />
        <textarea
          placeholder="Description du design / concept architectural proposé"
          className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <textarea
          placeholder="Liste du matériel (visible uniquement pour le client après l'achat)"
          className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
          onChange={(e) => updateFormInput({ ...formInput, materialList: e.target.value })}
        />
        <div className="flex items-center">
          <input
            placeholder="Prix de vente fixé en Eth"
            className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <span className="my-text font-bold my-paragraphthree "> B</span> 
        </div>
        <div className="flex items-center">
        <input
        placeholder="Coût de réalisation éstimé"
        className="mt-2 border rounded p-4 custom-input custom-input2 transparent-input"
        onChange={(e) => updateFormInput({ ...formInput, cost: e.target.value })}
      />
         &nbsp;<span className="my-text2 font-bold my-paragraphfour">  u</span> 
        </div>
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="custom-button2 rounded mt-4" width="250" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-teal-400 text-white rounded p-1 shadow-lg custom-button "
        >
          Je mint et liste mon NFT !
        </button>
      </div>
    </div>
  );
}
