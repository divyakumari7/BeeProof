package com.beeproof.repository;

import com.beeproof.domain.BlockchainRecord;
import com.beeproof.domain.HoneyBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockchainRecordRepository extends JpaRepository<BlockchainRecord, Long> {
    Optional<BlockchainRecord> findByTransactionHash(String transactionHash);
    List<BlockchainRecord> findByBatch(HoneyBatch batch);
    Optional<BlockchainRecord> findFirstByBatchOrderByRecordedAtDesc(HoneyBatch batch);
}
