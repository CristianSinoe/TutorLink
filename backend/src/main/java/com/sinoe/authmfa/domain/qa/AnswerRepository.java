package com.sinoe.authmfa.domain.qa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // Historial de respuestas de una pregunta (ordenadas por versión)
    List<Answer> findByQuestion_IdOrderByVersionAsc(Long questionId);

    // Total de respuestas de un tutor (para dashboard)
    long countByTutor_Id(Long tutorId);

    // Respuestas de un tutor en un rango de fechas (hoy, última semana, etc.)
    long countByTutor_IdAndCreatedAtBetween(
            Long tutorId,
            Instant start,
            Instant end);

    List<Answer> findByTutor_IdOrderByCreatedAtDesc(Long tutorId);

}
