// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "forge-std/Base.sol";
import "forge-std/console.sol";
import "ds-test/test.sol";
import "../src/TBAHelper.sol";

contract TBATest is TestBase {
    uint256 mainnetFork;
    TBAHelper tbaHelper;

    function setUp() public{
        mainnetFork = vm.createFork("https://rpc.ankr.com/polygon", 54676961);
        vm.selectFork(mainnetFork);
        tbaHelper = new TBAHelper();
    }

    function testTBAHelper() external {
        console.log(tbaHelper.accountsOf(0x04Ff397401AF494d68848FCaa4c78dCa785d33FC)[0]);
    }
}