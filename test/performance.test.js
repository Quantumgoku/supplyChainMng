const { ethers } = require("hardhat");

describe("Performance Metrics", function () {
  it("Should measure gas used for addMedicine()", async function () {
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();     // ← correct usage
    await supplyChain.deployed();                       // ← wait until deployed

    const tx = await supplyChain.addMedicine("Med A", "Test Desc");
    const receipt = await tx.wait();

    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Block number:", receipt.blockNumber);
  });
});
