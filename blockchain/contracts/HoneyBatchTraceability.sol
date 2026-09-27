// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title HoneyBatchTraceability
 * @notice BeeProof KVIC-compliant Honey Provenance & Agricultural Supply-Chain Smart Contract.
 * Provides tamper-proof immutable records for apiary harvest, lab purity testing, and custody handover.
 */
contract HoneyBatchTraceability {
    address public immutable admin;

    enum BatchStatus {
        REGISTERED,
        HARVESTED,
        IN_PROCESSING,
        TESTING_PENDING,
        CERTIFIED,
        REJECTED,
        PACKAGED,
        DISTRIBUTED
    }

    struct QualityAssay {
        string certificateNumber;
        string laboratoryName;
        uint256 moisturePercentageX100;    // e.g. 1780 = 17.80%
        uint256 pollenPurityScoreX100;     // e.g. 9620 = 96.20%
        bool nmrSpectroscopyPassed;
        bool c4SugarAdulterationDetected;
        bool isCertified;
        uint256 timestamp;
    }

    struct TimelineEvent {
        string stage;
        string actorName;
        string location;
        string details;
        uint256 timestamp;
        address recordedBy;
    }

    struct BatchRecord {
        string batchNumber;
        string clusterCode;
        string clusterName;
        string floralSource;
        uint256 quantityGrams;
        uint256 harvestTimestamp;
        BatchStatus status;
        address beekeeperAddress;
        QualityAssay quality;
        bool exists;
    }

    // Mapping from batchNumber to BatchRecord
    mapping(string => BatchRecord) private batches;
    // Mapping from batchNumber to list of on-chain TimelineEvents
    mapping(string => TimelineEvent[]) private batchTimelines;
    // Mapping from batchNumber to canonical SHA-256 data hash for tamper detection
    mapping(string => string) private batchDataHashes;
    // Authorized actors (KVIC, Beekeepers, Labs, Processors)
    mapping(address => bool) public authorizedActors;

    // Events
    event BatchRegistered(string indexed batchNumber, string clusterCode, uint256 quantityGrams, address indexed creator);
    event StageUpdated(string indexed batchNumber, string stage, address indexed actor, uint256 timestamp);
    event QualityCertified(string indexed batchNumber, string certificateNumber, bool passed, uint256 pollenPurityX100);
    event DataHashRecorded(string indexed batchNumber, string dataHash, address indexed actor, uint256 timestamp);
    event ActorAuthorized(address indexed actor, bool authorized);

    modifier onlyAdmin() {
        require(msg.sender == admin, "BeeProof: Caller is not KVIC Admin");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == admin || authorizedActors[msg.sender], "BeeProof: Caller is not authorized actor");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedActors[msg.sender] = true;
    }

    function setAuthorizedActor(address actor, bool authorized) external onlyAdmin {
        authorizedActors[actor] = authorized;
        emit ActorAuthorized(actor, authorized);
    }

    function registerBatch(
        string calldata batchNumber,
        string calldata clusterCode,
        string calldata clusterName,
        string calldata floralSource,
        uint256 quantityGrams,
        uint256 harvestTimestamp
    ) external onlyAuthorized {
        _registerBatch(batchNumber, clusterCode, clusterName, floralSource, quantityGrams, harvestTimestamp, "");
    }

    function registerBatchWithHash(
        string calldata batchNumber,
        string calldata clusterCode,
        string calldata clusterName,
        string calldata floralSource,
        uint256 quantityGrams,
        uint256 harvestTimestamp,
        string calldata dataHash
    ) external onlyAuthorized {
        _registerBatch(batchNumber, clusterCode, clusterName, floralSource, quantityGrams, harvestTimestamp, dataHash);
    }

    function _registerBatch(
        string calldata batchNumber,
        string calldata clusterCode,
        string calldata clusterName,
        string calldata floralSource,
        uint256 quantityGrams,
        uint256 harvestTimestamp,
        string memory dataHash
    ) internal {
        require(bytes(batchNumber).length > 0, "BeeProof: Empty batch number");
        require(!batches[batchNumber].exists, "BeeProof: Batch already registered");

        BatchRecord storage record = batches[batchNumber];
        record.batchNumber = batchNumber;
        record.clusterCode = clusterCode;
        record.clusterName = clusterName;
        record.floralSource = floralSource;
        record.quantityGrams = quantityGrams;
        record.harvestTimestamp = harvestTimestamp > 0 ? harvestTimestamp : block.timestamp;
        record.status = BatchStatus.HARVESTED;
        record.beekeeperAddress = msg.sender;
        record.exists = true;

        if (bytes(dataHash).length > 0) {
            batchDataHashes[batchNumber] = dataHash;
            emit DataHashRecorded(batchNumber, dataHash, msg.sender, block.timestamp);
        }

        // Record initial harvest timeline event
        batchTimelines[batchNumber].push(
            TimelineEvent({
                stage: "HARVEST",
                actorName: "Registered Apiary Beekeeper",
                location: clusterName,
                details: string(abi.encodePacked("Harvested from ", floralSource, " flora")),
                timestamp: record.harvestTimestamp,
                recordedBy: msg.sender
            })
        );

        emit BatchRegistered(batchNumber, clusterCode, quantityGrams, msg.sender);
    }

    function recordDataHash(string calldata batchNumber, string calldata dataHash) external onlyAuthorized {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");
        require(bytes(dataHash).length > 0, "BeeProof: Empty data hash");
        batchDataHashes[batchNumber] = dataHash;
        emit DataHashRecorded(batchNumber, dataHash, msg.sender, block.timestamp);
    }

    function getDataHash(string calldata batchNumber) external view returns (string memory) {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");
        return batchDataHashes[batchNumber];
    }

    function recordStageEvent(
        string calldata batchNumber,
        string calldata stage,
        string calldata actorName,
        string calldata location,
        string calldata details,
        BatchStatus newStatus
    ) external onlyAuthorized {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");

        batches[batchNumber].status = newStatus;

        batchTimelines[batchNumber].push(
            TimelineEvent({
                stage: stage,
                actorName: actorName,
                location: location,
                details: details,
                timestamp: block.timestamp,
                recordedBy: msg.sender
            })
        );

        emit StageUpdated(batchNumber, stage, msg.sender, block.timestamp);
    }

    function recordQualityCertificate(
        string calldata batchNumber,
        string calldata certificateNumber,
        string calldata laboratoryName,
        uint256 moisturePercentageX100,
        uint256 pollenPurityScoreX100,
        bool nmrSpectroscopyPassed,
        bool c4SugarAdulterationDetected
    ) external onlyAuthorized {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");

        bool passed = nmrSpectroscopyPassed && !c4SugarAdulterationDetected;

        batches[batchNumber].quality = QualityAssay({
            certificateNumber: certificateNumber,
            laboratoryName: laboratoryName,
            moisturePercentageX100: moisturePercentageX100,
            pollenPurityScoreX100: pollenPurityScoreX100,
            nmrSpectroscopyPassed: nmrSpectroscopyPassed,
            c4SugarAdulterationDetected: c4SugarAdulterationDetected,
            isCertified: passed,
            timestamp: block.timestamp
        });

        batches[batchNumber].status = passed ? BatchStatus.CERTIFIED : BatchStatus.REJECTED;

        batchTimelines[batchNumber].push(
            TimelineEvent({
                stage: "TESTING",
                actorName: laboratoryName,
                location: "Accredited Testing Facility",
                details: string(abi.encodePacked("Certificate #", certificateNumber, passed ? " - VERIFIED PASSED" : " - REJECTED ADULTERATION")),
                timestamp: block.timestamp,
                recordedBy: msg.sender
            })
        );

        emit QualityCertified(batchNumber, certificateNumber, passed, pollenPurityScoreX100);
    }

    function getBatch(string calldata batchNumber)
        external
        view
        returns (
            string memory batchNum,
            string memory clusterCode,
            string memory clusterName,
            string memory floralSource,
            uint256 quantityGrams,
            uint256 harvestTimestamp,
            BatchStatus status,
            address beekeeperAddress,
            bool exists
        )
    {
        BatchRecord storage r = batches[batchNumber];
        require(r.exists, "BeeProof: Batch does not exist");
        return (
            r.batchNumber,
            r.clusterCode,
            r.clusterName,
            r.floralSource,
            r.quantityGrams,
            r.harvestTimestamp,
            r.status,
            r.beekeeperAddress,
            r.exists
        );
    }

    function getQualityAssay(string calldata batchNumber)
        external
        view
        returns (QualityAssay memory)
    {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");
        return batches[batchNumber].quality;
    }

    function getTimeline(string calldata batchNumber)
        external
        view
        returns (TimelineEvent[] memory)
    {
        require(batches[batchNumber].exists, "BeeProof: Batch does not exist");
        return batchTimelines[batchNumber];
    }

    function verifyProvenance(string calldata batchNumber)
        external
        view
        returns (
            bool isValid,
            bool isCertified,
            string memory clusterName,
            uint256 pollenPurityScoreX100,
            uint256 timelineCount
        )
    {
        BatchRecord storage r = batches[batchNumber];
        if (!r.exists) {
            return (false, false, "", 0, 0);
        }
        return (
            true,
            r.quality.isCertified,
            r.clusterName,
            r.quality.pollenPurityScoreX100,
            batchTimelines[batchNumber].length
        );
    }
}
