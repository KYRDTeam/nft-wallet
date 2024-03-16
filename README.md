# NFT Wallet

# Contracts

## Deploy:

```bash
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/DeployTBAHelper.s.sol
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/DeployFree2MintNFTWallet.s.sol
```

### NOTE

you can pre-compute nft and tba helper contract deployment address by using the following command

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

| EVM Network   | Chain ID | Registry Address                                                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://goerli.lineascan.build/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)       |
| Polygon       | 137      | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)              |
| Polygon zkEvm | 1442     | [0xD629BB82c2217cE32Ff91143aed0816E26BaF397](https://testnet-zkevm.polygonscan.com/address/0xD629BB82c2217cE32Ff91143aed0816E26BaF397)              |

**TBA Helper**

Token bound account helper for mint new wallet

| EVM Network   | Chain ID | Registry Address                                                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x18e49629A34bf735ED1816216ac754921AF26080](https://goerli.lineascan.build/address/0x18e49629A34bf735ED1816216ac754921AF26080)       |
| Polygon       | 137      | [0x18e49629A34bf735ED1816216ac754921AF26080](https://polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080)              |
| Polygon zkEvm | 1442     | [0x18e49629A34bf735ED1816216ac754921AF26080](https://testnet-zkevm.polygonscan.com/address/0x18e49629A34bf735ED1816216ac754921AF26080)              |

**ERC-6551 Registry**

| EVM Network   | Chain ID | Registry Address                                                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x000000006551c19487814612e58FE06813775758](https://goerli.lineascan.build/address/0x000000006551c19487814612e58FE06813775758)       |
| Polygon       | 137      | [0x000000006551c19487814612e58FE06813775758](https://polygonscan.com/address/0x000000006551c19487814612e58FE06813775758)              |
| Polygon zkEvm | 1442     | [0x000000006551c19487814612e58FE06813775758](https://testnet-zkevm.polygonscan.com/address/0x000000006551c19487814612e58FE06813775758)              |

**Tokenbound Account Proxy**

Use this address as the `implementation` parameter when calling `createAccount` on the registry

| EVM Network   | Chain ID | Account Proxy Address                                                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://goerli.lineascan.build/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)       |
| Polygon       | 137      | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)              |
| Polygon zkEvm | 1442     | [0x55266d75D1a14E4572138116aF39863Ed6596E7F](https://testnet-zkevm.polygonscan.com/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F)              |

**Tokenbound Account Implementation**

Use this address as the `implementation` parameter when calling `initialize` on a created account

| EVM Network   | Chain ID | Account Implementation Address                                                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Linea Goerli  | 59140    | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://goerli.lineascan.build/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)       |
| Polygon       | 137      | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC)              |
| Polygon zkEvm | 1442     | [0x41C8f39463A868d3A88af00cd0fe7102F30E44eC](https://testnet-zkevm.polygonscan.com/address/0x41C8f39463A868d3A88af00cd0fe7102F30E44eC) |
