const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();  // Wait for the deployment to complete  
    
    const address = await supplyChain.getAddress();

    console.log("✅ SupplyChain deployed to:", address);

    // Save to frontend
    const frontendContractsDir = __dirname + "/../client/src/contracts";
    if (!fs.existsSync(frontendContractsDir)) {
        fs.mkdirSync(frontendContractsDir, { recursive: true });
    }

    fs.writeFileSync(
        frontendContractsDir + "/SupplyChain-address.json",
        JSON.stringify({ address: address }, null, 2)
    );

    fs.copyFileSync(
        __dirname + "/../artifacts/contracts/SupplyChain.sol/SupplyChain.json",
        frontendContractsDir + "/SupplyChain.json"
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
