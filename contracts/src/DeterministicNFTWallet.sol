// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DeterministicNFTWallet is ERC721, ERC721Enumerable {
    constructor() ERC721("DeterministicNFTWallet", "DNW") {}

    mapping(address => uint256) _nonce;

    function nonceOf(address owner) external view returns (uint256 nonce) {
        return _nonce[owner];
    }

    function safeMint() public {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(tx.origin, _nonce[tx.origin])));
        _safeMint(tx.origin, tokenId);
        _nonce[tx.origin] += 1;
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
