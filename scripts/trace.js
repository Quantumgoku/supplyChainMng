const hre = require("hardhat");
const { trace } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
    const contract = await SupplyChain.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed at:", await contract.getAddress());

    // Register roles to pass the require(...) in addMedicine()
    await contract.addRMS(deployer.address, "RMS", "Mumbai");
    await contract.addManufacturer(deployer.address, "Manufacturer", "Delhi");
    await contract.addDistributor(deployer.address, "Distributor", "Bangalore");
    await contract.addRetailer(deployer.address, "Retailer", "Chennai");

    // Now safely call addMedicine
    const tx = await contract.addMedicine("Battery A", "High capacity lithium");
    const receipt = await tx.wait();

    console.log("Transaction hash:", tx.hash);
    console.log("Gas used:", receipt.gasUsed.toString());

    console.log("\n🧵 Transaction Trace:\n");
    await trace(tx.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
