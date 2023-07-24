require('dotenv').config();
const goerliMnemonic = process.env["GOERLI_MNEMONIC"];
const infuraKey = process.env["INFURA_KEY"];
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
 
  contracts_build_directory: './client/contracts/ethereum-contracts',

 
  contracts_directory: './contracts/ethereum',

  

  networks: {
  development: {
   host: "127.0.0.1",   
   port: 8545,           
  network_id: "*"       
 },
  local_ethereum: {
  network_id: 31337,
  host: '127.0.0.1',
  port: 8545,
  gasPrice: 0
    },
    sepolia:{
      provider: function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`})},
     network_id:11155111,
   },

    mumbai:{
      provider: function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID2}`})},
     network_id:80001,
 },
    // goerli: {
    //   network_id: 5,
    //   chain_id: 5,
    //   provider: function() {
    //     return new HDWalletProvider(goerliMnemonic, "https://goerli.infura.io/v3/" + infuraKey, 0, 1);
    //   }
    // },
    dashboard: {
      host: "127.0.0.1",
      port: 24012,
      network_id: "*"
    }
  },

  
  mocha: {
    // timeout: 100000
  },

  
  compilers: {
    solc: {
      version: "0.8.19",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  db: {
    enabled: false
  }
};
