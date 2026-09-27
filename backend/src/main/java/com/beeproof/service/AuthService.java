package com.beeproof.service;

import com.beeproof.domain.Beekeeper;
import com.beeproof.domain.User;
import com.beeproof.dto.LoginRequest;
import com.beeproof.dto.LoginResponse;
import com.beeproof.dto.UserDto;
import com.beeproof.repository.BeekeeperRepository;
import com.beeproof.repository.UserRepository;
import com.beeproof.security.JwtTokenProvider;
import com.beeproof.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final BeekeeperRepository beekeeperRepository;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository,
                       BeekeeperRepository beekeeperRepository,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.beekeeperRepository = beekeeperRepository;
        this.auditService = auditService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        UserDto userDto = buildUserDto(user);

        auditService.log("USER_LOGIN", "User", user.getId().toString(), user.getUsername(), "Successful login via credentials");

        return LoginResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
        return buildUserDto(user);
    }

    private UserDto buildUserDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        String primaryRole = roleNames.stream().findFirst().orElse("USER");

        String kvicReg = null;
        String clusterName = null;

        Optional<Beekeeper> beekeeperOpt = beekeeperRepository.findByUser(user);
        if (beekeeperOpt.isPresent()) {
            Beekeeper b = beekeeperOpt.get();
            kvicReg = b.getKvicRegistrationNumber();
            if (b.getAssignedCluster() != null) {
                clusterName = b.getAssignedCluster().getName();
            }
        }

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .roles(roleNames)
                .primaryRole(primaryRole)
                .kvicRegistrationNumber(kvicReg)
                .assignedClusterName(clusterName)
                .build();
    }
}
