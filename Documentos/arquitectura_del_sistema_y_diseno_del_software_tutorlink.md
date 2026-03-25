# Arquitectura del Sistema y Diseño del Software - TutorLink

Fecha de elaboración: 2026-03-23

## 1. Propósito del documento

Este documento describe la arquitectura del sistema y el diseño del software de TutorLink a partir del análisis de archivos de configuración, bootstrap de aplicación, componentes de seguridad, inyección de dependencias y estructura de módulos del proyecto.

El objetivo es explicar:

- la arquitectura general del sistema,
- la estructura de componentes,
- los patrones de diseño utilizados,
- el flujo de datos entre frontend, backend y base de datos,
- la forma en que el software está organizado para soportar los casos de uso del dominio.

## 2. Vista arquitectónica general

TutorLink implementa una arquitectura cliente-servidor desacoplada, compuesta por:

- `Frontend web SPA` desarrollado en React + Vite
- `Backend API REST` desarrollado en Spring Boot 3
- `Base de datos relacional` PostgreSQL
- `Servicios externos` para reCAPTCHA y correo electrónico

La arquitectura sigue una organización monolítica modular:

- un único backend concentra la lógica de negocio,
- el frontend consume el backend por HTTP,
- la separación funcional se realiza por capas y módulos de dominio.

## 3. Estilo arquitectónico

### 3.1 Arquitectura por capas

El backend sigue una arquitectura por capas claramente identificable:

- `Capa de presentación`: controladores REST en `web/`
- `Capa de aplicación/negocio`: servicios en `service/`
- `Capa de acceso a datos`: repositorios JPA en `domain/*Repository`
- `Capa de dominio`: entidades JPA en `domain/`
- `Capa de contratos`: DTOs y mappers en `dto/` y `mapper/`
- `Capa de infraestructura`: configuración, seguridad, correo, reCAPTCHA, logging

Esta separación permite desacoplar:

- transporte HTTP,
- reglas de negocio,
- persistencia,
- representación de datos.

### 3.2 Arquitectura SPA + API

El frontend implementa una SPA que:

- administra navegación por rutas,
- conserva sesión local,
- protege vistas por rol,
- consume la API mediante Axios.

El backend expone endpoints REST organizados por contexto:

- `/api/auth`
- `/api/admin`
- `/api/student`
- `/api/tutor`
- `/api`

## 4. Estructura de componentes

## 4.1 Backend

### 4.1.1 Componente de arranque

El punto de entrada del backend es [AuthMfaBackendApplication.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/AuthMfaBackendApplication.java), anotado con `@SpringBootApplication`, lo que activa:

- autoconfiguración de Spring Boot,
- escaneo de componentes,
- registro automático de beans.

### 4.1.2 Componente de configuración

La configuración principal reside en:

- [application.yml](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/resources/application.yml)
- [SecurityConfig.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/config/SecurityConfig.java)

Estas piezas controlan:

- datasource,
- JPA/Hibernate,
- Flyway,
- logging,
- JWT,
- OTP,
- correo,
- CORS,
- política de seguridad.

### 4.1.3 Componentes web

Los controladores REST principales son:

- [AuthController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/AuthController.java)
- [AdminUserController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/AdminUserController.java)
- [StudentController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/StudentController.java)
- [TutorController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/TutorController.java)
- [UserController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/UserController.java)
- [PublicController.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/PublicController.java)
- [GlobalExceptionHandler.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/GlobalExceptionHandler.java)

### 4.1.4 Componentes de negocio

Los servicios con mayor responsabilidad funcional son:

- [QaService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/QaService.java)
- [AdminUserService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/AdminUserService.java)
- [UserService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/UserService.java)
- [JwtService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/JwtService.java)
- [OtpService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/OtpService.java)
- [EmailService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/EmailService.java)
- [RecaptchaService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/RecaptchaService.java)
- [AuditService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/AuditService.java)

### 4.1.5 Componentes de persistencia

La persistencia se apoya en:

- entidades JPA de usuario,
- entidades de estudiante, tutor y asignación,
- entidades de pregunta y respuesta,
- entidades de OTP y auditoría,
- repositorios Spring Data JPA.

### 4.1.6 Componentes de seguridad

La seguridad del backend se compone de:

- [SecurityConfig.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/config/SecurityConfig.java)
- [JwtAuthFilter.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/security/JwtAuthFilter.java)
- [JwtService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/JwtService.java)
- `PasswordEncoder` registrado como bean

## 4.2 Frontend

### 4.2.1 Componente de bootstrap

El frontend inicia en [main.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/main.jsx), donde se compone:

- `React.StrictMode`
- `AuthProvider`
- `BrowserRouter`
- `App`

### 4.2.2 Componente de navegación

La estructura de navegación reside en [App.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/App.jsx), con:

- rutas públicas,
- rutas protegidas,
- segmentación por rol,
- redirecciones por defecto.

### 4.2.3 Componente de autenticación del cliente

La sesión del frontend se gestiona en:

- [AuthContext.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/context/AuthContext.jsx)
- [axiosClient.js](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/api/axiosClient.js)

Esto centraliza:

- carga de sesión desde `localStorage`,
- persistencia de token y rol,
- inyección automática del JWT,
- manejo de expiración o acceso no autorizado.

### 4.2.4 Componentes de control de acceso

Las rutas protegidas se implementan en:

- [ProtectedRoute.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/router/ProtectedRoute.jsx)
- [AdminRoute.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/router/AdminRoute.jsx)
- [StudentRoute.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/router/StudentRoute.jsx)
- [TutorRoute.jsx](/home/sinoe/ProyectoFinal_AS_DI/frontend/src/router/TutorRoute.jsx)

### 4.2.5 Componentes funcionales por dominio

El frontend organiza páginas y layouts por perfil:

- `pages/admin`
- `pages/student`
- `pages/tutor`
- `pages/auth`
- `layout`

## 5. Inyección de dependencias

## 5.1 Mecanismo principal

La inyección de dependencias en el backend utiliza principalmente:

- inyección por constructor,
- `@RequiredArgsConstructor` de Lombok,
- `@Service`, `@Component`, `@Configuration`, `@RestController`,
- `@Bean` para componentes explícitos,
- `@Value` para configuración externa.

Esto permite que Spring gestione el ciclo de vida de los objetos y sus dependencias.

## 5.2 Ejemplos observables

### Configuración

En [SecurityConfig.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/config/SecurityConfig.java):

- se inyecta `JwtAuthFilter`,
- se registran beans como `SecurityFilterChain`, `CorsConfigurationSource`, `AuthenticationManager` y `PasswordEncoder`.

### Servicios

En [QaService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/QaService.java):

- se inyectan múltiples repositorios de usuario, estudiante, tutor, pregunta, respuesta y asignación.

En [AdminUserService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/AdminUserService.java):

- se inyectan repositorios,
- `UserService`,
- `EmailService`,
- `PasswordEncoder`.

### Seguridad

En [JwtAuthFilter.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/security/JwtAuthFilter.java):

- se inyecta `JwtService`,
- se inyecta `UserService` aunque actualmente su uso en el filtro no es material.

### Configuración por propiedades

En [JwtService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/JwtService.java), [OtpService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/OtpService.java) y [RecaptchaService.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/service/RecaptchaService.java) se observa inyección de propiedades mediante `@Value`.

## 5.3 Alcance de los componentes

Inferencia basada en Spring Boot:

- los servicios y componentes anotados funcionan bajo el alcance por defecto `singleton`,
- por ello actúan como instancias únicas compartidas dentro del contenedor de Spring.

Esto aplica a servicios como `QaService`, `AdminUserService`, `JwtService`, `OtpService`, `EmailService` y `AuditService`.

## 6. Patrones de diseño utilizados

## 6.1 MVC / Web MVC

Patrón observado explícitamente.

El sistema backend sigue una variante de MVC orientada a API REST:

- `Controller`: controladores REST
- `Model`: entidades de dominio y DTOs
- `Service`: capa intermedia con lógica de negocio

No existe una vista MVC clásica server-side como mecanismo principal de interfaz, ya que la vista está desacoplada en React.

## 6.2 Inyección de dependencias / Inversión de control

Patrón observado explícitamente.

Spring administra la creación y ensamblaje de componentes. El código delega al contenedor la resolución de dependencias, reduciendo acoplamiento directo entre clases.

## 6.3 Repository

Patrón observado explícitamente.

Los repositorios JPA abstraen el acceso a datos y encapsulan operaciones sobre entidades:

- usuarios,
- estudiantes,
- tutores,
- asignaciones,
- preguntas,
- respuestas,
- OTP,
- auditoría.

## 6.4 Service Layer

Patrón observado explícitamente.

La lógica de negocio se concentra en servicios como:

- `QaService`
- `AdminUserService`
- `UserService`
- `OtpService`
- `JwtService`

Esto evita que los controladores concentren demasiada lógica y mejora reutilización.

## 6.5 DTO Pattern

Patrón observado explícitamente.

Se usan DTOs para:

- entrada de requests,
- salida de respuestas,
- dashboards,
- listados,
- perfiles,
- respuestas paginadas.

Esto desacopla el dominio persistente de los contratos HTTP.

## 6.6 Mapper

Patrón observado explícitamente.

El proyecto usa mapeo dedicado, por ejemplo en `QaMapper`, para transformar entidades en respuestas orientadas al cliente.

## 6.7 Builder

Patrón observado explícitamente.

Las entidades y DTOs usan `@Builder` de Lombok, facilitando construcción legible de objetos complejos, por ejemplo:

- `User`
- `Student`
- `Tutor`
- `Question`
- `Answer`

## 6.8 Singleton

Patrón inferido por framework.

Los beans Spring son `singleton` por defecto. Aunque el proyecto no implementa Singletons manuales, el contenedor actúa bajo ese modelo para la mayoría de servicios y componentes.

## 6.9 Front Controller y Filter Chain

Patrón inferido por infraestructura Spring.

La entrada HTTP pasa por el stack de Spring MVC/Security y por filtros como `JwtAuthFilter`, antes de alcanzar los controladores. Esto es consistente con los patrones:

- `Front Controller`
- `Filter Chain`

## 6.10 Context / Provider en frontend

Patrón observado explícitamente en React.

`AuthProvider` implementa un patrón de contexto compartido para estado global de autenticación.

## 6.11 Interceptor

Patrón observado explícitamente en frontend.

`axiosClient` usa interceptores de request y response para:

- agregar token,
- controlar errores 401/403,
- centralizar comportamiento transversal.

## 7. Flujo de datos del sistema

## 7.1 Flujo general

El flujo principal del sistema puede describirse así:

1. El usuario interactúa con una pantalla React.
2. La vista llama a `axiosClient`.
3. Axios agrega el JWT si existe sesión.
4. La petición llega al backend.
5. `JwtAuthFilter` valida el token y construye el contexto de seguridad.
6. `SecurityConfig` autoriza la ruta según rol.
7. El controlador recibe la petición.
8. El controlador valida entrada y delega a un servicio o repositorio.
9. El servicio aplica reglas de negocio y accede a repositorios.
10. Los repositorios consultan o persisten en PostgreSQL.
11. El servicio devuelve entidades o DTOs transformados.
12. El controlador responde en JSON.
13. El frontend actualiza estado y renderiza la interfaz.

## 7.2 Flujo de login con MFA

1. El usuario envía credenciales y token reCAPTCHA desde la pantalla de login.
2. `AuthController` valida reCAPTCHA mediante `RecaptchaService`.
3. El backend valida credenciales y estado del usuario.
4. `OtpService` genera OTP.
5. `EmailService` envía el código.
6. El frontend redirige a la vista OTP.
7. El usuario captura el código.
8. `AuthController` valida OTP.
9. `JwtService` emite el JWT.
10. `AuthContext` persiste sesión y redirige por rol.

## 7.3 Flujo de pregunta académica

1. El estudiante llena el formulario de nueva pregunta.
2. El frontend envía la solicitud al endpoint del estudiante.
3. `StudentController` resuelve identidad y valida reCAPTCHA.
4. `QaService` localiza al estudiante y su tutor asignado.
5. `QuestionRepository` persiste la pregunta.
6. El backend responde con el identificador y estado.
7. El estudiante consulta posteriormente detalle e historial.

## 7.4 Flujo de respuesta del tutor

1. El tutor consulta pendientes desde el frontend.
2. El backend devuelve preguntas filtradas o asignadas.
3. El tutor responde, corrige, rechaza o reclasifica.
4. `TutorController` delega en `QaService`.
5. `QaService` valida reglas de negocio.
6. `AnswerRepository` guarda la nueva respuesta si aplica.
7. `QuestionRepository` actualiza estado y referencia a respuesta actual.
8. El frontend actualiza historial y dashboard.

## 8. Diseño del software

## 8.1 Diseño del backend

### 8.1.1 Organización modular

El diseño separa responsabilidades por dominio:

- autenticación,
- usuarios y perfiles,
- tutorías y asignaciones,
- preguntas y respuestas,
- auditoría,
- integraciones.

### 8.1.2 Diseño transaccional

Servicios como `QaService` y `AdminUserService` utilizan `@Transactional`, lo que indica un diseño orientado a:

- atomicidad,
- consistencia de cambios,
- encapsulamiento de operaciones compuestas.

### 8.1.3 Diseño de seguridad

La seguridad está diseñada como un pipeline:

- filtro JWT,
- resolución de principal,
- autorización por patrón de rutas,
- control por roles,
- validación de estados funcionales del usuario.

### 8.1.4 Diseño de errores

El manejo de errores se centraliza en [GlobalExceptionHandler.java](/home/sinoe/ProyectoFinal_AS_DI/backend/src/main/java/com/sinoe/authmfa/web/GlobalExceptionHandler.java), lo que mejora consistencia de respuestas y desacopla la gestión de fallos del flujo principal.

## 8.2 Diseño del frontend

### 8.2.1 Diseño por composición

La aplicación React se arma por composición de:

- proveedor de autenticación,
- navegador,
- layouts,
- páginas,
- guards de ruta.

### 8.2.2 Diseño por módulos de rol

Las vistas se separan por dominio de usuario:

- administración,
- estudiante,
- tutor,
- autenticación.

Esto mejora mantenibilidad y claridad del flujo de navegación.

### 8.2.3 Diseño del estado

El estado global relevante se concentra en autenticación. La solución evita una capa compleja de state management y usa:

- `Context API`,
- estado local por componente,
- `localStorage` para persistencia ligera.

## 8.3 Diseño de contratos

El diseño del software favorece contratos relativamente explícitos:

- requests tipificados mediante DTOs,
- respuestas simplificadas para frontend,
- objetos específicos para dashboard, detalle, historial y perfil.

Esto ayuda a desacoplar la representación UI de la estructura exacta de las entidades persistentes.

## 9. Fortalezas del diseño

- separación clara por capas,
- inyección de dependencias consistente,
- seguridad integrada desde infraestructura,
- servicios de negocio bien delimitados,
- estructura modular por rol y dominio,
- uso adecuado de DTOs y builders,
- frontend desacoplado del backend.

## 10. Observaciones técnicas relevantes

- Existe una arquitectura sólida de tipo monolito modular, adecuada para el tamaño actual del sistema.
- La configuración por `@Value` y `application.yml` facilita despliegue configurable.
- La coexistencia de `Flyway` con `ddl-auto: update` sugiere una decisión operativa que conviene revisar para evitar deriva de esquema.
- En el backend conviven acceso directo a repositorios desde algunos controladores y uso de servicios de dominio; el diseño es funcional, pero podría homogeneizarse más.
- En frontend, la sesión en `localStorage` simplifica implementación, aunque requiere endurecimiento frente a riesgos XSS.

## 11. Conclusión

TutorLink implementa una arquitectura moderna de software web basada en SPA + API REST, con un backend Spring Boot organizado por capas y un frontend React estructurado por módulos de rol. El diseño está apoyado en patrones ampliamente probados como MVC, Repository, Service Layer, Dependency Injection, DTO, Builder e Interceptor.

La solución muestra una composición coherente entre configuración, seguridad, servicios de negocio y persistencia. Desde la perspectiva de diseño del software, el sistema está bien encaminado para un entorno académico institucional, con una base lo suficientemente ordenada para mantenimiento, evolución funcional y endurecimiento técnico progresivo.
