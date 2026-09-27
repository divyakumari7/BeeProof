package com.beeproof.repository;

import com.beeproof.domain.Beekeeper;
import com.beeproof.domain.Cluster;
import com.beeproof.domain.Hive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HiveRepository extends JpaRepository<Hive, Long> {
    Optional<Hive> findByHiveCode(String hiveCode);
    List<Hive> findByBeekeeper(Beekeeper beekeeper);
    List<Hive> findByCluster(Cluster cluster);
    long countByBeekeeper(Beekeeper beekeeper);
}
