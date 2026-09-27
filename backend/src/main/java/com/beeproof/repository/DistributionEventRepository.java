package com.beeproof.repository;

import com.beeproof.domain.DistributionEvent;
import com.beeproof.domain.HoneyBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionEventRepository extends JpaRepository<DistributionEvent, Long> {
    List<DistributionEvent> findByBatch(HoneyBatch batch);
}
