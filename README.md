# NFT Wallet

**Browser extension for NFT-linked smart contract wallet**

Web3 projects are issuing points to attract users, but their point system is mostly stored off-chain and tied to EOA wallets. That means in order to transfer points to others, one must provide the EOA wallet private key and that's a very insecure process.

Here we are building a unique browser extension for smart contract wallets that are linked with NFTs in the way that owner of the NFT can control the wallet and transferring wallet is now as easy as transferring an NFT. User can use our extension to create smart contract wallets and interact with dApps smoothly.

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