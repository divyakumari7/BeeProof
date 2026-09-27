package com.beeproof.dto;

import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Set<String> roles;
    private String primaryRole;
    private String kvicRegistrationNumber;
    private String assignedClusterName;

    public UserDto() {}

    public UserDto(Long id, String username, String email, String fullName, String phoneNumber,
                   Set<String> roles, String primaryRole, String kvicRegistrationNumber, String assignedClusterName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.primaryRole = primaryRole;
        this.kvicRegistrationNumber = kvicRegistrationNumber;
        this.assignedClusterName = assignedClusterName;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public static class UserDtoBuilder {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Set<String> roles;
        private String primaryRole;
        private String kvicRegistrationNumber;
        private String assignedClusterName;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder username(String username) { this.username = username; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserDtoBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserDtoBuilder roles(Set<String> roles) { this.roles = roles; return this; }
        public UserDtoBuilder primaryRole(String primaryRole) { this.primaryRole = primaryRole; return this; }
        public UserDtoBuilder kvicRegistrationNumber(String reg) { this.kvicRegistrationNumber = reg; return this; }
        public UserDtoBuilder assignedClusterName(String cluster) { this.assignedClusterName = cluster; return this; }

        public UserDto build() {
            return new UserDto(id, username, email, fullName, phoneNumber, roles, primaryRole, kvicRegistrationNumber, assignedClusterName);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public String getPrimaryRole() { return primaryRole; }
    public void setPrimaryRole(String primaryRole) { this.primaryRole = primaryRole; }
    public String getKvicRegistrationNumber() { return kvicRegistrationNumber; }
    public void setKvicRegistrationNumber(String kvicRegistrationNumber) { this.kvicRegistrationNumber = kvicRegistrationNumber; }
    public String getAssignedClusterName() { return assignedClusterName; }
    public void setAssignedClusterName(String assignedClusterName) { this.assignedClusterName = assignedClusterName; }
}
