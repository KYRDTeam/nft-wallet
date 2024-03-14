// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/SmartNftWallet.sol";

contract SmartNFTWalletScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new SmartNFTWallet();
        vm.stopBroadcast();
    }
}
