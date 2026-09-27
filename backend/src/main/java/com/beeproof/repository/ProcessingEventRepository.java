package com.beeproof.repository;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.ProcessingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessingEventRepository extends JpaRepository<ProcessingEvent, Long> {
    List<ProcessingEvent> findByBatch(HoneyBatch batch);
}
