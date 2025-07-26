// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ComplianceModule.sol";

contract RWAAssetToken is ERC20, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    
    ComplianceModule public complianceModule;
    
    event TokensIssued(address indexed to, uint256 amount);
    event TokensRedeemed(address indexed from, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        address _complianceModule
    ) ERC20(name, symbol) {
        complianceModule = ComplianceModule(_complianceModule);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(AGENT_ROLE, msg.sender);
    }
    
    function issue(address to, uint256 amount) external onlyRole(ISSUER_ROLE) {
        require(complianceModule.canTransfer(address(0), to), "Recipient not compliant");
        _mint(to, amount);
        emit TokensIssued(to, amount);
    }
    
    function redeem(address from, uint256 amount) external onlyRole(ISSUER_ROLE) {
        _burn(from, amount);
        emit TokensRedeemed(from, amount);
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (from != address(0)) { // Skip check for minting
            require(complianceModule.canTransfer(from, to), "Transfer not compliant");
        }
        super._update(from, to, amount);
    }
    
    function setComplianceModule(address _complianceModule) external onlyRole(DEFAULT_ADMIN_ROLE) {
        complianceModule = ComplianceModule(_complianceModule);
    }
}