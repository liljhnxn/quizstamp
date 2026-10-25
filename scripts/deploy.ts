import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying QuizStamp to Botchain Mainnet...");
  console.log("-----------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer address : ${deployer.address}`);
  console.log(`Account balance  : ${ethers.formatEther(balance)} BOT`);

  // Query gas price or enforce minimum 20 gwei to ensure we don't overpay
  const feeData = await ethers.provider.getFeeData();
  const minGasPrice = ethers.parseUnits("20", "gwei");
  const gasPrice = (feeData.gasPrice && feeData.gasPrice > minGasPrice) 
    ? feeData.gasPrice 
    : minGasPrice;
  
  console.log(`Using gasPrice   : ${ethers.formatUnits(gasPrice, "gwei")} gwei (minimal gas fee)`);

  const QuizStampFactory = await ethers.getContractFactory("QuizStamp");
  const quizStamp = await QuizStampFactory.deploy({
    gasPrice: gasPrice,
  });
  await quizStamp.waitForDeployment();

  const contractAddress = await quizStamp.getAddress();
  const deploymentTx = quizStamp.deploymentTransaction();

  console.log("-----------------------------------------");
  console.log("QuizStamp deployed successfully to Mainnet!");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`Explorer Link   : https://scan.botchain.ai/tx/${deploymentTx.hash}`);
  }
  console.log("-----------------------------------------");

  // Save address and ABI to src/config/contractInfo.json for frontend integration
  const configDir = path.join(process.cwd(), "src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const artifactPath = path.join(process.cwd(), "artifacts/contracts/QuizStamp.sol/QuizStamp.json");
  const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const contractInfo = {
    address: contractAddress,
    chainId: 677,
    network: "Botchain Mainnet",
    abi: contractArtifact.abi,
  };

  fs.writeFileSync(
    path.join(configDir, "contractInfo.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Updated frontend configuration at src/config/contractInfo.json");

  // Update .env NEXT_PUBLIC_CONTRACT_ADDRESS
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
