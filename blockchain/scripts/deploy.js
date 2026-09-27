const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("--------------------------------------------------");
  console.log("🐝 Deploying BeeProof HoneyBatchTraceability Contract...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer Address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", hre.ethers.formatEther(balance), "ETH");

  const HoneyBatchTraceability = await hre.ethers.getContractFactory("HoneyBatchTraceability");
  const contract = await HoneyBatchTraceability.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ HoneyBatchTraceability deployed to:", contractAddress);

  // Seed sample batch on-chain for demo & testing
  console.log("Seeding initial provenance batch BP-2026-SUN-001...");
  const crypto = require("crypto");
  const canonicalString = "batchNumber=BP-2026-SUN-001;cluster=SUN-MNG-01;quantity=485.50;floral=Wild Mangrove Khalisha & Goran;harvestDate=2026-08-23";
  const initialHash = "0x" + crypto.createHash("sha256").update(canonicalString).digest("hex");

  const tx1 = await contract.registerBatchWithHash(
    "BP-2026-SUN-001",
    "SUN-MNG-01",
    "Sundarbans Mangrove Reserve Cluster",
    "Wild Mangrove Khalisha & Goran",
    485500, // 485.5 kg in grams
    Math.floor(new Date("2026-08-23T08:30:00Z").getTime() / 1000),
    initialHash
  );
  await tx1.wait();

  // Processing stage
  const tx2 = await contract.recordStageEvent(
    "BP-2026-SUN-001",
    "PROCESSING",
    "Northern Apex Honey Processing Facility",
    "West Bengal Processing Hub",
    "Filtered at <40°C preserving native enzymes, diastase, and invertase vitality.",
    2 // IN_PROCESSING
  );
  await tx2.wait();

  // Quality testing
  const tx3 = await contract.recordQualityCertificate(
    "BP-2026-SUN-001",
    "BP-NABL-2026-00492",
    "National Agro-Food Quality Testing & NMR Centre",
    1780, // 17.80% moisture
    9620, // 96.20% purity
    true, // NMR passed
    false // C4 sugar not detected
  );
  await tx3.wait();

  // Distribution stage
  const tx4 = await contract.recordStageEvent(
    "BP-2026-SUN-001",
    "DISTRIBUTION",
    "Amit Deshmukh (EcoLogistics Cold-Chain)",
    "National Cold-Chain Distribution Depot, Delhi",
    "Sealed with cryptographic serial codes for consumer end-to-end provenance verification.",
    7 // DISTRIBUTED
  );
  await tx4.wait();

  console.log("✅ Genesis batch BP-2026-SUN-001 recorded on blockchain with 4 provenance stages and initial hash!");

  // Get artifact for ABI
  const artifact = await hre.artifacts.readArtifact("HoneyBatchTraceability");

  // Save deployment info for Backend & Frontend
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    sampleBatchNumber: "BP-2026-SUN-001",
    sampleTxHash: tx1.hash,
    initialDataHash: initialHash,
    abi: artifact.abi
  };

  const outputDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(outputDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment manifest and ABI saved to deployments/" + hre.network.name + ".json");
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
