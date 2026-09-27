package com.beeproof.repository;

import com.beeproof.domain.Hive;
import com.beeproof.domain.HiveHealthPrediction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiveHealthPredictionRepository extends JpaRepository<HiveHealthPrediction, Long> {
    List<HiveHealthPrediction> findByHiveOrderByGeneratedAtDesc(Hive hive, Pageable pageable);
    List<HiveHealthPrediction> findByHiveOrderByGeneratedAtDesc(Hive hive);
}
