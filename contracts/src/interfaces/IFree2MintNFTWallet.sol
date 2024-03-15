// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IFree2MintNFTWallet is IERC721 {
    function safeMint(address to) external returns (uint256);
    function getTokensOfOwner(address owner) external view returns (uint256[] memory tokenIds, uint256 count);
}
