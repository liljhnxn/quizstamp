import * as fs from "fs";
import * as path from "path";

async function main() {
  const contractAddress = "0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100";
  const buildInfoFiles = fs.readdirSync(path.join(process.cwd(), "artifacts/build-info"));
  const buildInfo = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "artifacts/build-info", buildInfoFiles[0]), "utf-8")
  );

  console.log("Submitting Standard JSON Input verification to BotchainScan...");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", JSON.stringify(buildInfo.input));
  params.append("codeformat", "solidity-standard-json-input");
  params.append("contractname", "contracts/QuizStamp.sol:QuizStamp");
  params.append("compilerversion", `v${buildInfo.solcLongVersion}`);

  try {
    const res = await fetch("https://scan.botchain.ai/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    console.log("Submit Response:", data);

    if (data.status === "1") {
      const guid = data.result;
      console.log(`Checking GUID: ${guid}...`);

      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const checkRes = await fetch(
          `https://scan.botchain.ai/api?module=contract&action=checkverifystatus&guid=${guid}`
        );
        const checkData = await checkRes.json();
        console.log(`Poll attempt ${i + 1}:`, checkData);
        if (checkData.result === "Pass - Verified") {
          console.log("Contract successfully verified on BotchainScan!");
          return;
        }
        if (checkData.result && checkData.result.includes("Fail")) {
          console.log("Verification returned failure:", checkData.result);
          break;
        }
      }
    }
  } catch (err: any) {
    console.error("Verification script error:", err.message);
  }
}

main();
