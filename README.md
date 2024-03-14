# NFT Wallet

# Contracts

## Deploy:

```bash
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/SmartNFTWallet.s.sol
```

Smart NFT Wallet deploy address should be `0xa9c1Fb6FC9365C10850664aD7F127e964435b0DB`

### NOTE

you can pre-compute nft deployed address by using the following command

```bash
forge script contracts/script/ComputeFree2MintNFTWallet.s.sol
```