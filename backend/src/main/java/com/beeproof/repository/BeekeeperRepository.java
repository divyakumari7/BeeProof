package com.beeproof.repository;

import com.beeproof.domain.Beekeeper;
import com.beeproof.domain.Cluster;
import com.beeproof.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeekeeperRepository extends JpaRepository<Beekeeper, Long> {
    Optional<Beekeeper> findByUser(User user);
    Optional<Beekeeper> findByUserUsername(String username);
    Optional<Beekeeper> findByKvicRegistrationNumber(String kvicRegistrationNumber);
    List<Beekeeper> findByAssignedCluster(Cluster cluster);
}
