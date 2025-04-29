<h1 align="center">
  <br>
  <a><img src="https://www.mdpi.com/logistics/logistics-03-00005/article_deploy/html/images/logistics-03-00005-g001.png" width="200"></a>
  <br>  
  Supply-Chain-Dapp
  <br>
</h1>

<p align="center">
  
  <a href="https://docs.godechain.com/welcome/">
    <img src="https://s3.coinmarketcap.com/static-gravity/thumbnail/medium/12b1f4d9727b4aab83cd5398bf6e080d.jpg" width="35" height='35'>
  </a>
  <a href="https://soliditylang.org/">
    <img src="https://github.com/rishav4101/eth-supplychain-dapp/blob/main/images/Solidity.svg" width="80">       
  </a>
  <a href="https://reactjs.org/"><img src="https://github.com/rishav4101/eth-supplychain-dapp/blob/main/images/react.png" width="80"></a>
  
  <a href="https://www.trufflesuite.com/">
    <img src="https://github.com/rishav4101/eth-supplychain-dapp/blob/main/images/trufflenew.png" width="50">
  </a>
   &nbsp;&nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/web3">
    <img src="https://github.com/rishav4101/eth-supplychain-dapp/blob/main/images/web3.jpg" width="60">
  </a>
</p>

<h4 align="center">A simple Supply Chain setup with <a href="https://docs.soliditylang.org/en/v0.8.4/" target="_blank">Solidity</a>.</h4>

<p align="center">
  <a >
    <img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg">
       
  </a>
  
</p>


## Description
Supply chain is always hard to manage and requires a lot of admistrative machinery. However, when managed with smart contracts using blockchain, a lot of the paperwork is reduced.
Also it leads to an increase in the transparency and helps to build an efficient Root of Trust. Supply-chain-dapp is such an implementation of a supply chain management system which uses blockchain to ensure a transparent and secure transfer of product from the manufacturer to the customer via the online e-commerce websites. 
## Architecture
The smart contract is being written with Solidity which is then compiled, migrated and deployed using Truffle.js on the Gode Testnet blockchain network.The frontend uses Web3.js to communicate with the smart contract and Gode Testnet blockchain network and Meta Musk Wallet is connect to Gode Test Network to do Transaction between each component in Supply .
****
![https://raw.githubusercontent.com/faizack619/Supply-Chain-Gode-Blockchain/master/client/public/Blank%20diagram.png](https://raw.githubusercontent.com/faizack619/Supply-Chain-Gode-Blockchain/master/client/public/Blank%20diagram.png)

## Supply Chain Flow


![[https://cdn.vectorstock.com/i/1000x1000/35/51/diagram-of-supply-chain-management-vector-41743551.webp](https://cdn.vectorstock.com/i/1000x1000/35/51/diagram-of-supply-chain-management-vector-41743551.webp)](https://cdn-wordpress-info.futurelearn.com/info/wp-content/uploads/8d54ad89-e86f-4d7c-8208-74455976a4a9-2-768x489.png)



## Smart Contract Working Flow

This is a SupplyChain smart contract written in Solidity. The contract models the various roles and stages involved in the supply chain of a pharmaceutical product.

The contract owner is the person who deploys the contract and is the only one who can authorize various roles like retailer, manufacturer, etc.

There are several roles involved in the supply chain of the pharmaceutical product. These include the raw material supplier, manufacturer, distributor, and retailer.

The smart contract stores information about the medicine, such as its name, description, and current stage in the supply chain. There is also a function to show the current stage of a medicine, which can be used by client applications.

The smart contract also stores information about the various players in the supply chain, such as their name, address, and place of operation.

The addRMS(), addManufacturer(), addDistributor(), and addRetailer() functions can be used by the contract owner to add new players to the supply chain.

Overall, this smart contract provides a way to track the various stages of a pharmaceutical product in the supply chain, ensuring transparency and accountability.

## 🚀 Prerequisites & Installation

### Step 1: Environment Setup

Install the following tools:

- **VSCode**: [Download](https://code.visualstudio.com/)
- **Node.js**: [Download](https://nodejs.org/)
  ```bash
  node -v
  ```
- **Git**: [Download](https://git-scm.com/downloads)
  ```bash
  git --version
  ```
- **MetaMask**: [Install Extension](https://metamask.io/)
- **Ganache**: [Download](https://trufflesuite.com/ganache/)

### Step 2: Clone and Setup

```bash
git clone https://github.com/Quantumgoku/supply-chain-mng.git
cd supply-chain-mng
npm install
```

## ⚙️ Using Hardhat

### Compile Contracts

```bash
npx hardhat compile
```

### Start a Local Blockchain Node

```bash
npx hardhat node
```

This starts a local Ethereum network on `http://127.0.0.1:8545`.

### Deploy Contracts

In a new terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## 🌐 Run the DApp (Frontend)

Navigate to the client folder and run the app:

```bash
cd client
npm install
npm start
```

The app runs at: [http://localhost:3000](http://localhost:3000)

## 🔗 Connect MetaMask to Ganache

1. Open Ganache and copy the RPC server address (default: `http://127.0.0.1:8545`).
2. In MetaMask, add a new network with the copied RPC address.
3. Import a Ganache account using the private key shown in Ganache.

## 🧪 Testing & Trace

### To Trace a Transaction

Install the tracer plugin:

```bash
npm install --save-dev hardhat-tracer
```

Then trace with:

```bash
npx hardhat trace --hash <transaction_hash> --rpc http://localhost:8545
```

### View Blockchain

```bash
npx hardhat run scripts/print-chain.js --network localhost
```

## 📂 Project Structure

- `contracts/`: Solidity smart contracts.
- `scripts/`: Deployment and tracing scripts.
- `client/`: Frontend React application.
- `hardhat.config.js`: Hardhat config.
- `SupplyChain-address.json`: Contains deployed contract address.

## ✅ Features

- Add and track medicines through supply chain stages.
- Connect and authorize different roles (RMS, Manufacturer, Distributor, Retailer).
- Show transaction details using blockchain logs.
- Export full blockchain trace.

---
