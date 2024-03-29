// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../src/Free2MintNFTWallet.sol";
import "../src/TBAHelper.sol";

contract ComputeFree2MintNFTWallet is Script {
    function run() external view {
        bytes32 salt = 0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31;
        address factory = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

        address nft =
            Create2.computeAddress(salt, keccak256(type(Free2MintNFTWallet).creationCode), factory);

        address tbaHelper = 
            Create2.computeAddress(salt, keccak256(type(TBAHelper).creationCode), factory);

        console.log("Free2MintNFTWallet Address:", nft);
        console.log("TBAHelper Address:", tbaHelper);
    }
}
