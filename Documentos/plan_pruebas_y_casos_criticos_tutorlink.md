# Plan de Pruebas y Casos de Prueba Críticos - TutorLink

Fecha de elaboración: 2026-03-24

## 1. Propósito del documento

Este documento define un plan de pruebas para TutorLink, centrado en la lógica de los servicios principales del backend y en las funcionalidades core del sistema. Su objetivo es servir como base para pruebas funcionales, de integración y futuras automatizaciones.

El análisis se basa principalmente en los servicios:

- `AdminUserService`
- `QaService`
- `OtpService`
- `UserService`
- `JwtService`
- `RecaptchaService`
- `EmailService`
- `AuditService`

## 2. Objetivos del plan de pruebas

- Verificar que las reglas de negocio críticas se cumplan correctamente.
- Validar caminos felices de los flujos principales.
- Validar manejo de errores, restricciones y casos límite relevantes.
- Reducir riesgo de regresión en autenticación, onboarding, asignaciones y ciclo de preguntas/respuestas.
- Asegurar coherencia entre persistencia, estado funcional y respuestas del sistema.

## 3. Alcance

### 3.1 Funcionalidades incluidas

- autenticación y seguridad,
- OTP de login y cambio de contraseña,
- creación de usuarios por administración,
- activación / primer acceso,
- importaciones CSV,
- cambios de estado de usuario,
- asignación tutor-estudiante,
- creación de preguntas,
- respuesta, corrección, rechazo y reclasificación de preguntas,
- consultas paginadas y validaciones de filtros,
- envío de correo y auditoría básica.

### 3.2 Funcionalidades fuera de alcance directo

- pruebas de interfaz visual detallada,
- rendimiento bajo carga,
- pruebas de compatibilidad entre navegadores,
- pruebas de infraestructura externa real,
- pruebas E2E completas del frontend.

## 4. Estrategia de pruebas

Se propone una estrategia combinada:

- `Pruebas unitarias`: para validar reglas de negocio aisladas de servicios.
- `Pruebas de integración`: para verificar interacción entre servicio, repositorio y persistencia.
- `Pruebas funcionales API`: para comprobar contratos y respuestas HTTP en endpoints clave.
- `Pruebas con dobles de prueba`: para dependencias externas como correo y reCAPTCHA.

## 5. Tipos de prueba recomendados

### 5.1 Pruebas unitarias

Adecuadas para:

- validaciones de OTP,
- reglas de negocio de preguntas,
- validación de estados,
- mapeo y construcción de respuestas.

### 5.2 Pruebas de integración

Adecuadas para:

- transacciones de alta de usuario + perfil,
- persistencia de preguntas y respuestas,
- creación de asignaciones,
- actualización de estado de usuario.

### 5.3 Pruebas funcionales de API

Adecuadas para:

- login y verificación OTP,
- flujos administrativos,
- endpoints del tutor,
- endpoints del estudiante.

## 6. Entorno de pruebas recomendado

- Base de datos PostgreSQL de pruebas o contenedor aislado
- Perfil de configuración de test
- Correo simulado o `JavaMailSender` mockeado
- reCAPTCHA simulado
- Datos semilla mínimos por rol
- Logs habilitados para trazabilidad

## 7. Supuestos de modelado

- Se asume que las dependencias externas como SMTP y reCAPTCHA serán sustituidas por mocks o stubs en pruebas automatizadas.
- Se asume que la base de datos de pruebas puede reiniciarse entre escenarios para asegurar independencia.
- Se asume que los controladores complementan la validación de entrada, mientras que los servicios concentran la lógica crítica de negocio.

## 8. Riesgos funcionales prioritarios a cubrir

- acceso de usuarios en estado inválido,
- OTP expirado, consumido o excedido en intentos,
- duplicidad de correo, matrícula o código de tutor,
- asignaciones inconsistentes tutor-estudiante,
- creación de preguntas sin autorización correcta,
- respuesta o corrección de preguntas en estado inválido,
- errores al enviar correos críticos,
- paginación o filtros mal validados,
- falta de persistencia correcta en transacciones compuestas.

## 9. Matriz de cobertura funcional

| Área | Servicio principal | Riesgo | Prioridad |
|---|---|---|---|
| Alta administrativa | `AdminUserService` | Duplicados, token inicial, perfil inconsistente | Alta |
| Asignaciones | `AdminUserService` | Reasignación incorrecta o pérdida de integridad | Alta |
| Preguntas y respuestas | `QaService` | Estados inválidos, versiones erróneas, tutor incorrecto | Alta |
| OTP | `OtpService` | Aceptación de códigos vencidos o reutilizados | Alta |
| Seguridad JWT | `JwtService` | Token inválido o expiración mal manejada | Media-Alta |
| reCAPTCHA | `RecaptchaService` | Flujo expuesto sin verificación | Media-Alta |
| Correo | `EmailService` | Falla en onboarding o cambio de contraseña | Alta |
| Auditoría | `AuditService` | Falta de trazabilidad operativa | Media |

## 10. Casos de prueba críticos

## CP-01 Alta exitosa de estudiante por administración

- `Objetivo`: Validar la creación completa de un estudiante con perfil académico, estado inicial correcto y token de primer acceso.
- `Servicio principal`: `AdminUserService.createStudentUser`
- `Precondiciones`:
  - no existe un usuario con el correo dado,
  - fecha de nacimiento válida,
  - dependencias de correo simuladas correctamente.
- `Datos de entrada`:
  - nombre,
  - apellidos,
  - email nuevo,
  - matrícula nueva,
  - datos académicos válidos.
- `Pasos`:
  1. Invocar la creación del estudiante.
  2. Verificar persistencia de `User`.
  3. Verificar persistencia de `Student`.
  4. Verificar estado y token inicial.
- `Resultado esperado`:
  - se crea el usuario,
  - se crea el perfil académico,
  - el estado queda `CREATED_BY_ADMIN`,
  - se genera `firstLoginToken`,
  - se invoca envío de correo.
- `Prioridad`: Alta

## CP-02 Error por correo duplicado al crear estudiante

- `Objetivo`: Verificar que no se permitan cuentas duplicadas por correo.
- `Servicio principal`: `AdminUserService.createStudentUser`
- `Precondiciones`:
  - existe un usuario con el correo de entrada.
- `Pasos`:
  1. Invocar creación con correo ya existente.
- `Resultado esperado`:
  - se lanza `IllegalStateException`,
  - no se crea perfil nuevo,
  - no se envía correo.
- `Prioridad`: Alta

## CP-03 Error por edad fuera de rango en alta de estudiante

- `Objetivo`: Validar la regla de edad permitida.
- `Servicio principal`: `AdminUserService.createStudentUser`
- `Precondiciones`:
  - correo no existente,
  - fecha de nacimiento fuera del rango permitido.
- `Pasos`:
  1. Ejecutar alta de estudiante.
- `Resultado esperado`:
  - se lanza `IllegalArgumentException`,
  - no se crea `User`,
  - no se crea `Student`.
- `Prioridad`: Alta

## CP-04 Alta exitosa de tutor por administración

- `Objetivo`: Validar la creación completa de tutor y su perfil.
- `Servicio principal`: `AdminUserService.createTutorUser`
- `Precondiciones`:
  - correo nuevo,
  - código de tutor nuevo.
- `Pasos`:
  1. Ejecutar alta de tutor.
  2. Verificar usuario y perfil de tutor.
- `Resultado esperado`:
  - usuario creado con rol `TUTOR`,
  - estado `CREATED_BY_ADMIN`,
  - `Tutor` persistido correctamente,
  - envío de correo ejecutado.
- `Prioridad`: Alta

## CP-05 Cambio de estado de usuario válido

- `Objetivo`: Verificar actualización correcta del estado funcional.
- `Servicio principal`: `AdminUserService.changeUserStatus`
- `Precondiciones`:
  - existe un usuario persistido.
- `Datos de entrada`:
  - `userId` válido,
  - nuevo estado `DISABLED` o `BLOCKED`.
- `Pasos`:
  1. Ejecutar cambio de estado.
  2. Consultar usuario actualizado.
- `Resultado esperado`:
  - el estado se actualiza,
  - el usuario permanece persistido,
  - no se altera el rol ni otros atributos.
- `Prioridad`: Alta

## CP-06 Error por estado inválido al cambiar estado de usuario

- `Objetivo`: Asegurar que solo se acepten estados definidos.
- `Servicio principal`: `AdminUserService.changeUserStatus`
- `Precondiciones`:
  - usuario existente.
- `Datos de entrada`:
  - `statusRaw = "INVALIDO"`.
- `Pasos`:
  1. Invocar cambio de estado con valor inválido.
- `Resultado esperado`:
  - se lanza `IllegalArgumentException`,
  - no se modifica el usuario.
- `Prioridad`: Alta

## CP-07 Asignación exitosa de estudiante a tutor

- `Objetivo`: Validar la creación de la relación tutor-estudiante.
- `Servicio principal`: `AdminUserService.assignStudentToTutor`
- `Precondiciones`:
  - existe tutor con `tutorCode`,
  - existe estudiante con `matricula`,
  - estudiante no asignado o asignable.
- `Pasos`:
  1. Ejecutar asignación.
  2. Consultar la relación creada.
- `Resultado esperado`:
  - se crea `TutorStudent`,
  - la relación queda asociada al tutor y al estudiante correctos,
  - se registra `createdBy` si se proporcionó.
- `Prioridad`: Alta

## CP-08 Reasignación de estudiante elimina relación previa

- `Objetivo`: Verificar la regla de unicidad operativa por estudiante.
- `Servicio principal`: `AdminUserService.assignStudentToTutor`
- `Precondiciones`:
  - el estudiante ya tiene una asignación activa.
- `Pasos`:
  1. Asignar el mismo estudiante a otro tutor.
  2. Revisar relaciones existentes.
- `Resultado esperado`:
  - la relación anterior se elimina,
  - solo existe una asignación activa final para el estudiante.
- `Prioridad`: Alta

## CP-09 Creación exitosa de pregunta con tutor asignado

- `Objetivo`: Validar que la pregunta herede automáticamente el tutor del estudiante.
- `Servicio principal`: `QaService.createQuestion`
- `Precondiciones`:
  - estudiante existente,
  - asignación activa a un tutor.
- `Pasos`:
  1. Crear pregunta con `scope`, `title` y `body`.
  2. Consultar la pregunta persistida.
- `Resultado esperado`:
  - la pregunta se crea,
  - estado inicial `PENDIENTE`,
  - el tutor queda asociado automáticamente,
  - `createdAt` y `updatedAt` se registran.
- `Prioridad`: Alta

## CP-10 Creación exitosa de pregunta sin tutor asignado

- `Objetivo`: Verificar el comportamiento cuando el estudiante no tiene tutor.
- `Servicio principal`: `QaService.createQuestion`
- `Precondiciones`:
  - estudiante existente sin asignación activa.
- `Pasos`:
  1. Crear pregunta.
  2. Consultar resultado.
- `Resultado esperado`:
  - la pregunta se crea correctamente,
  - el campo de tutor queda `null`,
  - el estado sigue siendo `PENDIENTE`.
- `Prioridad`: Media-Alta

## CP-11 Publicación exitosa de respuesta inicial

- `Objetivo`: Validar la primera respuesta de un tutor a una pregunta.
- `Servicio principal`: `QaService.publishOrCorrect`
- `Precondiciones`:
  - tutor existente,
  - pregunta existente en estado no rechazado,
  - pregunta sin respuesta actual.
- `Datos de entrada`:
  - `correction = false`.
- `Pasos`:
  1. Ejecutar publicación de respuesta.
  2. Consultar `Answer` y `Question`.
- `Resultado esperado`:
  - se crea una respuesta versión `1`,
  - la pregunta actualiza `currentAnswer`,
  - el tutor queda asociado,
  - el estado de la pregunta cambia a `PUBLICADA`.
- `Prioridad`: Alta

## CP-12 Corrección exitosa de respuesta existente

- `Objetivo`: Validar versionado y cambio de estado por corrección.
- `Servicio principal`: `QaService.publishOrCorrect`
- `Precondiciones`:
  - pregunta con respuesta actual,
  - tutor válido.
- `Datos de entrada`:
  - `correction = true`.
- `Pasos`:
  1. Ejecutar corrección.
  2. Revisar nueva versión.
- `Resultado esperado`:
  - se crea una nueva respuesta con versión incrementada,
  - la pregunta actualiza `currentAnswer`,
  - el estado cambia a `CORREGIDA`.
- `Prioridad`: Alta

## CP-13 Error al corregir pregunta sin respuesta previa

- `Objetivo`: Verificar que no se pueda corregir si no existe respuesta base.
- `Servicio principal`: `QaService.publishOrCorrect`
- `Precondiciones`:
  - pregunta existente,
  - `currentAnswer = null`.
- `Datos de entrada`:
  - `correction = true`.
- `Pasos`:
  1. Ejecutar corrección.
- `Resultado esperado`:
  - se lanza `IllegalStateException` con mensaje equivalente a "No hay respuesta previa",
  - no se crea respuesta nueva.
- `Prioridad`: Alta

## CP-14 Error al responder una pregunta rechazada

- `Objetivo`: Validar restricción de estado en preguntas rechazadas.
- `Servicio principal`: `QaService.publishOrCorrect`
- `Precondiciones`:
  - pregunta en estado `RECHAZADA`.
- `Pasos`:
  1. Intentar publicar respuesta.
- `Resultado esperado`:
  - se lanza `IllegalStateException`,
  - no se crea respuesta,
  - no cambia estado de la pregunta.
- `Prioridad`: Alta

## CP-15 Rechazo exitoso de pregunta pendiente

- `Objetivo`: Validar rechazo de una pregunta no respondida.
- `Servicio principal`: `QaService.reject`
- `Precondiciones`:
  - tutor válido,
  - pregunta en estado `PENDIENTE`.
- `Pasos`:
  1. Ejecutar rechazo con motivo.
  2. Consultar pregunta actualizada.
- `Resultado esperado`:
  - estado final `RECHAZADA`,
  - `rejectReason` persistido,
  - `currentAnswer = null`.
- `Prioridad`: Alta

## CP-16 Error al rechazar pregunta ya respondida

- `Objetivo`: Verificar que no se pueda rechazar una pregunta `PUBLICADA` o `CORREGIDA`.
- `Servicio principal`: `QaService.reject`
- `Precondiciones`:
  - pregunta en estado `PUBLICADA` o `CORREGIDA`.
- `Pasos`:
  1. Invocar rechazo.
- `Resultado esperado`:
  - se lanza `IllegalStateException`,
  - el estado de la pregunta no cambia.
- `Prioridad`: Alta

## CP-17 Reclasificación exitosa de alcance

- `Objetivo`: Validar el cambio de `scope` de una pregunta.
- `Servicio principal`: `QaService.reclassify`
- `Precondiciones`:
  - tutor válido,
  - pregunta existente,
  - `newScope` distinto al actual.
- `Pasos`:
  1. Ejecutar reclasificación.
  2. Consultar la pregunta.
- `Resultado esperado`:
  - el `scope` se actualiza correctamente,
  - no se alteran otros campos funcionales.
- `Prioridad`: Media-Alta

## CP-18 Error por paginación inválida en consulta de preguntas del estudiante

- `Objetivo`: Validar restricciones de paginación.
- `Servicio principal`: `QaService.findQuestionsForStudent`
- `Precondiciones`:
  - estudiante existente.
- `Datos de entrada`:
  - `page < 0` o `size <= 0` o `size > 100`.
- `Pasos`:
  1. Ejecutar consulta con parámetros inválidos.
- `Resultado esperado`:
  - se lanza `IllegalArgumentException`,
  - no se ejecuta consulta válida.
- `Prioridad`: Alta

## CP-19 Error por filtro de estado o scope inválido

- `Objetivo`: Validar el manejo de filtros no reconocidos.
- `Servicio principal`: `QaService.findQuestionsForStudent`
- `Precondiciones`:
  - estudiante existente.
- `Datos de entrada`:
  - `status` o `scope` fuera del enum permitido.
- `Pasos`:
  1. Ejecutar consulta con filtro inválido.
- `Resultado esperado`:
  - se lanza `IllegalArgumentException`,
  - el mensaje indica estado o scope inválido.
- `Prioridad`: Alta

## CP-20 Generación y validación exitosa de OTP de login

- `Objetivo`: Verificar ciclo correcto de generación y validación de OTP.
- `Servicio principal`: `OtpService.generateLoginOtpForUser` y `OtpService.validateForLogin`
- `Precondiciones`:
  - usuario válido.
- `Pasos`:
  1. Generar OTP de login.
  2. Recuperar `publicId`.
  3. Validar con el código correcto.
- `Resultado esperado`:
  - se genera OTP con `purpose = LOGIN`,
  - se valida correctamente,
  - queda marcado como consumido,
  - no podrá reutilizarse.
- `Prioridad`: Alta

## CP-21 Error al validar OTP vencido, consumido o con demasiados intentos

- `Objetivo`: Verificar robustez del control OTP.
- `Servicio principal`: `OtpService.validateForLogin` y `OtpService.validateAndConsume`
- `Escenarios`:
  - OTP expirado,
  - OTP ya consumido,
  - OTP con intentos máximos agotados,
  - código incorrecto.
- `Resultado esperado`:
  - la validación falla,
  - no se emite autenticación,
  - se conserva consistencia del registro OTP.
- `Prioridad`: Alta

## CP-22 Error de envío de correo al disparar mensaje crítico

- `Objetivo`: Verificar propagación correcta del fallo en correo.
- `Servicio principal`: `EmailService.sendEmail`
- `Precondiciones`:
  - `JavaMailSender` configurado para fallar mediante mock.
- `Pasos`:
  1. Ejecutar envío de correo.
- `Resultado esperado`:
  - se lanza `RuntimeException`,
  - el error queda trazado en logs,
  - la falla es observable por la capa llamadora.
- `Prioridad`: Alta

## CP-23 Persistencia correcta de evento de auditoría

- `Objetivo`: Validar que el sistema registre evidencia de operación.
- `Servicio principal`: `AuditService.log`
- `Precondiciones`:
  - request HTTP simulado con ruta, método, IP y user-agent.
- `Pasos`:
  1. Invocar registro de auditoría.
  2. Consultar el repositorio.
- `Resultado esperado`:
  - se crea un `AuditLog`,
  - se persisten `userId`, `action`, `success`, `path`, `method`, `ip` y `userAgent`.
- `Prioridad`: Media-Alta

## 11. Criterios de aceptación del plan de pruebas

Se considerará que la cobertura crítica es adecuada cuando:

- todos los casos de prioridad alta sean ejecutados y aprobados,
- los errores esperados sean capturados con el tipo de excepción o respuesta correcta,
- las transacciones no dejen datos inconsistentes,
- la seguridad de acceso y OTP funcione sin omisiones,
- los estados funcionales del dominio cambien según las reglas previstas.

## 12. Recomendaciones de automatización

- Priorizar automatización de `AdminUserService`, `QaService` y `OtpService`.
- Mockear `EmailService` y `RecaptchaService` en pruebas unitarias.
- Usar base de datos aislada o contenedorizada para integración.
- Incorporar pruebas de API para login, primer acceso, preguntas del estudiante y operaciones del tutor.
- Añadir aserciones explícitas sobre auditoría en flujos críticos.

## 13. Conclusión

Los servicios principales de TutorLink concentran reglas de negocio relevantes para seguridad, onboarding, asignaciones académicas y ciclo de preguntas/respuestas. Por ello, el plan de pruebas debe priorizar escenarios críticos de consistencia, validación y control de estados. Los casos de prueba propuestos cubren tanto caminos felices como fallos previsibles y constituyen una base sólida para control de calidad manual y automatizado.
