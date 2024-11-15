// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collector is ERC721, Ownable {
    string private _tokenURI;
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        string memory tokenURI_,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _tokenURI = tokenURI_;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId); // This is the OpenZeppelin way to check if token exists
        return _tokenURI;
    }

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
