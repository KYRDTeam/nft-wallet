<div style="display: flex; justify-content: center; width: 100%;"><img src="./extension/img/logo.png"/></div>
<h1 style="text-align: center;margin-top: 10px; width: 100%;">NFT Wallet</h1>

<h4 style="text-align: center;margin-top: 10px;font-weight:semibold; width: 100%;">Browser extension for NFT-linked smart contract wallet</h4>

Web3 projects are issuing points to attract users, but their point system is mostly stored off-chain and tied to EOA (Externally Owned Accounts) wallets. That means in order to transfer points to others, one must provide the EOA wallet private key and that's a very insecure process.

To tackle this, we are building a unique browser extension for smart contract wallets that are linked with NFTs in the way that owner of the NFT can control the wallet and transferring wallet is now as easy as transferring an NFT. You can use our extension to create smart contract wallets then connect to dApps and make transactions just like you're on Metamask or Rabby.

_Key features:_

- Create smart account (NFT-linked smart contract wallet) from an EOA wallet
- Connect smart account to dApps and interact with their smart contracts
- Transfer smart account to other address via NFT transfer

## Technical solution

In our extension, we:
- adopt [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) **Token bound accounts** which enable ERC-721 NFT to function as smart contract wallet.
- modify browser extension connection flow to make smart wallet connect to dApps as if it is an EOA wallet.
- wrap transaction data sent from dApps in order for smart wallet to make arbitrary calls to any contracts.

## Functionalities

### Create smart account

![Create smart account](extension/screenshots/create_account.gif)

### Connect with dapps and make transactions

![Make transaction](extension/screenshots/make_transaction.gif)

### Transfer wallet

![Transfer wallet](extension/screenshots/transfer_wallet.gif)

# Contracts

## Deploy:

```bash
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/DeployTBAHelper.s.sol
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/DeployFree2MintNFTWallet.s.sol
```

### NOTE

You can pre-compute NFT and TBAHelper contract deployment address by using the following command

```bash
forge script contracts/script/ComputeAddresses.s.sol
```

Free2Mint deploy address should be `0xD629BB82c2217cE32Ff91143aed0816E26BaF397`
TBAHelper Address should be `0x18e49629A34bf735ED1816216ac754921AF26080`

## Verify contact

```bash
forge verify-contract --chain-id 137 0xD629BB82c2217cE32Ff91143aed0816E26BaF397 contracts/src/Free2MintNFTWallet.sol:Free2MintNFTWallet
forge verify-contract --chain-id 137 0x18e49629A34bf735ED1816216ac754921AF26080 contracts/src/TBAHelper.sol:TBAHelper
```

## Deployments address

**Free2MintWallet**

This contract is NFT contract we used to associate with smart account.

| EVM Network          | Chain ID | Registry Address                                                                                                                       |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Polygon              | 137      | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)               |
| Polygon zkEvm Goerli | 1442     | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://testnet-zkevm.polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397) |
| Linea Goerli         | 59140    | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://goerli.lineascan.build/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)        |

**TBA Helper**

Helper contract to mint NFT then create smart account which is associated with that NFT.

| EVM Network          | Chain ID | Registry Address                                                                                                                       |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Polygon              | 137      | [0x18e49629A34bf735ED1816216ac754921AF26080](https://polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080)               |
| Polygon zkEvm Goerli | 1442     | [0x18e49629A34bf735ED1816216ac754921AF26080](https://testnet-zkevm.polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080) |
| Linea Goerli         | 59140    | [0x18e49629A34bf735ED1816216ac754921AF26080](https://goerli.lineascan.build/address/0x18e49629A34bf735ED1816216ac754921AF26080)        |

**ERC-6551 Registry**
This contract is used to create and get smart account.

| EVM Network          | Chain ID | Registry Address                                                                                                                       |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Polygon              | 137      | [0x000000006551c19487814612e58FE06813775758](https://polygonscan.com/address/0x000000006551c19487814612e58FE06813775758)               |
| Polygon zkEvm Goerli | 1442     | [0x000000006551c19487814612e58FE06813775758](https://testnet-zkevm.polygonscan.com/address/0x000000006551c19487814612e58FE06813775758) |
| Linea Goerli         | 59140    | [0x000000006551c19487814612e58FE06813775758](https://goerli.lineascan.build/address/0x000000006551c19487814612e58FE06813775758)        |

**Token bound account Proxy**

Use this address as the `implementation` parameter when calling `createAccount` on the registry

| EVM Network          | Chain ID | Account Proxy Address                                                                                                                  |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Polygon              | 137      | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)               |
| Polygon zkEvm Goerli | 1442     | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://testnet-zkevm.polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F) |
| Linea Goerli         | 59140    | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://goerli.lineascan.build/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)        |

**Token bound account Implementation**

Use this address as the `implementation` parameter when calling `initialize` on a created account

| EVM Network   | Chain ID | Account Implementation Address                                                                                                         |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Polygon       | 137      | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)               |
| Polygon zkEvm | 1442     | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://testnet-zkevm.polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC) |
| Linea Goerli  | 59140    | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://goerli.lineascan.build/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)        |

# Extension

## Get started

### Requirements:

- Node 16
- Yarn

### Install dependencies:

```bash
$ yarn
```

### Environment variables

- About Krystal related environment variables, please contact us to get the values
- About Multicall and Mutlisend, please use any multicall/multisend contracts on chain you want to use
- About TBA related env, please refer below list of addresses in **contracts** section

### Build extension

```bash
$ yarn build
```

After this step, a folder `build` is generated. To add this to Chrome extension locally, first enable developer mode and press `Load unpacked` button the `build` folder

![Load chrome extension](extension/screenshots/upload_extension.gif)

### Development

```bash
$ yarn start
```

Then load folder `dev` instead of `build`
