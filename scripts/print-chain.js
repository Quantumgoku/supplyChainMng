const hre = require("hardhat");
const contractAddressJson = require("../client/src/contracts/SupplyChain-address.json");

async function main() {
  const provider = hre.ethers.provider;
  const address = contractAddressJson.address;

  if (!address) {
    console.error(" Error: Contract address is undefined. Check SupplyChain-address.json.");
    process.exit(1);
  }

  let supplyChain;
  try {
    supplyChain = await hre.ethers.getContractAt("SupplyChain", address);
  } catch (err) {
    console.error(" Error initializing contract instance:", err.message);
    process.exit(1);
  }

  const latestBlock = await provider.getBlockNumber();
  console.log(` Full blockchain from block 0 -> ${latestBlock}`);
  console.log(` Contract Address: ${address}\n`);

  for (let i = 0; i <= latestBlock; i++) {
    const block = await provider.getBlock(i, true);
    console.log(` Block ${i}: ${block.hash}`);
    for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);
      
        if (!tx) {
          console.log(`  ↳ Skipped tx (missing details for hash: ${txHash})`);
          continue;
        }
      
        console.log(`    Tx: ${tx.hash}`);
        console.log(`     From: ${tx.from}`);
        console.log(`     To:   ${tx.to || "Contract Creation"}`);
        console.log(`     Gas:  ${tx.gasLimit.toString()}`);

      if (tx.to && tx.to.toLowerCase() === address.toLowerCase()) {
        const receipt = await provider.getTransactionReceipt(tx.hash);

        for (const log of receipt.logs) {
          try {
            const parsed = supplyChain.interface.parseLog(log);
            const relevantEvents = [
              "RawMaterialSupplied",
              "MedicineManufactured",
              "MedicineDistributed",
              "MedicineRetailed",
              "MedicineSold"
            ];
            if (relevantEvents.includes(parsed.name)) {
              console.log(`      Event: ${parsed.name}`);
              console.log(`         Medicine ID: ${parsed.args.medicineID.toString()}`);
              if (parsed.args.rmsID) console.log(`         RMS ID: ${parsed.args.rmsID}`);
              if (parsed.args.manID) console.log(`         Manufacturer ID: ${parsed.args.manID}`);
              if (parsed.args.disID) console.log(`         Distributor ID: ${parsed.args.disID}`);
              if (parsed.args.retID) console.log(`         Retailer ID: ${parsed.args.retID}`);
              if (parsed.args.message) console.log(`         Message: ${parsed.args.message}`);
            }
          } catch (err) {
            // Ignore logs that don't match any event signature
          }
        }
      }
    }
    console.log(); // spacing between blocks
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
