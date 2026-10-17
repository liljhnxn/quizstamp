import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying QuizStamp to Botchain Testnet...");
  console.log("-----------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer address : ${deployer.address}`);
  console.log(`Account balance  : ${ethers.formatEther(balance)} BOT`);

  const QuizStampFactory = await ethers.getContractFactory("QuizStamp");
  const quizStamp = await QuizStampFactory.deploy();
  await quizStamp.waitForDeployment();

  const contractAddress = await quizStamp.getAddress();
  const deploymentTx = quizStamp.deploymentTransaction();

  console.log("-----------------------------------------");
  console.log("QuizStamp deployed successfully!");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`Explorer Link   : https://scan.bohr.life/tx/${deploymentTx.hash}`);
  }
  console.log("-----------------------------------------");

  // Save address and ABI to src/config/contractInfo.json for frontend integration
  const configDir = path.join(process.cwd(), "src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const contractArtifact = await import("../artifacts/contracts/QuizStamp.sol/QuizStamp.json");
  const contractInfo = {
    address: contractAddress,
    chainId: 968,
    network: "Botchain Testnet",
    abi: contractArtifact.abi,
  };

  fs.writeFileSync(
    path.join(configDir, "contractInfo.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Updated frontend configuration at src/config/contractInfo.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
