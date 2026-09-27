package com.beeproof.repository;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.PackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<PackageEntity, Long> {
    Optional<PackageEntity> findBySerialNumber(String serialNumber);
    List<PackageEntity> findByBatch(HoneyBatch batch);
}
