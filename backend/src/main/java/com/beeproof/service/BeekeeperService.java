package com.beeproof.service;

import com.beeproof.domain.Beekeeper;
import com.beeproof.domain.Cluster;
import com.beeproof.domain.Hive;
import com.beeproof.domain.enums.HiveStatus;
import com.beeproof.dto.DomainDtos.BeekeeperOverviewResponse;
import com.beeproof.dto.DomainDtos.HiveDto;
import com.beeproof.exception.ResourceNotFoundException;
import com.beeproof.repository.BeekeeperRepository;
import com.beeproof.repository.HiveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeekeeperService {

    private final BeekeeperRepository beekeeperRepository;
    private final HiveRepository hiveRepository;

    public BeekeeperService(BeekeeperRepository beekeeperRepository, HiveRepository hiveRepository) {
        this.beekeeperRepository = beekeeperRepository;
        this.hiveRepository = hiveRepository;
    }

    @Transactional(readOnly = true)
    public BeekeeperOverviewResponse getDashboard(String username) {
        Beekeeper beekeeper = beekeeperRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Beekeeper profile not found for account: " + username));

        Cluster cluster = beekeeper.getAssignedCluster();
        List<Hive> hives = hiveRepository.findByBeekeeper(beekeeper);

        long activeCount = hives.stream().filter(h -> h.getStatus() == HiveStatus.ACTIVE).count();

        List<HiveDto> hiveDtos = hives.stream().map(h -> HiveDto.builder()
                .id(h.getId())
                .hiveCode(h.getHiveCode())
                .clusterCode(h.getCluster().getClusterCode())
                .clusterName(h.getCluster().getName())
                .beekeeperName(beekeeper.getUser().getFullName())
                .status(h.getStatus().name())
                .beeSpecies(h.getBeeSpecies())
                .installationDate(h.getInstallationDate())
                .latitude(h.getLatitude())
                .longitude(h.getLongitude())
                .notes(h.getNotes())
                .build()
        ).collect(Collectors.toList());

        return BeekeeperOverviewResponse.builder()
                .beekeeperId(beekeeper.getId())
                .fullName(beekeeper.getUser().getFullName())
                .kvicRegistrationNumber(beekeeper.getKvicRegistrationNumber())
                .cooperativeName(beekeeper.getCooperativeName())
                .state(beekeeper.getState())
                .district(beekeeper.getDistrict())
                .clusterName(cluster != null ? cluster.getName() : "Unassigned")
                .clusterCode(cluster != null ? cluster.getClusterCode() : "N/A")
                .predominantFlora(cluster != null ? cluster.getPredominantFlora() : "Mixed Wildflower")
                .assignedHiveCount(hives.size())
                .activeHiveCount(activeCount)
                .hives(hiveDtos)
                .build();
    }
}
