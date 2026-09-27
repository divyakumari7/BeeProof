package com.beeproof;

import com.beeproof.domain.enums.BatchStatus;
import com.beeproof.dto.CreateBatchRequest;
import com.beeproof.dto.LoginRequest;
import com.beeproof.dto.SupplyChainDtos.*;
import com.beeproof.repository.HoneyBatchRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class BeeProofPhase3Tests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HoneyBatchRepository honeyBatchRepository;

    private String login(String username, String password) throws Exception {
        LoginRequest req = new LoginRequest(username, password);
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString())
                .get("data").get("token").asText();
    }

    @Test
    @DisplayName("3.1-3.7: Complete Supply Chain Lifecycle with State Transition Guards & Consumer Timeline")
    void testCompleteSupplyChainWorkflow() throws Exception {
        String beekeeperToken = login("beekeeper1@beeproof.org", "BeeProof@2026!");
        String processorToken = login("processor@beeproof.org", "BeeProof@2026!");
        String labToken = login("lab@beeproof.org", "BeeProof@2026!");
        String distributorToken = login("distributor@beeproof.org", "BeeProof@2026!");

        // Step 1: Beekeeper creates a fresh batch
        CreateBatchRequest createReq = new CreateBatchRequest(
                1L,
                80.0,
                "Sundarbans Mangrove Blossom",
                LocalDate.now(),
                17.8,
                "High quality nectar harvest"
        );
        MvcResult createRes = mockMvc.perform(post("/api/beekeeper/batches")
                        .header("Authorization", "Bearer " + beekeeperToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isOk())
                .andReturn();
        String batchNumber = objectMapper.readTree(createRes.getResponse().getContentAsString())
                .get("data").get("batchNumber").asText();

        // GUARD TEST: Attempting to package before quality verification must be BLOCKED!
        PackageBatchRequest earlyPkgReq = new PackageBatchRequest();
        earlyPkgReq.setPackagingType("500g_GLASS_JAR");
        earlyPkgReq.setUnitCount(50);
        earlyPkgReq.setNetWeightGrams(500.0);
        mockMvc.perform(post("/api/processor/batches/" + batchNumber + "/package")
                        .header("Authorization", "Bearer " + processorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(earlyPkgReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("MUST be QUALITY_VERIFIED")));

        // Step 2: Processor processes the batch
        ProcessBatchRequest procReq = new ProcessBatchRequest(
                "Apex Honey Processing Facility",
                "COLD_MICRO_FILTRATION",
                80.0,
                17.4,
                37.8,
                "Maintained native pollen viability and active diastase"
        );
        mockMvc.perform(post("/api/processor/batches/" + batchNumber + "/process")
                        .header("Authorization", "Bearer " + processorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(procReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.operationType").value("COLD_MICRO_FILTRATION"));

        // Step 3: Quality Lab performs NMR assay and approves batch
        QualityVerificationRequest qaReq = new QualityVerificationRequest();
        qaReq.setCertificateNumber("BP-NABL-2026-CERT-" + System.currentTimeMillis() % 1000);
        qaReq.setLaboratoryName("National Agro-Food NMR Quality Testing Centre");
        qaReq.setMoisturePercentage(17.4);
        qaReq.setPollenPurityScore(97.8);
        qaReq.setNmrSpectroscopyPassed(true);
        qaReq.setC4SugarAdulterationDetected(false);
        qaReq.setOverallVerdict("PASSED");
        qaReq.setRemarks("Confirmed genuine botanical unadulterated origin");

        mockMvc.perform(post("/api/quality-lab/batches/" + batchNumber + "/verify")
                        .header("Authorization", "Bearer " + labToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(qaReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.overallVerdict").value("PASSED"));

        // Step 4: Processor packages the batch (now authorized because batch is QUALITY_VERIFIED)
        PackageBatchRequest pkgReq = new PackageBatchRequest();
        pkgReq.setPackagingType("500g_GLASS_JAR");
        pkgReq.setUnitCount(160);
        pkgReq.setNetWeightGrams(500.0);
        pkgReq.setBestBeforeMonths(24);

        mockMvc.perform(post("/api/processor/batches/" + batchNumber + "/package")
                        .header("Authorization", "Bearer " + processorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pkgReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(160)));

        // GUARD TEST: Cannot DELIVER before DISPATCHED!
        DeliverBatchRequest earlyDeliverReq = new DeliverBatchRequest();
        earlyDeliverReq.setDestinationDepot("Delhi Central Cold Depot");
        mockMvc.perform(post("/api/distributor/batches/" + batchNumber + "/deliver")
                        .header("Authorization", "Bearer " + distributorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(earlyDeliverReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("CANNOT become DELIVERED before being DISPATCHED")));

        // Step 5: Distributor dispatches the batch
        DispatchBatchRequest dispatchReq = new DispatchBatchRequest();
        dispatchReq.setOriginLocation("Kolkata Packaging Center");
        dispatchReq.setDestinationLocation("Delhi Cold-Chain Distribution Depot");
        dispatchReq.setQuantityDispatchedKg(80.0);
        dispatchReq.setAmbientTemperatureCelsius(20.5);
        dispatchReq.setTrackingReference("TRK-PHASE3-991");

        mockMvc.perform(post("/api/distributor/batches/" + batchNumber + "/dispatch")
                        .header("Authorization", "Bearer " + distributorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dispatchReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.trackingReference").value("TRK-PHASE3-991"));

        // Step 6: Distributor confirms delivery at destination
        DeliverBatchRequest deliverReq = new DeliverBatchRequest();
        deliverReq.setDestinationDepot("Delhi National Distribution Hub");
        deliverReq.setRemarks("Delivered with cold-chain seal intact");

        mockMvc.perform(post("/api/distributor/batches/" + batchNumber + "/deliver")
                        .header("Authorization", "Bearer " + distributorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deliverReq)))
                .andExpect(status().isOk());

        // Step 7: Public Consumer Verification Timeline reflects ALL 4 real stages
        mockMvc.perform(get("/api/verify/batch/" + batchNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.verificationStatus").value("Provenance Verified"))
                .andExpect(jsonPath("$.data.blockchainVerified").value(true))
                .andExpect(jsonPath("$.data.timeline", hasSize(4)))
                .andExpect(jsonPath("$.data.timeline[0].stage").value("HARVEST"))
                .andExpect(jsonPath("$.data.timeline[1].stage").value("PROCESSING"))
                .andExpect(jsonPath("$.data.timeline[2].stage").value("TESTING"))
                .andExpect(jsonPath("$.data.timeline[3].stage").value("DISTRIBUTION"));
    }
}
