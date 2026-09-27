package com.beeproof.repository;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.QualityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QualityReportRepository extends JpaRepository<QualityReport, Long> {
    Optional<QualityReport> findByBatch(HoneyBatch batch);
    Optional<QualityReport> findByCertificateNumber(String certificateNumber);
}
