// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/TBAHelper.sol";

contract DeployTBAHelper is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new TBAHelper{
            salt: 0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31
        }();
        vm.stopBroadcast();
    }
}
