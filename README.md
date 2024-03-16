<div style="display: flex; justify-content: center;"><img src="./extension/img/logo.png"/></div>
<h1 style="text-align: center;margin-top: 10px">NFT Wallet</h1>

<h4 style="text-align: center;margin-top: 10px;font-weight:semibold">Browser extension for NFT-linked smart contract wallet</h4>

Web3 projects are issuing points to attract users, but their point system is mostly stored off-chain and tied to EOA (Externally Owned Accounts) wallets. That means in order to transfer points to others, one must provide the EOA wallet private key and that's a very insecure process.

To tackle this, we are building a unique browser extension for smart contract wallets that are linked with NFTs in the way that owner of the NFT can control the wallet and transferring wallet is now as easy as transferring an NFT. You can use our extension to create smart contract wallets then connect to dApps and make transactions just like you're on Metamask or Rabby.

_Key features:_

- Create smart account (NFT-linked smart contract wallet) from an EOA wallet
- Connect smart account to dApps and interact with their smart contracts
- Transfer smart account to other address by transfer linked NFT

## Technical solution

- We adopted [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551) **Token bound accounts** for our smart accounts.
- We use [ERC-721](https://eips.ethereum.org/EIPS/eip-721) **NFT** to link with smart accounts.
- We modify browser extension connection flow to let smart accounts connect to any dApps without the need of account's private key.
- We modify browser extension transaction flow to let smart accounts make transactions from data sent by any dApps without the need of account's private key.

# Extension

## Get started

Requirements:
- Node 16

Install dependencies:
```
$ yarn
```

Build extension
```
$ yarn build
```

After this step, a folder `build` is generated. To add this to Chrome extension locally, first enable developer mode and load the `build` folder

![Load chrome extension](extension/screenshots/upload_extension.gif)

Build for development
```
$ yarn start
```
Then import folder `dev` instead of `build`

## Functionalities
1. Create smart account

![Create smart account](extension/screenshots/create_account.gif)

2. Interact with dapps, make transactions

![Make transaction](extension/screenshots/make_transaction.gif)

3. Transfer wallet

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

This contract is to mint new wallet. Every nft has minted from this contract is associated with a wallet address

| EVM Network   | Chain ID | Registry Address                                                                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://goerli.lineascan.build/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)        |
| Polygon       | 137      | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)               |
| Polygon zkEvm Testnet | 1442     | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://testnet-zkevm.polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397) |

**TBA Helper**

Token bound account helper for mint new wallet

| EVM Network   | Chain ID | Registry Address                                                                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x18e49629A34bf735ED1816216ac754921AF26080](https://goerli.lineascan.build/address/0x18e49629A34bf735ED1816216ac754921AF26080)        |
| Polygon       | 137      | [0x18e49629A34bf735ED1816216ac754921AF26080](https://polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080)               |
| Polygon zkEvm Testnet | 1442     | [0x18e49629A34bf735ED1816216ac754921AF26080](https://testnet-zkevm.polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080) |

**ERC-6551 Registry**

| EVM Network   | Chain ID | Registry Address                                                                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x000000006551c19487814612e58FE06813775758](https://goerli.lineascan.build/address/0x000000006551c19487814612e58FE06813775758)        |
| Polygon       | 137      | [0x000000006551c19487814612e58FE06813775758](https://polygonscan.com/address/0x000000006551c19487814612e58FE06813775758)               |
| Polygon zkEvm Testnet | 1442     | [0x000000006551c19487814612e58FE06813775758](https://testnet-zkevm.polygonscan.com/address/0x000000006551c19487814612e58FE06813775758) |

**Tokenbound Account Proxy**

Use this address as the `implementation` parameter when calling `createAccount` on the registry

| EVM Network   | Chain ID | Account Proxy Address                                                                                                                  |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://goerli.lineascan.build/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)        |
| Polygon       | 137      | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)               |
| Polygon zkEvm Testnet | 1442     | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://testnet-zkevm.polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F) |

**Tokenbound Account Implementation**

Use this address as the `implementation` parameter when calling `initialize` on a created account

| EVM Network   | Chain ID | Account Implementation Address                                                                                                         |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://goerli.lineascan.build/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)        |
| Polygon       | 137      | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)               |
| Polygon zkEvm Testnet | 1442     | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://testnet-zkevm.polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC) |
