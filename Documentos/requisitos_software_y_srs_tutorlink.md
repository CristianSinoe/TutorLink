# Requisitos del Software y SRS - TutorLink

Fecha de elaboración: 2026-03-23

## 1. Introducción

### 1.1 Propósito del documento

Este documento define los requisitos del software y la especificación SRS (Software Requirements Specification) de TutorLink, tomando como fuente principal los controladores backend, las rutas del frontend y la arquitectura funcional ya identificada en el proyecto.

El objetivo es formalizar qué debe hacer el sistema, bajo qué condiciones debe operar y qué reglas de negocio gobiernan su comportamiento.

### 1.2 Alcance del sistema

TutorLink es una plataforma web para la gestión de tutorías académicas en contexto universitario. El sistema permite:

- autenticar usuarios institucionales,
- administrar cuentas y perfiles,
- asignar estudiantes a tutores,
- canalizar preguntas académicas,
- responder y dar seguimiento a consultas,
- mantener trazabilidad operativa y de seguridad.

### 1.3 Definiciones y roles

#### `ADMIN`

Usuario con permisos para gestionar usuarios, estados, perfiles y asignaciones.

#### `ESTUDIANTE`

Usuario que consulta a su tutor asignado, crea preguntas y revisa respuestas e historial.

#### `TUTOR`

Usuario que atiende preguntas asignadas, responde, corrige, rechaza, reclasifica y gestiona su perfil.

#### OTP

Código temporal de un solo uso enviado por correo para completar autenticación o confirmar cambio de contraseña.

#### SRS

Especificación formal de requisitos funcionales, no funcionales y reglas de negocio del software.

## 2. Descripción general del sistema

### 2.1 Perspectiva del producto

TutorLink opera como una solución cliente-servidor:

- `frontend`: SPA con rutas protegidas por rol,
- `backend`: API REST con control de acceso basado en JWT,
- `base de datos`: persistencia relacional para usuarios, perfiles, asignaciones, preguntas, respuestas, OTP y auditoría.

### 2.2 Módulos funcionales identificados

Los módulos funcionales detectados en el sistema son:

- Módulo de autenticación y acceso
- Módulo de administración de usuarios
- Módulo de perfiles e identidad del usuario
- Módulo de asignación tutor-estudiante
- Módulo de preguntas del estudiante
- Módulo de atención de preguntas del tutor
- Módulo de dashboards y consultas operativas
- Módulo de seguridad y validación pública
- Módulo de auditoría y trazabilidad

### 2.3 Usuarios del sistema

- administradores institucionales,
- tutores académicos,
- estudiantes,
- personal técnico o de soporte para monitoreo y operación.

## 3. Requisitos funcionales por módulo

## 3.1 Módulo de autenticación y acceso

### 3.1.1 Descripción

Este módulo controla el registro, activación, primer acceso, login, verificación OTP y cambio de contraseña.

### 3.1.2 Endpoints relacionados

- `POST /api/auth/register`
- `POST /api/auth/activate`
- `POST /api/auth/first-login/complete`
- `POST /api/auth/login`
- `POST /api/auth/login/verify-otp`
- `POST /api/auth/password/change/request`
- `POST /api/auth/password/change/confirm`

### 3.1.3 Requisitos funcionales

- `RF-AUT-01`: El sistema deberá permitir el registro de usuarios desde el flujo público cuando se proporcionen datos válidos y reCAPTCHA correcto.
- `RF-AUT-02`: El sistema deberá validar unicidad de correo electrónico al registrar un usuario.
- `RF-AUT-03`: El sistema deberá validar que la edad del usuario esté dentro del rango permitido antes de completar el registro.
- `RF-AUT-04`: El sistema deberá permitir activar cuentas creadas por administración mediante token de activación o enlace de primer acceso, según el flujo aplicable.
- `RF-AUT-05`: El sistema deberá permitir que un usuario creado por un administrador defina su contraseña durante el primer acceso.
- `RF-AUT-06`: El sistema deberá autenticar mediante correo y contraseña.
- `RF-AUT-07`: El sistema deberá requerir OTP para completar el login de un usuario activo.
- `RF-AUT-08`: El sistema deberá enviar el OTP al correo del usuario autenticado en primera fase.
- `RF-AUT-09`: El sistema deberá emitir un JWT al validar correctamente el OTP de login.
- `RF-AUT-10`: El sistema deberá impedir el acceso si el usuario se encuentra en estado no habilitado.
- `RF-AUT-11`: El sistema deberá permitir solicitar cambio de contraseña a usuarios autenticados.
- `RF-AUT-12`: El sistema deberá requerir OTP y validación de contraseña actual para confirmar el cambio de contraseña.
- `RF-AUT-13`: El sistema deberá registrar en auditoría los eventos de registro, login, OTP, activación y cambio de contraseña.

### 3.1.4 Reglas de negocio del módulo

- `RN-AUT-01`: Solo los usuarios con estado `ACTIVE` podrán iniciar sesión normalmente.
- `RN-AUT-02`: Los usuarios con estado `CREATED_BY_ADMIN` deberán completar primer login antes de operar.
- `RN-AUT-03`: El reCAPTCHA será obligatorio en flujos públicos o sensibles definidos por el sistema.
- `RN-AUT-04`: El OTP tendrá vigencia temporal, número máximo de intentos y uso único.
- `RN-AUT-05`: Los tokens de primer acceso o activación expirarán después del tiempo configurado.
- `RN-AUT-06`: La nueva contraseña deberá cumplir un mínimo de longitud.

## 3.2 Módulo de administración de usuarios

### 3.2.1 Descripción

Este módulo permite a los administradores gestionar usuarios, perfiles y estados del sistema.

### 3.2.2 Endpoints relacionados

- `GET /api/admin/users`
- `GET /api/admin/users/students`
- `POST /api/admin/users/students`
- `PUT /api/admin/users/students/{userId}`
- `POST /api/admin/users/tutors`
- `PUT /api/admin/users/tutors/{userId}`
- `GET /api/admin/users/tutors`
- `GET /api/admin/users/admins`
- `POST /api/admin/users/admins`
- `PATCH /api/admin/users/{userId}/status`
- `POST /api/admin/users/students/import-csv`
- `POST /api/admin/users/tutors/import-csv`

### 3.2.3 Requisitos funcionales

- `RF-ADM-01`: El sistema deberá permitir al administrador listar todos los usuarios.
- `RF-ADM-02`: El sistema deberá permitir listar estudiantes con su perfil académico.
- `RF-ADM-03`: El sistema deberá permitir crear usuarios estudiantes con perfil asociado.
- `RF-ADM-04`: El sistema deberá permitir editar usuarios estudiantes y su perfil asociado.
- `RF-ADM-05`: El sistema deberá permitir crear usuarios tutores con su perfil asociado.
- `RF-ADM-06`: El sistema deberá permitir editar usuarios tutores y su perfil asociado.
- `RF-ADM-07`: El sistema deberá permitir listar tutores con su información de perfil.
- `RF-ADM-08`: El sistema deberá permitir listar administradores.
- `RF-ADM-09`: El sistema deberá permitir crear administradores.
- `RF-ADM-10`: El sistema deberá permitir cambiar el estado de un usuario.
- `RF-ADM-11`: El sistema deberá permitir importar estudiantes desde CSV.
- `RF-ADM-12`: El sistema deberá permitir importar tutores desde CSV.
- `RF-ADM-13`: El sistema deberá enviar correo de primer acceso al crear cuentas administrativas.

### 3.2.4 Reglas de negocio del módulo

- `RN-ADM-01`: El correo de usuario deberá ser único a nivel sistema.
- `RN-ADM-02`: La matrícula del estudiante deberá ser única.
- `RN-ADM-03`: El código de tutor deberá ser único.
- `RN-ADM-04`: Los usuarios creados por un administrador iniciarán en estado `CREATED_BY_ADMIN`.
- `RN-ADM-05`: Los usuarios creados por administración deberán recibir un enlace de primer acceso.
- `RN-ADM-06`: Solo usuarios con rol `ADMIN` podrán operar este módulo.

## 3.3 Módulo de perfiles e identidad del usuario

### 3.3.1 Descripción

Este módulo expone la información del usuario autenticado y, en el caso del tutor, su perfil editable.

### 3.3.2 Endpoints relacionados

- `GET /api/me`
- `GET /api/tutor/profile`
- `PUT /api/tutor/profile`

### 3.3.3 Requisitos funcionales

- `RF-PER-01`: El sistema deberá devolver la información del usuario autenticado mediante un endpoint común.
- `RF-PER-02`: El sistema deberá adaptar la respuesta de `/api/me` según el rol del usuario autenticado.
- `RF-PER-03`: El sistema deberá permitir al tutor consultar su perfil extendido.
- `RF-PER-04`: El sistema deberá permitir al tutor actualizar bio, enlaces y preferencias de notificación.

### 3.3.4 Reglas de negocio del módulo

- `RN-PER-01`: La información devuelta deberá corresponder exclusivamente al usuario autenticado.
- `RN-PER-02`: Solo el tutor autenticado podrá modificar su propio perfil.
- `RN-PER-03`: Los perfiles de estudiante y tutor se derivan de una relación `1:1` con la entidad usuario.

## 3.4 Módulo de asignación tutor-estudiante

### 3.4.1 Descripción

Este módulo gestiona la vinculación operativa entre estudiantes y tutores.

### 3.4.2 Endpoints relacionados

- `POST /api/admin/users/tutor-students/assign`
- `POST /api/admin/users/tutor-students/import-csv`
- `GET /api/admin/users/tutor-students`
- `DELETE /api/admin/users/tutor-students/{id}`
- `GET /api/admin/users/tutor-students/suggest-students`
- `GET /api/student/my-tutor`

### 3.4.3 Requisitos funcionales

- `RF-ASG-01`: El sistema deberá permitir asignar un estudiante a un tutor.
- `RF-ASG-02`: El sistema deberá permitir importar asignaciones tutor-estudiante desde CSV.
- `RF-ASG-03`: El sistema deberá permitir listar asignaciones existentes con filtros.
- `RF-ASG-04`: El sistema deberá permitir eliminar asignaciones.
- `RF-ASG-05`: El sistema deberá sugerir estudiantes no asignados para apoyar la asignación manual.
- `RF-ASG-06`: El sistema deberá permitir al estudiante consultar su tutor asignado.

### 3.4.4 Reglas de negocio del módulo

- `RN-ASG-01`: Un estudiante solo podrá tener una asignación activa a la vez.
- `RN-ASG-02`: Si un estudiante ya se encuentra asignado, una nueva asignación reemplazará la previa.
- `RN-ASG-03`: La asignación podrá registrar qué administrador la realizó.
- `RN-ASG-04`: Solo los administradores podrán crear, importar o eliminar asignaciones.

## 3.5 Módulo de preguntas del estudiante

### 3.5.1 Descripción

Este módulo permite al estudiante crear preguntas y consultar su historial y detalle.

### 3.5.2 Endpoints relacionados

- `POST /api/student/questions`
- `GET /api/student/questions/my`
- `GET /api/student/questions/{id}`
- `GET /api/student/questions/{id}/answers`

### 3.5.3 Requisitos funcionales

- `RF-EST-01`: El sistema deberá permitir al estudiante crear una pregunta académica.
- `RF-EST-02`: El sistema deberá validar reCAPTCHA al crear una pregunta.
- `RF-EST-03`: El sistema deberá asignar automáticamente a la pregunta el tutor relacionado con el estudiante, si existe asignación.
- `RF-EST-04`: El sistema deberá permitir al estudiante listar sus preguntas de forma paginada.
- `RF-EST-05`: El sistema deberá permitir filtrar preguntas por estado y alcance.
- `RF-EST-06`: El sistema deberá permitir consultar el detalle de una pregunta propia.
- `RF-EST-07`: El sistema deberá permitir consultar el historial de respuestas de una pregunta propia.

### 3.5.4 Reglas de negocio del módulo

- `RN-EST-01`: Un estudiante solo podrá ver y operar preguntas que le pertenezcan.
- `RN-EST-02`: Una pregunta podrá crearse sin tutor asignado si el estudiante no tiene relación activa con uno.
- `RN-EST-03`: Las preguntas iniciarán con estado `PENDIENTE`.
- `RN-EST-04`: El alcance (`scope`) de la pregunta deberá pertenecer al catálogo permitido por el sistema.

## 3.6 Módulo de atención de preguntas del tutor

### 3.6.1 Descripción

Este módulo permite al tutor consultar pendientes, responder preguntas y operar sobre su ciclo de vida.

### 3.6.2 Endpoints relacionados

- `GET /api/tutor/questions/pending`
- `GET /api/tutor/questions/pending/my`
- `POST /api/tutor/questions/{id}/answer`
- `POST /api/tutor/questions/{id}/correct`
- `POST /api/tutor/questions/{id}/reject`
- `POST /api/tutor/questions/{id}/reclassify`
- `GET /api/tutor/questions/history`
- `GET /api/tutor/answers/history`

### 3.6.3 Requisitos funcionales

- `RF-TUT-01`: El sistema deberá permitir al tutor consultar preguntas pendientes.
- `RF-TUT-02`: El sistema deberá permitir filtrar pendientes por alcance y texto.
- `RF-TUT-03`: El sistema deberá permitir publicar una respuesta a una pregunta.
- `RF-TUT-04`: El sistema deberá permitir corregir una respuesta previamente emitida.
- `RF-TUT-05`: El sistema deberá permitir rechazar una pregunta con motivo.
- `RF-TUT-06`: El sistema deberá permitir reclasificar el alcance de una pregunta.
- `RF-TUT-07`: El sistema deberá permitir consultar el historial de preguntas atendidas.
- `RF-TUT-08`: El sistema deberá permitir consultar el historial de respuestas por pregunta.

### 3.6.4 Reglas de negocio del módulo

- `RN-TUT-01`: Solo un tutor autenticado podrá responder, corregir, rechazar o reclasificar preguntas desde este módulo.
- `RN-TUT-02`: Una respuesta nueva cambiará el estado de la pregunta a `PUBLICADA`.
- `RN-TUT-03`: Una corrección cambiará el estado de la pregunta a `CORREGIDA`.
- `RN-TUT-04`: Una pregunta rechazada no podrá responderse posteriormente sin cambio de lógica del sistema.
- `RN-TUT-05`: No se podrá corregir una pregunta que no tenga respuesta previa.
- `RN-TUT-06`: No se podrá rechazar una pregunta que ya fue publicada o corregida.
- `RN-TUT-07`: Cada corrección generará una nueva versión de respuesta.
- `RN-TUT-08`: La pregunta mantendrá referencia a la respuesta vigente.

## 3.7 Módulo de dashboards y consultas operativas

### 3.7.1 Descripción

Este módulo concentra consultas de resumen y apoyo operativo al trabajo del tutor y al uso del frontend por rol.

### 3.7.2 Endpoints relacionados

- `GET /api/tutor/dashboard/summary`
- `GET /api/tutor/questions/recent`
- rutas frontend `/admin`, `/student`, `/tutor`, `/student/questions`, `/student/ask`, `/tutor/pending`, `/tutor/history`, `/admin/students`, `/admin/tutors`, `/admin/assignments`, `/admin/users`, `/admin/admins`, `/admin/profile`

### 3.7.3 Requisitos funcionales

- `RF-DAS-01`: El sistema deberá proporcionar al tutor un resumen de pendientes, respuestas del día y total de respuestas.
- `RF-DAS-02`: El sistema deberá permitir al tutor consultar preguntas recientes.
- `RF-DAS-03`: El frontend deberá dirigir al usuario autenticado al dashboard correspondiente a su rol.
- `RF-DAS-04`: El frontend deberá proteger las rutas según rol.

### 3.7.4 Reglas de negocio del módulo

- `RN-DAS-01`: Cada rol visualizará únicamente las rutas y vistas habilitadas para su perfil.
- `RN-DAS-02`: Los indicadores del dashboard del tutor se calcularán con base en preguntas y respuestas asociadas a ese tutor.

## 3.8 Módulo de seguridad y validación pública

### 3.8.1 Descripción

Este módulo cubre salud del sistema, verificación pública de reCAPTCHA y control transversal de acceso.

### 3.8.2 Endpoints relacionados

- `POST /api/recaptcha/verify`
- `GET /api/health`

### 3.8.3 Requisitos funcionales

- `RF-SEG-01`: El sistema deberá exponer un endpoint de salud para validación operativa básica.
- `RF-SEG-02`: El sistema deberá permitir verificar tokens reCAPTCHA.
- `RF-SEG-03`: El sistema deberá proteger endpoints privados mediante JWT y roles.

### 3.8.4 Reglas de negocio del módulo

- `RN-SEG-01`: Los endpoints públicos deberán mantenerse limitados a funciones de acceso, salud y validación pública.
- `RN-SEG-02`: Los endpoints `/api/admin/**`, `/api/tutor/**` y `/api/student/**` deberán estar restringidos por rol.

## 3.9 Módulo de auditoría y trazabilidad

### 3.9.1 Descripción

Este módulo permite persistir evidencia operativa y de seguridad asociada al uso del sistema.

### 3.9.2 Requisitos funcionales

- `RF-AUD-01`: El sistema deberá registrar acciones relevantes de autenticación.
- `RF-AUD-02`: El sistema deberá registrar éxitos y fallos de operaciones críticas.
- `RF-AUD-03`: El sistema deberá almacenar usuario, IP, método, ruta y mensaje asociado al evento.

### 3.9.3 Reglas de negocio del módulo

- `RN-AUD-01`: Toda operación crítica de autenticación o negocio deberá poder dejar evidencia auditable.
- `RN-AUD-02`: La auditoría deberá ser persistente y no depender solo de logs temporales.

## 4. Requisitos no funcionales

## 4.1 Seguridad

- `RNF-SEG-01`: El sistema deberá utilizar autenticación basada en JWT para sesiones API.
- `RNF-SEG-02`: El sistema deberá usar MFA por OTP en el login.
- `RNF-SEG-03`: El sistema deberá almacenar contraseñas de forma cifrada mediante hash seguro.
- `RNF-SEG-04`: El sistema deberá validar roles antes de permitir acceso a rutas protegidas.
- `RNF-SEG-05`: El sistema deberá proteger flujos expuestos mediante reCAPTCHA.
- `RNF-SEG-06`: El sistema deberá registrar eventos relevantes de seguridad.

## 4.2 Rendimiento

- `RNF-REN-01`: El sistema deberá responder en tiempos aceptables para operaciones de autenticación, consulta y gestión académica.
- `RNF-REN-02`: La paginación deberá utilizarse en consultas potencialmente voluminosas del estudiante.
- `RNF-REN-03`: El sistema deberá soportar uso concurrente típico de una operación académica institucional pequeña o media.

## 4.3 Disponibilidad y confiabilidad

- `RNF-DIS-01`: El sistema deberá contar con un endpoint de salud para monitoreo básico.
- `RNF-DIS-02`: Los flujos críticos dependientes de correo deberán operar con un servicio SMTP confiable.
- `RNF-DIS-03`: Los errores de operación deberán ser manejados por controladores o manejadores globales para respuestas consistentes.

## 4.4 Mantenibilidad

- `RNF-MAN-01`: El software deberá mantener separación por capas entre controladores, servicios, dominio y DTOs.
- `RNF-MAN-02`: La evolución del esquema de base de datos deberá ser versionable.
- `RNF-MAN-03`: El sistema deberá permitir agregar nuevos módulos o endpoints sin rediseño total.
- `RNF-MAN-04`: La configuración sensible deberá externalizarse mediante variables de entorno o archivos de configuración.

## 4.5 Usabilidad

- `RNF-USA-01`: El frontend deberá ofrecer rutas diferenciadas por rol.
- `RNF-USA-02`: El sistema deberá mostrar mensajes claros ante errores de autenticación, validación o permisos.
- `RNF-USA-03`: El flujo de primer acceso deberá ser entendible para usuarios creados por administración.
- `RNF-USA-04`: El sistema deberá redirigir automáticamente a login cuando la sesión ya no sea válida.

## 4.6 Compatibilidad y tecnología

- `RNF-TEC-01`: El frontend deberá operar como aplicación web SPA en navegador moderno.
- `RNF-TEC-02`: El backend deberá exponer servicios REST sobre HTTP.
- `RNF-TEC-03`: La persistencia deberá operar sobre PostgreSQL.
- `RNF-TEC-04`: El sistema deberá ser desplegable en entornos donde Java 17 y Node/Vite sean soportados.

## 5. Reglas de negocio transversales

- `RNT-01`: Todo usuario del sistema deberá tener un rol único operativo.
- `RNT-02`: Los roles válidos del sistema serán `ADMIN`, `TUTOR` y `ESTUDIANTE`.
- `RNT-03`: Los estados válidos del usuario serán `CREATED_BY_ADMIN`, `ACTIVE`, `DISABLED` y `BLOCKED`.
- `RNT-04`: El acceso a la información deberá depender del rol y de la identidad del usuario autenticado.
- `RNT-05`: Los estudiantes solo podrán acceder a sus propios datos funcionales.
- `RNT-06`: Los tutores solo podrán operar desde los endpoints habilitados para su perfil.
- `RNT-07`: Los administradores serán los únicos autorizados para gestionar altas, cambios de estado y asignaciones.
- `RNT-08`: Una pregunta pertenecerá a un estudiante y podrá estar asociada a un tutor.
- `RNT-09`: Una pregunta tendrá un estado funcional y podrá tener múltiples respuestas versionadas.
- `RNT-10`: La respuesta vigente de una pregunta será la marcada como actual por el sistema.
- `RNT-11`: Toda operación crítica deberá ser susceptible de registro en auditoría.

## 6. Restricciones del sistema

- `RES-01`: El sistema depende de correo electrónico para OTP y primer acceso.
- `RES-02`: El sistema depende de reCAPTCHA para ciertos flujos públicos o sensibles.
- `RES-03`: La configuración de CORS y URLs base debe mantenerse coherente entre ambientes.
- `RES-04`: El modelo actual asume una única asignación activa por estudiante.

## 7. Criterios de aceptación de alto nivel

- `CA-01`: Un usuario válido podrá autenticarse mediante credenciales, OTP y redirección a su módulo.
- `CA-02`: Un administrador podrá crear y administrar cuentas de estudiantes, tutores y administradores.
- `CA-03`: Un administrador podrá asignar un estudiante a un tutor y consultar la relación creada.
- `CA-04`: Un estudiante podrá crear preguntas y consultar su historial y respuestas.
- `CA-05`: Un tutor podrá responder, corregir, rechazar y reclasificar preguntas.
- `CA-06`: El sistema mantendrá separación de permisos por rol.
- `CA-07`: El sistema registrará eventos críticos en auditoría.

## 8. Conclusión

TutorLink presenta un conjunto de requisitos claramente estructurado alrededor de su dominio académico principal: identidad, tutoría, asignación y atención de preguntas. Los controladores y rutas muestran un sistema funcionalmente maduro para una primera versión institucional, con seguridad reforzada, separación por roles y trazabilidad operativa.

La presente SRS formaliza esos comportamientos y deja una base documental útil para desarrollo, pruebas, mantenimiento, validación con usuarios y futuras ampliaciones del sistema.
