# Acta de Constitución del Proyecto y Business Case - TutorLink

Fecha de elaboración: 2026-03-23

## 1. Acta de Constitución del Proyecto

### 1.1 Nombre del proyecto

TutorLink - Plataforma digital para gestión de tutorías académicas universitarias

### 1.2 Propósito del proyecto

Desarrollar e implantar una plataforma web que permita gestionar de forma segura, estructurada y trazable la relación entre estudiantes, tutores y administradores académicos, facilitando la atención de dudas, la asignación de tutorías y el seguimiento de interacciones académicas.

### 1.3 Antecedentes y contexto

En entornos universitarios, la gestión de tutorías y acompañamiento académico suele operar con procesos fragmentados, poco trazables y altamente dependientes de correo informal, mensajería o gestión manual. Esto genera tiempos de respuesta variables, poca visibilidad institucional y dificultades para dar seguimiento a estudiantes y tutores.

TutorLink surge como una respuesta a esa necesidad, proponiendo una solución centralizada con control por roles, autenticación reforzada, trazabilidad operativa y un flujo estructurado para registro, asignación, atención y seguimiento de preguntas académicas.

### 1.4 Justificación del proyecto

El proyecto se justifica por la necesidad de:

- digitalizar el proceso de tutorías académicas,
- reducir la dependencia de mecanismos manuales o no estandarizados,
- mejorar la trazabilidad de las interacciones entre estudiantes y tutores,
- fortalecer la seguridad de acceso a información académica,
- facilitar la administración institucional de usuarios, estados y asignaciones,
- contar con evidencia operativa y auditoría para fines de control y mejora continua.

### 1.5 Objetivo general

Implementar una plataforma de tutorías académicas que permita administrar usuarios institucionales, asignar estudiantes a tutores, canalizar preguntas académicas y asegurar el seguimiento del proceso mediante un sistema web con autenticación segura y arquitectura escalable.

### 1.6 Objetivos específicos del negocio

- Centralizar en una sola plataforma el proceso de interacción académica entre estudiante y tutor.
- Reducir tiempos de atención y respuesta a preguntas académicas.
- Garantizar que cada estudiante pueda identificar y consultar a su tutor asignado.
- Brindar a la administración académica control sobre altas, estados, perfiles y asignaciones.
- Elevar la seguridad del acceso mediante autenticación con OTP y control por roles.
- Asegurar trazabilidad institucional sobre accesos, operaciones y eventos críticos.

### 1.7 Alcance del proyecto

El alcance funcional identificado en la solución actual incluye:

- autenticación con credenciales, reCAPTCHA y OTP,
- primer acceso mediante enlace de activación,
- administración de usuarios `ADMIN`, `TUTOR` y `ESTUDIANTE`,
- creación y edición de perfiles académicos,
- importación masiva por CSV,
- asignación de estudiantes a tutores,
- consulta del tutor asignado por parte del estudiante,
- creación de preguntas académicas,
- atención de preguntas por parte del tutor,
- corrección, rechazo o reclasificación de preguntas,
- consulta de historial y dashboard por rol,
- auditoría de acciones y eventos de seguridad,
- cambio de contraseña con OTP.

### 1.8 Exclusiones de alcance

Con base en lo observado en el código, quedan fuera del alcance actual:

- videollamadas o tutorías síncronas en tiempo real,
- notificaciones push o mensajería instantánea,
- analítica avanzada institucional,
- integración formal con sistemas escolares externos,
- app móvil nativa,
- flujos multisedes o multiinstitución.

### 1.9 Entregables principales

- frontend web para estudiantes, tutores y administradores,
- backend REST con control de acceso por roles,
- base de datos relacional con modelo de usuarios, tutorías y preguntas,
- mecanismos de autenticación, OTP y primer login,
- módulo administrativo de altas, edición e importación,
- módulo de preguntas y respuestas,
- registro de auditoría,
- documentación técnica y funcional del sistema.

### 1.10 Stakeholders clave

- Dirección o coordinación académica
- Administradores del sistema
- Tutores académicos
- Estudiantes
- Equipo de desarrollo
- Equipo de operación o soporte técnico

### 1.11 Roles de negocio detectados en la solución

#### `ADMIN`

Responsable de:

- crear usuarios,
- importar usuarios,
- administrar estados,
- asignar tutor-estudiante,
- consultar listados y relaciones académicas.

#### `ESTUDIANTE`

Responsable de:

- autenticarse en la plataforma,
- consultar su tutor asignado,
- crear preguntas académicas,
- revisar detalle de sus preguntas,
- consultar respuestas e historial.

#### `TUTOR`

Responsable de:

- atender preguntas asignadas,
- responder, corregir, rechazar o reclasificar consultas,
- consultar dashboard y pendientes,
- mantener su perfil profesional/académico.

### 1.12 Supuestos del proyecto

- La institución dispone de correos institucionales válidos para sus usuarios.
- Existe una operación académica que asigna formalmente estudiantes a tutores.
- Los administradores cuentan con insumos correctos para altas e importaciones por CSV.
- El sistema será usado inicialmente en un entorno universitario controlado.
- La disponibilidad de correo SMTP es suficiente para OTP y flujos de onboarding.

### 1.13 Restricciones del proyecto

- Dependencia de configuración de correo para los flujos críticos.
- Dependencia de PostgreSQL como motor de persistencia.
- Dependencia de reCAPTCHA para validación antiabuso.
- Configuración actual parcialmente acoplada a IPs locales y variables de entorno específicas.
- Arquitectura monolítica, adecuada para la etapa actual pero con límites de escalamiento horizontal funcional.

### 1.14 Riesgos iniciales del proyecto

- Falla de entrega de correos OTP o primer acceso.
- Configuración inconsistente entre ambientes.
- Dependencia de procesos administrativos para mantener asignaciones correctas.
- Posible degradación de rendimiento si el volumen de consultas crece y ciertos filtros siguen ejecutándose en memoria.
- Riesgos de endurecimiento de seguridad si el frontend mantiene token en `localStorage` sin controles complementarios.

### 1.15 Criterios de aprobación del proyecto

El proyecto se considerará formalmente constituido y orientado al cumplimiento de negocio cuando:

- cubra los flujos de alta, autenticación, asignación y atención de preguntas,
- exista separación funcional por roles,
- la seguridad básica del acceso esté operativa,
- la trazabilidad de acciones críticas esté disponible,
- el sistema sea apto para ser utilizado por una operación académica real.

## 2. Business Case

### 2.1 Resumen ejecutivo del caso de negocio

TutorLink representa una inversión tecnológica orientada a formalizar y optimizar la gestión de tutorías académicas. La plataforma ataca un problema operativo concreto: la dispersión de interacciones académicas, la falta de control institucional sobre asignaciones y la baja trazabilidad de la comunicación entre estudiante y tutor.

El caso de negocio es favorable porque la solución resuelve necesidades institucionales reales con una arquitectura relativamente simple, ya funcional y alineada con procesos universitarios comunes. El valor no se limita a automatizar tareas; también mejora control, seguridad, visibilidad y capacidad de seguimiento.

### 2.2 Problema de negocio

Antes de una plataforma como TutorLink, los procesos de tutoría suelen presentar:

- falta de un canal único de interacción,
- poca visibilidad institucional sobre dudas y respuestas,
- dificultad para rastrear atención por estudiante o tutor,
- altas y asignaciones hechas de forma dispersa,
- controles de acceso débiles,
- nula o limitada evidencia para auditoría y mejora de proceso.

### 2.3 Oportunidad

La oportunidad del proyecto consiste en crear una plataforma institucional capaz de:

- consolidar la operación de tutorías,
- profesionalizar la atención académica,
- estandarizar el ciclo de preguntas y respuestas,
- generar datos para seguimiento,
- reducir carga administrativa repetitiva,
- ofrecer una experiencia más clara y segura para los usuarios.

### 2.4 Objetivos del negocio

- Incrementar la eficiencia operativa del proceso de tutorías.
- Mejorar la experiencia del estudiante en el acceso a acompañamiento académico.
- Fortalecer la capacidad institucional para gestionar tutores y tutorados.
- Aumentar la seguridad y gobernanza del acceso a información académica.
- Generar trazabilidad y evidencia operativa para toma de decisiones.

### 2.5 Beneficios esperados

#### Beneficios tangibles

- reducción del tiempo administrativo para alta y asignación de usuarios,
- menor dependencia de correos o mensajes no estructurados,
- mayor velocidad en el ciclo de atención de preguntas,
- menor esfuerzo para seguimiento de casos e historial,
- posibilidad de importación masiva de usuarios y relaciones.

#### Beneficios intangibles

- mejor percepción de orden y formalidad institucional,
- mayor confianza en el proceso de tutorías,
- mejor experiencia de onboarding para usuarios creados por administración,
- incremento de trazabilidad y transparencia operativa,
- fortalecimiento del control académico.

### 2.6 Alternativas consideradas implícitamente

Con base en el problema que resuelve TutorLink, las alternativas típicas serían:

- mantener el proceso manual con correo y hojas de cálculo,
- usar herramientas genéricas no diseñadas para tutorías,
- desarrollar una solución propia institucional.

La solución implementada apuesta por la tercera alternativa, lo cual es coherente cuando se requiere:

- adaptación al dominio académico local,
- control de roles y reglas específicas,
- integración futura con procesos institucionales,
- propiedad sobre datos y evolución funcional.

### 2.7 Razones para invertir en el proyecto

- El problema que resuelve es recurrente y estructural.
- La digitalización del proceso impacta directamente en eficiencia académica.
- El sistema ya refleja una lógica de negocio alineada con los actores reales.
- La inversión técnica construye una base reutilizable para futuras ampliaciones.
- Mejora seguridad, control y trazabilidad en comparación con mecanismos manuales.

### 2.8 Viabilidad del proyecto

#### Viabilidad funcional

Alta. El sistema ya contempla los procesos nucleares necesarios para operar tutorías académicas con tres perfiles institucionales.

#### Viabilidad técnica

Alta. El stack elegido es moderno, ampliamente soportado y adecuado para una solución institucional web:

- React/Vite en frontend,
- Spring Boot en backend,
- PostgreSQL como persistencia,
- Flyway para evolución del esquema.

#### Viabilidad operativa

Media-alta. La operación depende de una correcta administración de usuarios, correo saliente confiable y una gobernanza clara de asignaciones académicas.

### 2.9 Costos y esfuerzo esperados

Aunque el código analizado no contiene información financiera, el esfuerzo del proyecto se concentra en:

- desarrollo y mantenimiento de frontend y backend,
- despliegue y operación de base de datos,
- configuración de correo y seguridad,
- soporte a usuarios,
- evolución funcional y hardening técnico.

### 2.10 Criterios de éxito del negocio

El proyecto se considerará exitoso desde el negocio si:

- los administradores pueden gestionar usuarios y asignaciones sin procesos paralelos,
- los estudiantes identifican a su tutor y pueden canalizar sus preguntas por la plataforma,
- los tutores atienden preguntas desde un flujo único y auditable,
- el sistema reduce fricción operativa respecto a mecanismos manuales,
- la institución obtiene trazabilidad sobre accesos y atención académica.

### 2.11 Criterios de éxito técnicos

#### Seguridad

- autenticación con JWT operativa y estable,
- MFA por OTP funcionando en login,
- protección por roles correctamente aplicada,
- validación antiabuso con reCAPTCHA en flujos críticos,
- auditoría persistente de acciones relevantes.

#### Calidad funcional

- creación y activación de usuarios sin errores de flujo,
- asignación tutor-estudiante consistente,
- preguntas creadas y recuperadas correctamente por estudiante,
- respuestas, correcciones, rechazos y reclasificaciones consistentes,
- dashboards y listados alineados con el rol autenticado.

#### Calidad de datos

- integridad entre usuarios, perfiles, asignaciones y preguntas,
- unicidad de correo, matrícula y código de tutor,
- consistencia del historial de respuestas y estado actual de la pregunta,
- trazabilidad de eventos críticos.

#### Operación y mantenibilidad

- configuración externalizada por variables de entorno,
- esquema de base de datos versionado y reproducible,
- separación razonable por capas y responsabilidades,
- facilidad para incorporar nuevos endpoints o reglas de negocio,
- capacidad de diagnosticar fallos mediante logs y auditoría.

#### Rendimiento y disponibilidad

- tiempos de respuesta aceptables en autenticación, listados y atención de preguntas,
- operación estable bajo uso académico regular,
- envío confiable de correos para OTP y primer acceso,
- disponibilidad suficiente del backend y base de datos para uso institucional.

### 2.12 Indicadores sugeridos para medir éxito

- porcentaje de usuarios activados exitosamente,
- porcentaje de logins completados con OTP,
- tiempo promedio de respuesta del tutor a una pregunta,
- número de estudiantes con tutor asignado,
- porcentaje de preguntas atendidas frente a pendientes,
- número de incidencias por acceso o autenticación,
- volumen de operaciones auditadas sin error,
- porcentaje de importaciones masivas ejecutadas sin fallas.

## 3. Conclusión

TutorLink tiene un fundamento claro como proyecto institucional: responde a una necesidad real del proceso de tutorías, posee una solución técnicamente viable y ofrece beneficios operativos, de seguridad y de gobernanza académica. Tanto el Acta de Constitución como el Business Case muestran que el proyecto no solo es técnicamente justificable, sino también estratégicamente útil para una universidad que busque profesionalizar el acompañamiento académico.

El siguiente nivel de madurez recomendado consiste en consolidar la operación productiva, estandarizar configuraciones por ambiente, endurecer algunos aspectos técnicos y definir KPIs formales para medir adopción, seguridad y eficiencia.
