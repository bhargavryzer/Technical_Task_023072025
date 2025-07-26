
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";
import {ComplianceModule} from "../src/ComplianceModule.sol";
import {RWAAssetToken} from "../src/RWAAssetToken.sol";

contract RWATest is Test {
    IdentityRegistry registry;
    ComplianceModule compliance;
    RWAAssetToken token;
    
    address admin = makeAddr("admin");
    address issuer = makeAddr("issuer");
    address agent = makeAddr("agent");
    address investor1 = makeAddr("investor1");
    address investor2 = makeAddr("investor2");
    
    function setUp() public {
        vm.startPrank(admin);
        
        registry = new IdentityRegistry();
        compliance = new ComplianceModule(address(registry));
        token = new RWAAssetToken("Real Estate Token", "RET", address(compliance));
        
        // Setup roles
        registry.grantRole(registry.AGENT_ROLE(), agent);
        token.grantRole(token.ISSUER_ROLE(), issuer);
        
        // Set basic compliance rules
        string[] memory allowedCountries = new string[](1);
        allowedCountries[0] = "US";
        string[] memory restrictedCountries = new string[](0);
        compliance.setTransferRestriction(true, allowedCountries, restrictedCountries);
        
        vm.stopPrank();
        
        // Register test investors
        vm.prank(agent);
        registry.registerIdentity(investor1, "US", true);
        
        vm.prank(agent);
        registry.registerIdentity(investor2, "US", true);
    }
    
    function testTokenIssuance() public {
        vm.prank(issuer);
        token.issue(investor1, 1000);
        
        assertEq(token.balanceOf(investor1), 1000);
    }
    
    function testCompliantTransfer() public {
        // Issue tokens first
        vm.prank(issuer);
        token.issue(investor1, 1000);
        
        // Transfer tokens
        vm.prank(investor1);
        token.transfer(investor2, 500);
        
        assertEq(token.balanceOf(investor1), 500);
        assertEq(token.balanceOf(investor2), 500);
    }
    
    function testNonCompliantTransfer() public {
    // First set strict compliance rules
    string[] memory restrictedCountries = new string[](1);
    restrictedCountries[0] = "CN";
    string[] memory emptyAllowed = new string[](0);
    
    vm.prank(admin);
    compliance.setTransferRestriction(true, emptyAllowed, restrictedCountries);

    // Register investors
    vm.startPrank(agent);
    registry.registerIdentity(investor1, "US", true);  // US investor
    registry.registerIdentity(investor2, "CN", true);  // CN investor (restricted)
    vm.stopPrank();

    // Issue tokens to investor1
    vm.prank(issuer);
    token.issue(investor1, 1000);

    // Attempt transfer should fail
    vm.prank(investor1);
    vm.expectRevert("Transfer not compliant");
    token.transfer(investor2, 500);

    // Verify no transfer occurred
    assertEq(token.balanceOf(investor1), 1000);
    assertEq(token.balanceOf(investor2), 0);
}
    
    function testOnlyIssuerCanMint() public {
        vm.expectRevert();
        token.issue(investor1, 1000); // Should fail - not issuer
        
        vm.prank(issuer);
        token.issue(investor1, 1000); // Should succeed
    }
    
    function testUnverifiedInvestorCannotReceiveTokens() public {
        address unverified = makeAddr("unverified");
        
        vm.prank(issuer);
        vm.expectRevert("Recipient not compliant");
        token.issue(unverified, 1000);
    }
}