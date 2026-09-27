package com.beeproof.domain;

import com.beeproof.domain.enums.UserRole;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private UserRole name;

    @Column(length = 255)
    private String description;

    public Role() {}

    public Role(Long id, UserRole name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static RoleBuilder builder() {
        return new RoleBuilder();
    }

    public static class RoleBuilder {
        private Long id;
        private UserRole name;
        private String description;

        public RoleBuilder id(Long id) { this.id = id; return this; }
        public RoleBuilder name(UserRole name) { this.name = name; return this; }
        public RoleBuilder description(String description) { this.description = description; return this; }

        public Role build() {
            return new Role(id, name, description);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserRole getName() { return name; }
    public void setName(UserRole name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
