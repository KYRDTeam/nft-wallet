// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {IERC6551Registry} from "erc6551-registry/interfaces/IERC6551Registry.sol";
import {IFree2MintNFTWallet} from "./interfaces/IFree2MintNFTWallet.sol";
contract TBAHelper {
    bytes _initCallData;
    constructor() {
        _initCallData = abi.encodePacked(bytes4(0xc4d66de8), abi.encode(_TBA_IMPLEMENTATION));
    }
    IERC6551Registry private immutable _REGISTRY = IERC6551Registry(0x000000006551c19487814612e58FE06813775758);
    address private immutable _TBA_PROXY = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;
    address private immutable _TBA_IMPLEMENTATION = 0x41C8f39463A868d3A88af00cd0fe7102F30E44eC;
    IFree2MintNFTWallet private immutable _FREE_TO_MINT_NFT = IFree2MintNFTWallet(0x230Bb5168364FE4Ba80E4146820b406257562609);

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
        if (count == 0) {
            return accounts;
        }
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = _account(_TBA_PROXY, "", block.chainid, address(_FREE_TO_MINT_NFT), tokenIds[i]);
        }
    }

    function _account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) internal view returns (address) {
        assembly {
            // Silence unused variable warnings
            pop(chainId)
            pop(tokenContract)
            pop(tokenId)

            // Copy bytecode + constant data to memory
            calldatacopy(0x8c, 0x24, 0x80) // salt, chainId, tokenContract, tokenId
            mstore(0x6c, 0x5af43d82803e903d91602b57fd5bf3) // ERC-1167 footer
            mstore(0x5d, implementation) // implementation
            mstore(0x49, 0x3d60ad80600a3d3981f3363d3d373d3d3d363d73) // ERC-1167 constructor + header

            // Copy create2 computation data to memory
            mstore8(0x00, 0xff) // 0xFF
            mstore(0x35, keccak256(0x55, 0xb7)) // keccak256(bytecode)
            mstore(0x01, shl(96, address())) // registry address
            mstore(0x15, salt) // salt

            // Store computed account address in memory
            mstore(0x00, shr(96, shl(96, keccak256(0x00, 0x55))))

            // Return computed account address
            return(0x00, 0x20)
        }
    }
}
