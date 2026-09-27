package com.beeproof;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.dto.CreateBatchRequest;
import com.beeproof.dto.LoginRequest;
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
public class BeeProofPhase2Tests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HoneyBatchRepository honeyBatchRepository;

    private String getBeekeeper1Token() throws Exception {
        LoginRequest login = new LoginRequest("beekeeper1@beeproof.org", "BeeProof@2026!");
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode node = objectMapper.readTree(res.getResponse().getContentAsString());
        return node.get("data").get("token").asText();
    }

    @Test
    @DisplayName("2.1 & 2.2: Beekeeper can create harvest batch with real blockchain record & QR code")
    void testCreateHarvestBatchSuccess() throws Exception {
        String token = getBeekeeper1Token();

        // Hive 1 belongs to beekeeper 1
        CreateBatchRequest request = new CreateBatchRequest(
                1L,
                35.5,
                "Wild Mangrove Bloom",
                LocalDate.now(),
                17.5,
                "Prime early morning harvest from Tidal Hive 1"
        );

        MvcResult result = mockMvc.perform(post("/api/beekeeper/batches")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.batchNumber").value(startsWith("BP-2026-")))
                .andExpect(jsonPath("$.data.totalQuantityKg").value(35.5))
                .andExpect(jsonPath("$.data.blockchainTxHash").isNotEmpty())
                .andExpect(jsonPath("$.data.stateMerkleRoot").isNotEmpty())
                .andExpect(jsonPath("$.data.qrCodeUrl").isNotEmpty())
                .andReturn();

        JsonNode data = objectMapper.readTree(result.getResponse().getContentAsString()).get("data");
        String batchNumber = data.get("batchNumber").asText();

        // Verify public lookup works without authentication
        mockMvc.perform(get("/api/verify/batch/" + batchNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.verificationStatus").value("Provenance Verified"))
                .andExpect(jsonPath("$.data.blockchainVerified").value(true))
                // CRITICAL REQUIREMENT: Only actual persisted events should be returned (Harvest only!)
                .andExpect(jsonPath("$.data.timeline", hasSize(1)))
                .andExpect(jsonPath("$.data.timeline[0].stage").value("HARVEST"));
    }

    @Test
    @DisplayName("2.1: Beekeeper cannot create batch for another beekeeper's hive (Access Denied)")
    void testCreateBatchUnauthorizedHiveFails() throws Exception {
        String token = getBeekeeper1Token();

        // Hive 4 belongs to beekeeper 2, not beekeeper 1!
        CreateBatchRequest request = new CreateBatchRequest(
                4L,
                20.0,
                "Wild Mangrove",
                LocalDate.now(),
                18.0,
                "Attempting unauthorized extraction"
        );

        mockMvc.perform(post("/api/beekeeper/batches")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("2.3: Hash Tampering Detection — Mismatched database data fails verification")
    void testHashTamperingDetection() throws Exception {
        String token = getBeekeeper1Token();

        CreateBatchRequest request = new CreateBatchRequest(
                2L,
                40.0,
                "Raw Acacia Nectar",
                LocalDate.now(),
                17.2,
                "Unadulterated harvest"
        );

        MvcResult result = mockMvc.perform(post("/api/beekeeper/batches")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String batchNumber = objectMapper.readTree(result.getResponse().getContentAsString()).get("data").get("batchNumber").asText();

        // Tamper with the database record directly (e.g. simulate malicious direct SQL update)
        HoneyBatch batch = honeyBatchRepository.findByBatchNumber(batchNumber).orElseThrow();
        batch.setTotalQuantityKg(999.0); // Tampered quantity!
        honeyBatchRepository.save(batch);

        // Verification must now fail!
        mockMvc.perform(get("/api/verify/batch/" + batchNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.verificationStatus").value("Verification Failed — Data may have been tampered."))
                .andExpect(jsonPath("$.data.blockchainVerified").value(false));
    }

    @Test
    @DisplayName("2.5: Nonexistent batch returns 404")
    void testNonExistentBatchReturns404() throws Exception {
        mockMvc.perform(get("/api/verify/batch/BP-NON-EXISTENT-999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
