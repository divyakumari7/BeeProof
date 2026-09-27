package com.beeproof.repository;

import com.beeproof.domain.Hive;
import com.beeproof.domain.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
    Optional<Sensor> findBySensorIdentifier(String sensorIdentifier);
    List<Sensor> findByHive(Hive hive);
}
