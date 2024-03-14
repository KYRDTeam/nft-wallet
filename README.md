# NFT Wallet

# Contracts

## Deploy:

```bash
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/SmartNFTWallet.s.sol
```

Smart NFT Wallet deploy address should be `0x35276C93E1cA89A8D8fbdfa4173569cec7683729`

### NOTE

you can pre-compute nft deployed address by using the following command

```bash
forge script contracts/script/ComputeDeterministicNFTWallet.s.sol
```