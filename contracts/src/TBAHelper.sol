// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {IERC6551Registry} from "erc6551-registry/interfaces/IERC6551Registry.sol";
import {IFree2MintNFTWallet} from "./interfaces/IFree2MintNFTWallet.sol";
import "forge-std/console.sol";

contract TBAHelper {
    bytes _initCallData;
    constructor() {
        _initCallData = abi.encodePacked(bytes4(0xc4d66de8), abi.encode(_TBA_IMPLEMENTATION));
    }
    IERC6551Registry private immutable _REGISTRY = IERC6551Registry(0x000000006551c19487814612e58FE06813775758);
    address private immutable _TBA_PROXY = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;
    address private immutable _TBA_IMPLEMENTATION = 0x41C8f39463A868d3A88af00cd0fe7102F30E44eC;
    IFree2MintNFTWallet private immutable _FREE_TO_MINT_NFT = IFree2MintNFTWallet(0xD629BB82c2217cE32Ff91143aed0816E26BaF397);

    function createAccount() external returns (address account) {
        uint256 nftId = _FREE_TO_MINT_NFT.safeMint(msg.sender);
        account = _REGISTRY.createAccount(_TBA_PROXY, "", block.chainid, address(_FREE_TO_MINT_NFT), nftId);
        (bool success, ) = account.call(_initCallData);
        if (!success) {
            revert("initialize account failed");
        }
    }

    function accountsOf(address owner) external view returns (address[] memory accounts) {
        (uint256[] memory tokenIds, uint256 count) = _FREE_TO_MINT_NFT.getTokensOfOwner(owner);
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            address a = _REGISTRY.account(_TBA_PROXY, "", block.chainid, address(_FREE_TO_MINT_NFT), tokenIds[i]);
            accounts[i] = a;
        }
    }
}
