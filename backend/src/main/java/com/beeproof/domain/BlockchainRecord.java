package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records", indexes = {
    @Index(name = "idx_blockchain_tx", columnList = "transactionHash"),
    @Index(name = "idx_blockchain_batch", columnList = "batch_id")
})
public class BlockchainRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @Column(nullable = false, length = 100)
    private String eventType;

    @Column(nullable = false, length = 128)
    private String stateMerkleRoot;

    @Column(nullable = false, unique = true, length = 128)
    private String transactionHash;

    private Long blockNumber;

    @Column(length = 64)
    private String networkName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;

    public BlockchainRecord() {}

    public BlockchainRecord(Long id, HoneyBatch batch, String eventType, String stateMerkleRoot, String transactionHash,
                            Long blockNumber, String networkName, LocalDateTime recordedAt) {
        this.id = id;
        this.batch = batch;
        this.eventType = eventType;
        this.stateMerkleRoot = stateMerkleRoot;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.networkName = networkName;
        this.recordedAt = recordedAt;
    }

    public static BlockchainRecordBuilder builder() { return new BlockchainRecordBuilder(); }

    public static class BlockchainRecordBuilder {
        private Long id;
        private HoneyBatch batch;
        private String eventType;
        private String stateMerkleRoot;
        private String transactionHash;
        private Long blockNumber;
        private String networkName;
        private LocalDateTime recordedAt;

        public BlockchainRecordBuilder id(Long id) { this.id = id; return this; }
        public BlockchainRecordBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public BlockchainRecordBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public BlockchainRecordBuilder stateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; return this; }
        public BlockchainRecordBuilder transactionHash(String transactionHash) { this.transactionHash = transactionHash; return this; }
        public BlockchainRecordBuilder blockNumber(Long blockNumber) { this.blockNumber = blockNumber; return this; }
        public BlockchainRecordBuilder networkName(String networkName) { this.networkName = networkName; return this; }
        public BlockchainRecordBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }

        public BlockchainRecord build() {
            return new BlockchainRecord(id, batch, eventType, stateMerkleRoot, transactionHash, blockNumber, networkName, recordedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getStateMerkleRoot() { return stateMerkleRoot; }
    public void setStateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; }
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
    public String getNetworkName() { return networkName; }
    public void setNetworkName(String networkName) { this.networkName = networkName; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
