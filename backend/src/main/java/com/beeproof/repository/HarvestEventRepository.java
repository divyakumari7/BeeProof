package com.beeproof.repository;

import com.beeproof.domain.Beekeeper;
import com.beeproof.domain.HarvestEvent;
import com.beeproof.domain.HoneyBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HarvestEventRepository extends JpaRepository<HarvestEvent, Long> {
    List<HarvestEvent> findByBatch(HoneyBatch batch);
    List<HarvestEvent> findByBeekeeper(Beekeeper beekeeper);
}
