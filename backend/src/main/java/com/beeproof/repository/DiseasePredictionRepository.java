package com.beeproof.repository;

import com.beeproof.domain.DiseasePrediction;
import com.beeproof.domain.Hive;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiseasePredictionRepository extends JpaRepository<DiseasePrediction, Long> {
    List<DiseasePrediction> findByHiveOrderByDetectedAtDesc(Hive hive, Pageable pageable);
    List<DiseasePrediction> findByHiveOrderByDetectedAtDesc(Hive hive);
}
