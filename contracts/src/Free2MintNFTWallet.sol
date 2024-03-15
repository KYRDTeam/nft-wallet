// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Free2MintNFTWallet is ERC721, ERC721Enumerable, Ownable {
    constructor()
        ERC721("Free2MintNFTWallet", "FMW")
        Ownable(tx.origin)
    {}

    uint256 private _nextTokenId;
    address private _tbaHelper;
    bool private isInitialized = false;

    function initialize(address tbaHelper) public onlyOwner {
        require(!isInitialized, 'Contract is already initialized');
        isInitialized = true;
        _tbaHelper = tbaHelper;
    }

    modifier onlyMinter() {
        if (msg.sender != _tbaHelper) {
            revert();
        }
        _;
    }

    function safeMint(address to) public onlyMinter returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function getTokensOfOwner(
        address owner
    ) external view returns (uint256[] memory tokenIds, uint256 count) {
        count = balanceOf(owner);
        tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
