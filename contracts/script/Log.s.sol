
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";


contract LogScript is Script {
    function setUp() external {}
    function run() external view {
        address account = 0x06783a30fF28215616332A6170AD4b073276CCA7;
        console.log(account);
        bytes memory encoded = abi.encodePacked(bytes4(0xc4d66de8), abi.encode(account));
        console.logBytes(encoded);
    }
}