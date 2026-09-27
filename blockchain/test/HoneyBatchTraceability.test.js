const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyBatchTraceability Smart Contract", function () {
  let contract;
  let admin;
  let beekeeper;
  let processor;
  let qualityLab;
  let unauthorizedUser;

  beforeEach(async function () {
    [admin, beekeeper, processor, qualityLab, unauthorizedUser] = await ethers.getSigners();

    const HoneyBatchTraceability = await ethers.getContractFactory("HoneyBatchTraceability");
    contract = await HoneyBatchTraceability.deploy();
    await contract.waitForDeployment();

    // Authorize actors
    await contract.setAuthorizedActor(beekeeper.address, true);
    await contract.setAuthorizedActor(processor.address, true);
    await contract.setAuthorizedActor(qualityLab.address, true);
  });

  describe("Deployment & Authorization", function () {
    it("Should set deployer as admin and authorized", async function () {
      expect(await contract.admin()).to.equal(admin.address);
      expect(await contract.authorizedActors(admin.address)).to.be.true;
    });

    it("Should allow admin to authorize new actors", async function () {
      expect(await contract.authorizedActors(beekeeper.address)).to.be.true;
    });

    it("Should reject non-admin trying to authorize actor", async function () {
      await expect(
        contract.connect(unauthorizedUser).setAuthorizedActor(unauthorizedUser.address, true)
      ).to.be.revertedWith("BeeProof: Caller is not KVIC Admin");
    });
  });

  describe("Batch Registration & Provenance Events", function () {
    const batchNumber = "BP-2026-TEST-001";

    it("Should allow authorized beekeeper to register a new honey batch", async function () {
      const now = Math.floor(Date.now() / 1000);
      await expect(
        contract.connect(beekeeper).registerBatch(
          batchNumber,
          "TEST-CLUST-01",
          "Sundarbans Mangrove Cluster",
          "Wild Mangrove",
          250000,
          now
        )
      )
        .to.emit(contract, "BatchRegistered")
        .withArgs(batchNumber, "TEST-CLUST-01", 250000, beekeeper.address);

      const batch = await contract.getBatch(batchNumber);
      expect(batch.batchNum).to.equal(batchNumber);
      expect(batch.clusterCode).to.equal("TEST-CLUST-01");
      expect(batch.exists).to.be.true;

      const timeline = await contract.getTimeline(batchNumber);
      expect(timeline.length).to.equal(1);
      expect(timeline[0].stage).to.equal("HARVEST");
    });

    it("Should reject duplicate batch registration", async function () {
      const now = Math.floor(Date.now() / 1000);
      await contract.connect(beekeeper).registerBatch(
        batchNumber,
        "TEST-CLUST-01",
        "Sundarbans Mangrove Cluster",
        "Wild Mangrove",
        250000,
        now
      );

      await expect(
        contract.connect(beekeeper).registerBatch(
          batchNumber,
          "TEST-CLUST-01",
          "Sundarbans Mangrove Cluster",
          "Wild Mangrove",
          250000,
          now
        )
      ).to.be.revertedWith("BeeProof: Batch already registered");
    });

    it("Should reject unauthorized user registering a batch", async function () {
      await expect(
        contract.connect(unauthorizedUser).registerBatch(
          "BP-UNAUTH-001",
          "TEST-CLUST-01",
          "Sundarbans Mangrove Cluster",
          "Wild Mangrove",
          100000,
          0
        )
      ).to.be.revertedWith("BeeProof: Caller is not authorized actor");
    });

    it("Should record processing stage and quality certification", async function () {
      await contract.connect(beekeeper).registerBatch(
        batchNumber,
        "TEST-CLUST-01",
        "Sundarbans Mangrove Cluster",
        "Wild Mangrove",
        250000,
        0
      );

      // Record processing
      await contract.connect(processor).recordStageEvent(
        batchNumber,
        "PROCESSING",
        "Apex Honey Facility",
        "Kolkata Processing Hub",
        "Micro-filtered at 38°C",
        2 // IN_PROCESSING
      );

      // Record quality certificate
      await contract.connect(qualityLab).recordQualityCertificate(
        batchNumber,
        "BP-NABL-CERT-99",
        "Central Agro-Food Quality Lab",
        1810, // 18.1% moisture
        9550, // 95.5% purity
        true, // NMR passed
        false // No C4 sugar
      );

      const quality = await contract.getQualityAssay(batchNumber);
      expect(quality.certificateNumber).to.equal("BP-NABL-CERT-99");
      expect(quality.isCertified).to.be.true;
      expect(quality.pollenPurityScoreX100).to.equal(9550);

      const provenance = await contract.verifyProvenance(batchNumber);
      expect(provenance.isValid).to.be.true;
      expect(provenance.isCertified).to.be.true;
      expect(provenance.timelineCount).to.equal(3); // Harvest, Processing, Quality Testing
    });

    it("Should record canonical data hash and allow retrieval for tamper verification", async function () {
      const hashBatch = "BP-2026-HASH-001";
      const sampleDataHash = "0x8f4d92a81b672901928374a9f8e7d6c5b4a39281726354483920192837465abc";

      await expect(
        contract.connect(beekeeper).registerBatchWithHash(
          hashBatch,
          "TEST-CLUST-02",
          "Nilgiri Apiary",
          "Mountain Multifloral",
          300000,
          0,
          sampleDataHash
        )
      ).to.emit(contract, "DataHashRecorded");

      const retrievedHash = await contract.getDataHash(hashBatch);
      expect(retrievedHash).to.equal(sampleDataHash);

      // Updating data hash on stage transition
      const updatedHash = "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff";
      await expect(
        contract.connect(processor).recordDataHash(hashBatch, updatedHash)
      ).to.emit(contract, "DataHashRecorded");

      expect(await contract.getDataHash(hashBatch)).to.equal(updatedHash);
    });
  });
});
