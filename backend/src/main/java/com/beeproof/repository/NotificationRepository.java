package com.beeproof.repository;

import com.beeproof.domain.NotificationEntity;
import com.beeproof.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByRecipientOrderByCreatedAtDesc(User recipient);
}
