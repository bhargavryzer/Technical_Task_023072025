# Technical_Task_023072025

#  Ryzer — ERC-3643 Smart Contract Challenge

##  Overview

Welcome to the Ryzer candidate evaluation task!

We are building **Ryzer.app**, a platform for the **tokenization of real-world assets (RWA)** using permissioned and regulatory-compliant token standards. This task is designed to assess your practical understanding of **ERC-3643 (Permissioned Tokens)** and your experience with **Foundry or Hardhat**.

You are expected to **fork this repository**, complete the task, and submit a **pull request (PR)** for review.


##  Objective

Create and deploy a basic **ERC-3643-based RWA token issuance system** that simulates tokenizing a real-world asset like real estate, bonds, or physical gold.


##  Requirements

### Core Task

* Implement an ERC-3643 token with:

  * On-chain identity validation (linked to an allowlist or identity registry)
  * Role-based access (issuer, agent, investor)
  * Token transfer restrictions (based on identity status)

### Contract Features

1. **Identity Registry**
   A registry that stores investor identity and eligibility.

2. **Compliance Module**
   A rule engine to validate if a transfer is permitted (e.g., KYC status, country whitelist, etc.).

3. **Token Contract (RWAAssetToken)**
   A permissioned ERC-20 compatible token implementing ERC-3643 logic:

   * Minting restricted to the `ISSUER` role
   * Transfers allowed only between verified investors

4. **Issuer/Admin Script**
   Script to onboard new investors and issue tokens using CLI or tests.


## Suggested File Structure

/contracts
  - RWAAssetToken.sol
  - IdentityRegistry.sol
  - ComplianceModule.sol

/script
  - deploy.ts / deploy.s.sol (Hardhat/Foundry)
  - mintAndTransfer.ts / mint.s.sol

/test
  - rwa.test.ts / rwa.t.sol

/hardhat.config.ts or foundry.toml

## Bonus Points (Optional Enhancements)

* Use **Foundry** for ultra-fast testing (or support both Hardhat and Foundry).
* Add **Merkle Tree-based identity verification**.
* Deploy to any testnet (Sepolia, Amoy, etc.) and include the address.
* Include a minimal **frontend dashboard** (React or plain HTML) for testing.


##  Installation & Setup

```bash
# If using Hardhat
npm install
npx hardhat compile

# If using Foundry
forge install
forge build
```


##  Developer Guidelines

* Write clear and modular code.
* Include relevant comments and documentation.
* Ensure tests cover minting, transferring, and permission enforcement.
* README updates are welcome if you improve or change the repo structure.


##  How to Submit

1. **Fork** this repository to your GitHub.
2. Complete the task on your fork.
3. Submit a **Pull Request (PR)** back to this repo.
4. In the PR description, include:

   * A brief overview of your implementation
   * Any deployed contract addresses
   * (Optional) A demo video or screenshots


##  Why This Task?

This challenge reflects the core use case of **Ryzer**—secure, compliant, permissioned tokenization of real-world assets using **ERC-3643**, an emerging standard for institutional-grade digital assets.


##  References

* [ERC-3643 Standard](https://github.com/erc3643/erc3643)
* [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
* [Foundry Book](https://book.getfoundry.sh/)
* [Hardhat Docs](https://hardhat.org/)


##  Deadline

Please submit your PR within **4 days** of receiving this task.

