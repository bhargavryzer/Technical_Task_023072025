// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IdentityRegistry} from "./IdentityRegistry.sol";

contract ComplianceModule {
    IdentityRegistry public immutable identityRegistry;
    
    struct TransferRestriction {
        bool requireAccreditation;
        string[] allowedCountries;
        string[] restrictedCountries;
    }
    
    TransferRestriction public transferRestriction;
    
    event ComplianceRuleUpdated();
    
    constructor(address _identityRegistry) {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }
    
    function setTransferRestriction(
        bool _requireAccreditation,
        string[] memory _allowedCountries,
        string[] memory _restrictedCountries
    ) external {
        transferRestriction = TransferRestriction({
            requireAccreditation: _requireAccreditation,
            allowedCountries: _allowedCountries,
            restrictedCountries: _restrictedCountries
        });
        emit ComplianceRuleUpdated();
    }
    
    function canTransfer(address from, address to) external view returns (bool) {
    if (from == address(0)) {
        IdentityRegistry.Identity memory mintReceiverIdentity = identityRegistry.getIdentity(to);
        if (!mintReceiverIdentity.isVerified) {
            return false;
        }
        if (transferRestriction.requireAccreditation && !mintReceiverIdentity.isAccredited) {
            return false;
        }
        for (uint i = 0; i < transferRestriction.restrictedCountries.length; i++) {
            if (stringsEqual(mintReceiverIdentity.countryCode, transferRestriction.restrictedCountries[i])) {
                return false;
            }
        }
        if (transferRestriction.allowedCountries.length > 0) {
            bool receiverAllowed = false;
            for (uint i = 0; i < transferRestriction.allowedCountries.length; i++) {
                if (stringsEqual(mintReceiverIdentity.countryCode, transferRestriction.allowedCountries[i])) {
                    receiverAllowed = true;
                }
            }
            if (!receiverAllowed) {
                return false;
            }
        }
        return true;
    }

    IdentityRegistry.Identity memory senderIdentity = identityRegistry.getIdentity(from);
    IdentityRegistry.Identity memory receiverIdentity = identityRegistry.getIdentity(to);

    if (!senderIdentity.isVerified || !receiverIdentity.isVerified) {
        return false;
    }
    if (transferRestriction.requireAccreditation && 
        (!senderIdentity.isAccredited || !receiverIdentity.isAccredited)) {
        return false;
    }
    for (uint i = 0; i < transferRestriction.restrictedCountries.length; i++) {
        if (stringsEqual(senderIdentity.countryCode, transferRestriction.restrictedCountries[i]) ||
            stringsEqual(receiverIdentity.countryCode, transferRestriction.restrictedCountries[i])) {
            return false;
        }
    }
    if (transferRestriction.allowedCountries.length > 0) {
        bool senderAllowed = false;
        bool receiverAllowed = false;
        for (uint i = 0; i < transferRestriction.allowedCountries.length; i++) {
            if (stringsEqual(senderIdentity.countryCode, transferRestriction.allowedCountries[i])) {
                senderAllowed = true;
            }
            if (stringsEqual(receiverIdentity.countryCode, transferRestriction.allowedCountries[i])) {
                receiverAllowed = true;
            }
        }
        if (!senderAllowed || !receiverAllowed) {
            return false;
        }
    }
    return true;
}

function stringsEqual(string memory a, string memory b) internal pure returns (bool) {
    return keccak256(bytes(a)) == keccak256(bytes(b));
}

}