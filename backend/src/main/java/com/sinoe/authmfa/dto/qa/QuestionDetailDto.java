package com.sinoe.authmfa.dto.qa;

import java.time.Instant;

/** Detalle para el dueño (student) o para revisión (tutor si lo necesitas). */
public record QuestionDetailDto(
        Long id,
        String title,
        String body,
        String status,
        String scope,
        String rejectReason,
        Long currentAnswerId,
        String currentAnswerBody,
        Integer currentAnswerVersion,
        boolean wasCorrected, // version > 1
        Instant createdAt,
        Instant updatedAt) {
}