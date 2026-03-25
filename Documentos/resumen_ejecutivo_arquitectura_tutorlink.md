# Resumen Ejecutivo de Arquitectura Técnica - TutorLink

Fecha de análisis: 2026-03-23

## 1. Visión general

TutorLink es una plataforma web para gestión de tutorías académicas con tres perfiles operativos:

- `ADMIN`: administra usuarios, perfiles, estados y asignaciones tutor-estudiante.
- `ESTUDIANTE`: consulta su tutor, crea preguntas y revisa respuestas e historial.
- `TUTOR`: atiende preguntas asignadas, responde, corrige, rechaza, reclasifica y mantiene su perfil.

La solución está construida como una arquitectura cliente-servidor desacoplada:

- `frontend`: SPA en React + Vite.
- `backend`: API REST en Spring Boot 3.
- `base de datos`: PostgreSQL, evolucionada mediante Flyway.

El dominio principal gira alrededor de cuatro ejes:

- identidad y control de acceso,
- perfiles académicos,
- relación tutor-estudiante,
- ciclo de vida de preguntas y respuestas.

## 2. Arquitectura técnica

### 2.1 Estilo arquitectónico

La aplicación sigue una arquitectura por capas relativamente clara:

- `web/controllers`: expone endpoints REST por contexto funcional.
- `service`: concentra reglas de negocio y orquestación.
- `domain`: entidades JPA y repositorios.
- `dto/mapper`: contratos de entrada/salida hacia frontend.
- `config/security`: seguridad JWT, CORS y filtros.

En términos prácticos, el backend funciona como un monolito modular con separación lógica por bounded contexts:

- autenticación y seguridad,
- administración de usuarios,
- preguntas y respuestas,
- tutorías,
- auditoría,
- mensajería por correo.

### 2.2 Backend

Tecnologías principales identificadas:

- Java 17
- Spring Boot 3.3.4
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Flyway
- PostgreSQL
- JWT (`jjwt`)
- JavaMailSender
- Lombok

Características relevantes del backend:

- Autenticación stateless con JWT.
- Doble validación de acceso: credenciales + OTP por correo.
- Autorización por roles (`ADMIN`, `TUTOR`, `ESTUDIANTE`).
- Persistencia con JPA/Hibernate.
- Migraciones SQL versionadas con Flyway.
- Auditoría transversal de acciones de autenticación y operación.
- Integración con reCAPTCHA para registro/login/alta de preguntas.

### 2.3 Frontend

Tecnologías principales identificadas:

- React 19
- React Router
- Axios
- Vite
- Tailwind CSS
- `react-google-recaptcha`

El frontend está organizado como SPA con layouts y rutas protegidas por rol:

- `AdminLayout`
- `StudentLayout`
- `TutorLayout`

La sesión se persiste en `localStorage`, y Axios inyecta el JWT automáticamente en cada request. Ante `401/403`, el cliente invalida la sesión y redirige al login.

### 2.4 Seguridad

La seguridad combina varios mecanismos:

- JWT firmado con `HS256`.
- filtro `JwtAuthFilter` para poblar el contexto de Spring Security.
- autorización basada en roles por prefijo de rutas.
- OTP de 6 dígitos para completar el login.
- reCAPTCHA en flujos expuestos a abuso.
- estados de usuario (`CREATED_BY_ADMIN`, `ACTIVE`, `DISABLED`, `BLOCKED`).

Los endpoints públicos principales son:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/login/verify-otp`
- `/api/auth/activate`
- `/api/auth/first-login/complete`
- `/api/recaptcha/verify`
- `/api/health`

## 3. Modelo de datos

### 3.1 Entidades principales

#### `tl_users`

Entidad raíz de identidad.

Campos funcionales relevantes:

- nombre y apellidos separados,
- email único,
- hash de contraseña,
- rol,
- estado,
- tokens y expiración para activación / primer login,
- fecha de último acceso.

#### `tl_students`

Perfil académico del estudiante en relación `1:1` con `tl_users`.

Incluye:

- matrícula,
- carrera,
- plan,
- semestre,
- fecha de nacimiento,
- teléfono.

#### `tl_tutors`

Perfil del tutor en relación `1:1` con `tl_users`.

Incluye:

- código de tutor,
- departamento,
- especialidad,
- teléfono,
- bio,
- enlaces académicos/profesionales,
- preferencias de notificación.

#### `tl_tutor_students`

Tabla de asignación operativa entre tutor y estudiante.

Características:

- un estudiante solo puede tener una asignación activa,
- registra qué administrador realizó la asignación,
- soporta reasignación eliminando la relación previa.

#### `tl_questions`

Representa las consultas académicas generadas por estudiantes.

Relaciones y atributos:

- pertenece a un estudiante,
- puede quedar asociada a un tutor,
- tiene `scope`,
- tiene `status`,
- mantiene referencia a la respuesta actual.

Estados observados:

- `PENDIENTE`
- `PUBLICADA`
- `CORREGIDA`
- `RECHAZADA`

#### `tl_answers`

Historial versionado de respuestas del tutor.

Características:

- una pregunta puede tener varias respuestas,
- cada respuesta tiene `version`,
- la pregunta apunta a la respuesta vigente mediante `current_answer_id`.

#### `otp_codes`

Persistencia de OTP para login y cambio de contraseña.

Incluye:

- `public_id` para exponer un identificador seguro al frontend,
- código,
- expiración,
- intentos,
- propósito,
- marca de consumo.

#### `tl_audit_log`

Registro técnico y funcional de eventos críticos:

- autenticación,
- errores,
- operaciones clave,
- IP,
- user-agent,
- path,
- método HTTP.

### 3.2 Relaciones de negocio

Relaciones principales del dominio:

- `User 1:1 Student`
- `User 1:1 Tutor`
- `Tutor 1:N TutorStudent`
- `Student 1:1 TutorStudent` operativo
- `Student 1:N Question`
- `Tutor 1:N Question` asignadas
- `Question 1:N Answer`
- `Question 1:1 Answer actual`

### 3.3 Evolución del esquema

El proyecto evidencia evolución incremental del modelo:

- inicialmente el usuario mezclaba identidad y datos académicos,
- después se normalizó separando `students` y `tutors`,
- se rehizo el modelo de preguntas/respuestas para apuntar a perfiles de negocio,
- se añadieron campos para perfil de tutor y primer login.

Esto muestra una madurez creciente del modelo de dominio y una migración desde un diseño más simple hacia uno más orientado a responsabilidades.

## 4. Flujos principales de usuario

### 4.1 Flujo de alta administrada

1. Un administrador crea un estudiante, tutor o administrador.
2. El backend genera un usuario base con estado `CREATED_BY_ADMIN`.
3. Se crea un `first_login_token` con expiración.
4. Se envía correo con enlace de primer acceso.
5. El usuario define su contraseña desde el frontend.
6. La cuenta pasa a `ACTIVE`.

### 4.2 Flujo de login con MFA

1. El usuario captura email, contraseña y reCAPTCHA.
2. El backend valida credenciales y estado.
3. Se genera OTP con propósito `LOGIN`.
4. El OTP se envía por correo.
5. El frontend redirige a la pantalla OTP.
6. El backend valida OTP y emite JWT.
7. El frontend enruta según rol.

### 4.3 Flujo de estudiante

1. El estudiante entra a su dashboard.
2. Consulta su tutor asignado.
3. Crea una pregunta con validación reCAPTCHA.
4. El backend asigna automáticamente el tutor asociado al estudiante, si existe.
5. El estudiante consulta historial, detalle y respuestas de sus preguntas.

### 4.4 Flujo de tutor

1. El tutor accede a su dashboard y resumen operativo.
2. Consulta preguntas pendientes asignadas.
3. Puede responder, corregir, rechazar o reclasificar.
4. El sistema versiona respuestas y actualiza el estado de la pregunta.
5. El tutor consulta historial y administra su perfil académico.

### 4.5 Flujo de administración académica

1. El administrador lista usuarios por tipo.
2. Crea o actualiza estudiantes y tutores.
3. Importa usuarios y asignaciones por CSV.
4. Cambia estado de cuentas.
5. Asigna estudiantes a tutores.
6. Consulta asignaciones y sugerencias de estudiantes no asignados.

### 4.6 Flujo de cambio de contraseña

1. Usuario autenticado solicita cambio.
2. El backend genera OTP con propósito `PASSWORD_CHANGE`.
3. Se envía OTP por correo.
4. El usuario confirma contraseña actual, nueva contraseña y OTP.
5. El backend valida y actualiza `password_hash`.

## 5. Observaciones arquitectónicas relevantes

### Fortalezas

- Separación razonable por capas y por contexto funcional.
- Modelo de datos más normalizado que la versión inicial.
- Seguridad reforzada con JWT + OTP + reCAPTCHA.
- Flujos de onboarding administrado bien definidos.
- Auditoría transversal útil para trazabilidad.
- Soporte de importación masiva vía CSV, alineado con operación institucional.

### Riesgos y deuda técnica detectada

#### 1. Convivencia de Flyway con `ddl-auto: update`

El backend usa Flyway, pero también mantiene `spring.jpa.hibernate.ddl-auto: update`. Esto puede provocar deriva de esquema, cambios no versionados o diferencias entre ambientes. En una arquitectura productiva, lo recomendable es dejar la evolución del esquema exclusivamente en Flyway.

#### 2. Configuración acoplada a IPs de red local

Se observan IPs privadas fijas tanto en CORS como en `frontend-base-url` y `axios baseURL`. Esto dificulta despliegues reproducibles y promueve configuración dependiente del entorno.

#### 3. Inconsistencia en hashing de contraseñas

Conviven `PasswordEncoder` de Spring y uso directo de `BCrypt` en `UserService`. Funciona, pero introduce duplicidad de criterio criptográfico y complica la estandarización.

#### 4. Parte de la lógica de filtrado ocurre en memoria

Algunas búsquedas y filtros de historial/pendientes se hacen después de traer colecciones desde repositorio. A escala pequeña es aceptable; a escala institucional mayor puede degradar rendimiento.

#### 5. Acoplamiento moderado entre capas de dominio y presentación

Hay endpoints que todavía devuelven entidades directamente en algunos casos, mientras otros devuelven DTOs. Eso sugiere una capa de contrato parcialmente madura, pero no completamente uniforme.

#### 6. Persistencia de sesión en `localStorage`

Es una decisión práctica y frecuente en SPA, pero exige especial cuidado frente a XSS y políticas de endurecimiento del frontend.

## 6. Tecnologías utilizadas

### Backend

- Java 17
- Spring Boot 3.3.4
- Spring Security
- Spring Data JPA / Hibernate
- Flyway
- PostgreSQL
- JWT (`jjwt`)
- JavaMail
- Lombok
- Thymeleaf para vistas auxiliares de correo/preview

### Frontend

- React 19
- React Router DOM
- Axios
- Vite
- Tailwind CSS
- React Google reCAPTCHA

### Infraestructura y operación

- Variables de entorno para secretos y configuración sensible
- SMTP configurable
- logs a archivo (`logs/app.log`)
- despliegue contenedorizable por `Dockerfile` en backend

## 7. Conclusión ejecutiva

TutorLink presenta una base técnica sólida para un sistema académico de tutorías con control de acceso por roles, onboarding administrado y atención estructurada de preguntas académicas. La arquitectura es la de un monolito web moderno con frontend SPA y backend REST, suficientemente modular para evolucionar sin una fragmentación prematura.

Desde una perspectiva de arquitectura de software, el proyecto está bien orientado para un contexto universitario de tamaño pequeño o medio. El mayor valor de diseño está en la separación entre identidad, perfiles académicos, asignaciones y ciclo de preguntas/respuestas. Las principales oportunidades de mejora se concentran en endurecimiento operativo: configuración por entorno, consistencia en seguridad, unificación de contratos API y optimización de consultas.

En resumen, la solución ya tiene una estructura funcional y escalable a nivel lógico; el siguiente salto de madurez debería enfocarse en gobernanza del esquema, estandarización técnica y preparación para entornos productivos más controlados.
