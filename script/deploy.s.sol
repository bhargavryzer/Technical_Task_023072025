// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceModule.sol";
import "../src/RWAAssetToken.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        // Deploy Identity Registry
        IdentityRegistry registry = new IdentityRegistry();
        
        // Deploy Compliance Module
        ComplianceModule compliance = new ComplianceModule(address(registry));
        
        // Deploy RWA Token
        RWAAssetToken token = new RWAAssetToken(
            "Real Estate Token",
            "RET",
            address(compliance)
        );
        
        // Setup roles
        address admin = vm.envAddress("ADMIN_ADDRESS");
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), admin);
        token.grantRole(token.ISSUER_ROLE(), admin);
        token.grantRole(token.AGENT_ROLE(), admin);
        
        registry.grantRole(registry.DEFAULT_ADMIN_ROLE(), admin);
        registry.grantRole(registry.AGENT_ROLE(), admin);
        
        vm.stopBroadcast();
        
        console.log("IdentityRegistry deployed at:", address(registry));
        console.log("ComplianceModule deployed at:", address(compliance));
        console.log("RWAAssetToken deployed at:", address(token));
    }
}