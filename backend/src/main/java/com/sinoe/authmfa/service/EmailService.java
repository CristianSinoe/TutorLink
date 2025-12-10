package com.sinoe.authmfa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${tutorlink.mail.from}")
    private String fromEmail;

    @Value("${tutorlink.frontend-base-url}")
    private String frontendBaseUrl;

    // =========================
    // 1) Correo de primer login / activación
    // =========================
    public void sendFirstLoginEmail(String toEmail, String activationToken) {
        String url = frontendBaseUrl + "/first-login?token=" + activationToken;

        String subject = "TutorLink - Activa tu cuenta y crea tu contraseña";

        String html = """
                <h2>Bienvenido a TutorLink</h2>
                <p>Tu cuenta fue creada por el administrador.</p>
                <p>Haz clic en el siguiente enlace para activar tu cuenta y establecer tu primera contraseña:</p>
                <p><a href="%s" style="font-size:16px; font-weight:bold;">Activar cuenta</a></p>
                <p>Si no solicitaste esta cuenta, simplemente ignora este mensaje.</p>
                """.formatted(url);

        sendEmail(toEmail, subject, html);
    }

    // =========================
    // 2) Correo genérico HTML
    // =========================
    public void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
            log.info("Correo enviado a {}", toEmail);
        } catch (Exception e) {
            log.error("Error enviando correo a {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("No se pudo enviar el correo", e);
        }
    }

    // =========================
    // 3) NUEVO: correo para cambio de contraseña (OTP)
    // =========================
    public void sendPasswordChangeOtpEmail(String toEmail, String code) {
        String subject = "TutorLink - Código para cambio de contraseña";

        String html = """
                <h2>Cambio de contraseña en TutorLink</h2>
                <p>Estás realizando un cambio de contraseña en tu cuenta.</p>
                <p>Tu código de verificación es:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">%s</p>
                <p>Este código es temporal y solo puede usarse una vez.</p>
                <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>
                """.formatted(code);

        sendEmail(toEmail, subject, html);
    }
}
