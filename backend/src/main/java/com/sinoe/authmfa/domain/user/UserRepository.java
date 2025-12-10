package com.sinoe.authmfa.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByActivationToken(String activationToken);

    // Nuevo: búsqueda para completar el primer inicio de sesión
    Optional<User> findByFirstLoginToken(String token);

    // Nuevo: listar usuarios por rol (por ejemplo, ADMIN)
    List<User> findByRole(UserRole role);
}
