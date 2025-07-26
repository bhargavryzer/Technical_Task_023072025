// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IdentityRegistry is AccessControl {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    
    struct Identity {
        bool isVerified;
        string countryCode;
        uint256 verificationDate;
        bool isAccredited;
    }
    
    mapping(address => Identity) public identities;
    
    event IdentityVerified(address indexed investor, string countryCode, bool isAccredited);
    event IdentityRemoved(address indexed investor);
    
    constructor() {
        //_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function registerIdentity(
        address investor,
        string memory countryCode,
        bool isAccredited
    ) external onlyRole(AGENT_ROLE) {
        identities[investor] = Identity({
            isVerified: true,
            countryCode: countryCode,
            verificationDate: block.timestamp,
            isAccredited: isAccredited
        });
        emit IdentityVerified(investor, countryCode, isAccredited);
    }
    
    function revokeIdentity(address investor) external onlyRole(AGENT_ROLE) {
        delete identities[investor];
        emit IdentityRemoved(investor);
    }
    
    function isVerified(address investor) external view returns (bool) {
        return identities[investor].isVerified;
    }
    
    function getIdentity(address investor) external view returns (Identity memory) {
        return identities[investor];
    }
}