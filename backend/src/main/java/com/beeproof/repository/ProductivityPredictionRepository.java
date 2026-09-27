package com.beeproof.repository;

import com.beeproof.domain.Hive;
import com.beeproof.domain.ProductivityPrediction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductivityPredictionRepository extends JpaRepository<ProductivityPrediction, Long> {
    List<ProductivityPrediction> findByHiveOrderByGeneratedAtDesc(Hive hive, Pageable pageable);
    List<ProductivityPrediction> findByHiveOrderByGeneratedAtDesc(Hive hive);
}
