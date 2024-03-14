# NFT Wallet

# Contracts

## Deploy:

```bash
forge script  --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast contracts/script/SmartNFTWallet.s.sol
```

### NOTE

you can pre-compute nft and tba helper contract deployment address by using the following command

```bash
forge script contracts/script/ComputeAddresses.s.sol
```

Smart NFT Wallet deploy address should be `0xC23618Af86E7Fe6BebcF246c381b323C4b5eBD97`
TBAHelper Address should be `0xD87295d881fEF00aA68F9CA26b08574C475ad229`