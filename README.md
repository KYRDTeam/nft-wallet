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

Free2Mint deploy address should be `0x230Bb5168364FE4Ba80E4146820b406257562609`
TBAHelper Address should be `0x0222DC3948248Aec0e1F16FCC6f946B431D154Da`

## Verify contact

```bash
forge verify-contract --chain-id 137 0x230Bb5168364FE4Ba80E4146820b406257562609 contracts/src/Free2MintNFTWallet.sol:Free2MintNFTWallet
forge verify-contract --chain-id 137 0x0222DC3948248Aec0e1F16FCC6f946B431D154Da contracts/src/TBAHelper.sol:TBAHelper
```