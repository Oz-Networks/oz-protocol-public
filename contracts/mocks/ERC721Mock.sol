// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    // Mapping to track minted tokens
    mapping(uint256 => bool) private _tokenExists;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, uint256 tokenId) external {
        require(to != address(0), "Cannot mint to zero address");
        require(!_tokenExists[tokenId], "Token ID already exists");

        _safeMint(to, tokenId);
        _tokenExists[tokenId] = true;

        require(ownerOf(tokenId) == to, "Token wasn't minted to correct address");
    }

    function burn(uint256 tokenId) external {
        require(_tokenExists[tokenId], "Token does not exist");
        address owner = ownerOf(tokenId);
        require(owner != address(0), "Token already burned");

        _burn(tokenId);
        _tokenExists[tokenId] = false;
    }

    // Helper function for testing
    function exists(uint256 tokenId) external view returns (bool) {
        return _tokenExists[tokenId];
    }

    function getOwner(uint256 tokenId) external view returns (address) {
        require(_tokenExists[tokenId], "Token does not exist");
        return ownerOf(tokenId);
    }
}
