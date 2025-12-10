package com.sinoe.authmfa.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tl_users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos personales
    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "last_name_paterno", nullable = false, length = 120)
    private String lastNamePaterno;

    @Column(name = "last_name_materno", length = 120)
    private String lastNameMaterno;

    // Email (único)
    @Column(nullable = false, unique = true, length = 190)
    private String email;

    // Hash de contraseña
    @JsonIgnore
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    // Rol del usuario
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    // Estado interno (CREATED_BY_ADMIN, ACTIVE, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserStatus status;

    // Tokens de activación (si los usas)
    @Column(name = "activation_token", length = 255)
    private String activationToken;

    @Column(name = "activation_expires_at")
    private OffsetDateTime activationExpiresAt;

    // Auditoría
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @PrePersist
    public void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    //   Token de primer inicio

    @Column(name = "first_login_token", length = 255)
    private String firstLoginToken;

    @Column(name = "first_login_expires_at")
    private Instant firstLoginExpiresAt;

}
