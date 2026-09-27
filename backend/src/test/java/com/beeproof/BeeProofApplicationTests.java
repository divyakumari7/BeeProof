package com.beeproof;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.User;
import com.beeproof.domain.enums.UserRole;
import com.beeproof.dto.LoginRequest;
import com.beeproof.dto.LoginResponse;
import com.beeproof.repository.BeekeeperRepository;
import com.beeproof.repository.ClusterRepository;
import com.beeproof.repository.HiveRepository;
import com.beeproof.repository.HoneyBatchRepository;
import com.beeproof.repository.UserRepository;
import com.beeproof.security.JwtTokenProvider;
import com.beeproof.service.AuthService;
import com.beeproof.service.VerificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class BeeProofApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BeekeeperRepository beekeeperRepository;

    @Autowired
    private ClusterRepository clusterRepository;

    @Autowired
    private HiveRepository hiveRepository;

    @Autowired
    private HoneyBatchRepository honeyBatchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testContextLoadsAndSeedDataIntegrity() {
        // 1. Verify Admin user exists
        Optional<User> adminOpt = userRepository.findByUsername("admin@beeproof.org");
        assertTrue(adminOpt.isPresent(), "Admin user must be seeded");
        assertTrue(adminOpt.get().getRoles().stream().anyMatch(r -> r.getName() == UserRole.ADMIN_KVIC));

        // 2. Verify 5 Beekeepers seeded
        assertEquals(5, beekeeperRepository.count(), "Exactly 5 beekeepers must be seeded");

        // 3. Verify 3 Clusters seeded
        assertEquals(3, clusterRepository.count(), "Exactly 3 clusters must be seeded");

        // 4. Verify 15 Hives seeded (5 per cluster)
        assertEquals(15, hiveRepository.count(), "Exactly 15 hives must be seeded");

        // 5. Verify demo batch seeded for verification
        Optional<HoneyBatch> batchOpt = honeyBatchRepository.findByBatchNumber("BP-2026-SUN-001");
        assertTrue(batchOpt.isPresent(), "Demo batch BP-2026-SUN-001 must be present");
    }

    @Test
    void testPasswordHashingWithBCrypt() {
        User admin = userRepository.findByUsername("admin@beeproof.org").orElseThrow();
        // The stored password must not be plaintext
        assertNotEquals("BeeProof@2026!", admin.getPassword());
        // BCrypt matcher must verify correctly
        assertTrue(passwordEncoder.matches("BeeProof@2026!", admin.getPassword()));
    }

    @Test
    void testAuthenticationSuccessAndJwtGeneration() {
        LoginResponse response = authService.login(new LoginRequest("admin@beeproof.org", "BeeProof@2026!"));
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().length() > 20);
        assertEquals("Bearer", response.getType());
        assertEquals("admin@beeproof.org", response.getUser().getUsername());

        // Validate generated JWT
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        assertEquals("admin@beeproof.org", jwtTokenProvider.getUsernameFromJwt(response.getToken()));
    }

    @Test
    void testInvalidLoginRejection() {
        assertThrows(BadCredentialsException.class, () -> {
            authService.login(new LoginRequest("admin@beeproof.org", "WrongPassword123!"));
        });
    }

    @Test
    void testPublicBatchProvenanceVerificationWithoutLogin() {
        var response = verificationService.verifyBatch("BP-2026-SUN-001");
        assertNotNull(response);
        assertEquals("BP-2026-SUN-001", response.getBatchNumber());
        assertEquals("Provenance Verified", response.getVerificationStatus());
        assertNotNull(response.getClusterName());
        assertNotNull(response.getQualitySummary());
        assertEquals("PASSED", response.getQualitySummary().getVerdict());
        assertTrue(response.getTimeline().size() >= 3);
    }
}
