import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Signature", function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Signature = await ethers.getContractFactory("Signature");
    const contract = await Signature.deploy();

    return { contract, owner, otherAccount };
  }

  it("Test", async function () {
    const { contract } = await loadFixture(
      deployContractFixture
    );

    const resp1 = await fetch('https://api.holonym.io/attestation/attestor')
    const { address: attestor } = await resp1.json()

    expect(attestor).to.equal('0xa74772264f896843c6346ceA9B13e0128A1d3b5D')

    const actionId = 123456789
    const userAddress = '0xdbd6b2c02338919EdAa192F5b60F5e5840A50079'

    const resp2 = await fetch(`https://api.holonym.io/attestation/sbts/gov-id?action-id=${actionId}&user=${userAddress}`)

    const { signature } = await resp2.json()

    const verifiedSigner = await contract.verify(
      attestor,
      actionId,
      userAddress,
      signature,
    )

    expect(verifiedSigner).to.equal(true)
  });
});
