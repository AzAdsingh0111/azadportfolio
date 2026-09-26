// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title PortfolioBadge
 * @dev ERC-1155 Multi-Token contract for verifiable on-chain exploration badges.
 * Minting is gated by server-side ECDSA signatures verifying that the user visited all 5 landmarks.
 */
contract PortfolioBadge is ERC1155, Ownable {
    using ECDSA for bytes32;

    address public serverSigner;
    mapping(address => mapping(uint256 => bool)) public hasMinted;

    event BadgeMinted(address indexed recipient, uint256 indexed badgeId);
    event ServerSignerUpdated(address indexed oldSigner, address indexed newSigner);

    /**
     * @param uri_ Metadata URI template for badges
     * @param _signer Public address corresponding to backend private key
     */
    constructor(string memory uri_, address _signer) ERC1155(uri_) Ownable(msg.sender) {
        require(_signer != address(0), "Invalid server signer");
        serverSigner = _signer;
    }

    /**
     * @dev Mint a Proof of Exploration badge with cryptographic backend authorization.
     * @param badgeId ID of the badge to mint (e.g., 1 for Proof of Exploration)
     * @param signature ECDSA signature from serverSigner over (msg.sender, badgeId)
     */
    function mintWithSignature(uint256 badgeId, bytes calldata signature) external {
        require(!hasMinted[msg.sender][badgeId], "Badge already claimed");

        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, badgeId));
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(msgHash);
        
        address recoveredSigner = ECDSA.recover(ethSignedHash, signature);
        require(recoveredSigner == serverSigner, "Invalid signature");

        hasMinted[msg.sender][badgeId] = true;
        _mint(msg.sender, badgeId, 1, "");
        emit BadgeMinted(msg.sender, badgeId);
    }

    /**
     * @dev Update backend server signer address (owner only)
     */
    function setServerSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid address");
        emit ServerSignerUpdated(serverSigner, _newSigner);
        serverSigner = _newSigner;
    }

    /**
     * @dev Update base metadata URI
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
}
