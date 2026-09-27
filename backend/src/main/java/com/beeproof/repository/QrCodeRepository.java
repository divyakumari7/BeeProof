package com.beeproof.repository;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.QrCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCodeEntity, Long> {
    Optional<QrCodeEntity> findByQrSecurityToken(String qrSecurityToken);
    Optional<QrCodeEntity> findByBatch(HoneyBatch batch);
}
