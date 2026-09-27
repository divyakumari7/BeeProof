package com.beeproof.repository;

import com.beeproof.domain.Hive;
import com.beeproof.domain.HiveAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiveAlertRepository extends JpaRepository<HiveAlert, Long> {
    List<HiveAlert> findByHiveOrderByCreatedAtDesc(Hive hive);
    List<HiveAlert> findByHiveAndStatusOrderByCreatedAtDesc(Hive hive, HiveAlert.AlertStatus status);
    List<HiveAlert> findByStatusOrderByCreatedAtDesc(HiveAlert.AlertStatus status);
    long countByStatus(HiveAlert.AlertStatus status);
}
