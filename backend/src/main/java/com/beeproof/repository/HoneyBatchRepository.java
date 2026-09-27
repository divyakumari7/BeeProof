package com.beeproof.repository;

import com.beeproof.domain.Cluster;
import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.enums.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoneyBatchRepository extends JpaRepository<HoneyBatch, Long> {
    Optional<HoneyBatch> findByBatchNumber(String batchNumber);
    List<HoneyBatch> findByCluster(Cluster cluster);
    List<HoneyBatch> findByStatus(BatchStatus status);
}
