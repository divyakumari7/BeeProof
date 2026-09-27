package com.beeproof.repository;

import com.beeproof.domain.Sensor;
import com.beeproof.domain.SensorReading;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {

    List<SensorReading> findBySensorOrderByRecordedAtDesc(Sensor sensor, Pageable pageable);

    @Query("SELECT r FROM SensorReading r WHERE r.sensor.hive.id = :hiveId ORDER BY r.recordedAt DESC")
    List<SensorReading> findRecentByHiveId(@Param("hiveId") Long hiveId, Pageable pageable);

    @Query("SELECT r FROM SensorReading r WHERE r.sensor.hive.id = :hiveId AND r.recordedAt >= :since ORDER BY r.recordedAt ASC")
    List<SensorReading> findByHiveIdSince(@Param("hiveId") Long hiveId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(r) FROM SensorReading r WHERE r.sensor.hive.id = :hiveId")
    long countByHiveId(@Param("hiveId") Long hiveId);
}
