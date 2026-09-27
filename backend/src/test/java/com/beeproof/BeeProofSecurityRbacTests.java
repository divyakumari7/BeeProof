package com.beeproof;

import com.beeproof.dto.LoginRequest;
import com.beeproof.dto.LoginResponse;
import com.beeproof.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class BeeProofSecurityRbacTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    private String adminToken;
    private String beekeeperToken;
    private String processorToken;

    @BeforeEach
    void setupTokens() {
        LoginResponse adminLogin = authService.login(new LoginRequest("admin@beeproof.org", "BeeProof@2026!"));
        adminToken = adminLogin.getToken();

        LoginResponse bkLogin = authService.login(new LoginRequest("beekeeper1@beeproof.org", "BeeProof@2026!"));
        beekeeperToken = bkLogin.getToken();

        LoginResponse procLogin = authService.login(new LoginRequest("processor@beeproof.org", "BeeProof@2026!"));
        processorToken = procLogin.getToken();
    }

    @Test
    void testPublicHealthEndpointAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    void testPublicBatchVerificationEndpointAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/api/verify/batch/BP-2026-SUN-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.verificationStatus").value("Provenance Verified"));
    }

    @Test
    void testAdminEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/overview"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testAdminEndpointAllowsAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/overview")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalBeekeepers").value(5))
                .andExpect(jsonPath("$.data.totalClusters").value(3))
                .andExpect(jsonPath("$.data.totalHives").value(15));
    }

    @Test
    void testAdminEndpointForbiddenForBeekeeperRole() throws Exception {
        mockMvc.perform(get("/api/admin/overview")
                        .header("Authorization", "Bearer " + beekeeperToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testBeekeeperEndpointAllowsBeekeeperRole() throws Exception {
        mockMvc.perform(get("/api/beekeeper/dashboard")
                        .header("Authorization", "Bearer " + beekeeperToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.kvicRegistrationNumber").value("KVIC-WB-2026-001"))
                .andExpect(jsonPath("$.data.clusterCode").value("SUN-MNG-01"));
    }

    @Test
    void testBeekeeperEndpointForbiddenForProcessorRole() throws Exception {
        mockMvc.perform(get("/api/beekeeper/dashboard")
                        .header("Authorization", "Bearer " + processorToken))
                .andExpect(status().isForbidden());
    }
}
