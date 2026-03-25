# Registro de Riesgos y Plan de Respuesta a Riesgos - TutorLink

Fecha de elaboración: 2026-03-24

## 1. Propósito del documento

Este documento presenta el registro de riesgos y el plan de respuesta a riesgos para TutorLink, considerando el stack tecnológico actual del proyecto, su arquitectura, sus dependencias externas y sus mecanismos de seguridad y operación.

El análisis se centra en:

- vulnerabilidades comunes de seguridad,
- cuellos de botella de rendimiento,
- riesgos de configuración,
- riesgos de operación,
- dependencias externas críticas.

## 2. Contexto tecnológico analizado

El sistema TutorLink está construido con el siguiente stack principal:

- `Backend`: Java 17, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Flyway
- `Base de datos`: PostgreSQL
- `Autenticación`: JWT + OTP por correo
- `Frontend`: React 19, Vite, Axios, React Router
- `Validación antiabuso`: Google reCAPTCHA
- `Correo`: JavaMailSender con SMTP
- `Persistencia de sesión en cliente`: `localStorage`

## 3. Escala de evaluación

### 3.1 Probabilidad

- `Baja`: ocurrencia poco frecuente o muy dependiente de condiciones excepcionales
- `Media`: ocurrencia posible en operación normal
- `Alta`: ocurrencia probable o recurrente sin controles adicionales

### 3.2 Impacto

- `Bajo`: afecta parcialmente una función secundaria
- `Medio`: afecta una capacidad importante pero recuperable
- `Alto`: compromete seguridad, disponibilidad, integridad o continuidad operativa

### 3.3 Nivel de prioridad

La prioridad se obtiene por criterio cualitativo combinando probabilidad e impacto:

- `Crítica`
- `Alta`
- `Media`
- `Baja`

## 4. Registro de riesgos

| ID | Riesgo | Categoría | Probabilidad | Impacto | Prioridad | Descripción |
|---|---|---|---|---|---|---|
| R-01 | Exposición de JWT por almacenamiento en `localStorage` | Seguridad | Media | Alto | Crítica | El token de sesión se persiste en el navegador, lo que incrementa exposición ante ataques XSS. |
| R-02 | Configuración CORS rígida con IPs fijas | Seguridad / Operación | Alta | Medio | Alta | La política actual de orígenes permitidos depende de IPs específicas y puede fallar o abrir configuraciones inseguras al cambiar de entorno. |
| R-03 | Falta de endurecimiento adicional ante XSS | Seguridad | Media | Alto | Alta | La SPA depende de `localStorage` y no se observan controles explícitos como CSP, sanitización central o hardening front adicional. |
| R-04 | Dependencia crítica de SMTP para onboarding y OTP | Dependencias externas | Alta | Alto | Crítica | Si el servicio de correo falla, se afectan primer acceso, OTP de login y cambio de contraseña. |
| R-05 | Dependencia crítica de reCAPTCHA | Dependencias externas | Media | Medio | Alta | Si Google reCAPTCHA no responde o la clave está mal configurada, se bloquean registro, login o creación de preguntas. |
| R-06 | Convivencia de Flyway con `ddl-auto: update` | Datos / Operación | Alta | Alto | Crítica | Puede producir deriva de esquema, diferencias entre ambientes o cambios no controlados en la base de datos. |
| R-07 | Filtros y búsquedas en memoria para ciertos listados | Rendimiento | Media | Medio | Alta | Algunas operaciones cargan colecciones y luego filtran en memoria, lo que puede escalar mal con más datos. |
| R-08 | Cuello de botella por envío síncrono de correo | Rendimiento / Operación | Media | Medio | Alta | El flujo de negocio depende del tiempo de respuesta del envío de correo durante operaciones sensibles. |
| R-09 | Dependencia de red local / URLs hardcodeadas | Configuración / Despliegue | Alta | Medio | Alta | Hay URLs base e IPs privadas embebidas en frontend y backend que complican despliegue estable por entorno. |
| R-10 | Manejo amplio de excepciones con mensajes internos | Seguridad / Soporte | Media | Medio | Media | Algunos errores pueden devolver mensajes internos útiles para depuración pero sensibles en producción. |
| R-11 | Riesgo de agotamiento por intentos OTP o abuso del login | Seguridad / Disponibilidad | Media | Medio | Alta | El sistema limita intentos por OTP, pero pueden existir campañas repetitivas de generación de OTP y presión sobre correo. |
| R-12 | Inconsistencia criptográfica por uso mixto de `PasswordEncoder` y `BCrypt` directo | Seguridad / Mantenibilidad | Media | Medio | Media | La coexistencia de dos enfoques de hash complica estandarización y evolución futura. |
| R-13 | Falta de monitoreo avanzado y alertamiento | Operación | Media | Medio | Media | Existe logging a archivo, pero no se observa observabilidad integral ni alertas operativas. |
| R-14 | Riesgo por disponibilidad de base de datos PostgreSQL | Infraestructura | Media | Alto | Alta | La aplicación depende completamente de PostgreSQL para autenticación, usuarios, preguntas, OTP y auditoría. |
| R-15 | Riesgo de degradación por crecimiento de auditoría y OTP | Datos / Rendimiento | Media | Medio | Media | Las tablas operativas de auditoría y OTP pueden crecer con rapidez y afectar consultas o mantenimiento. |
| R-16 | Riesgo de cuentas bloqueadas por errores de configuración de tiempo | Operación / Seguridad | Baja | Medio | Media | Configuraciones incorrectas de expiración JWT, OTP o tokens de primer acceso pueden romper flujos de acceso. |
| R-17 | Riesgo de fuga de información por logs o mensajes de error | Seguridad | Baja | Medio | Media | Dependiendo de configuración, podrían persistirse mensajes o trazas con demasiada información contextual. |
| R-18 | Riesgo de concurrencia en reasignación de tutor-estudiante | Integridad | Baja | Medio | Media | Dos operaciones administrativas simultáneas podrían competir por la relación operativa del mismo estudiante. |
| R-19 | Riesgo de ausencia de pruebas automatizadas suficientes | Calidad | Media | Alto | Alta | El crecimiento funcional sin automatización puede introducir regresiones en seguridad y reglas de negocio. |
| R-20 | Riesgo de indisponibilidad del frontend por configuración de `VITE_API_BASE_URL` | Configuración | Media | Medio | Media | Una URL de API incorrecta rompe login, dashboards y operaciones principales del cliente. |

## 5. Análisis cualitativo de riesgos prioritarios

## 5.1 Riesgos críticos

### R-01 Exposición de JWT por `localStorage`

Es uno de los riesgos más sensibles porque afecta directamente la seguridad de la sesión. Si existe una vulnerabilidad XSS, el token puede ser robado y reutilizado.

### R-04 Dependencia crítica de correo

El correo forma parte de procesos centrales:

- primer acceso,
- OTP de login,
- OTP de cambio de contraseña.

Una caída de SMTP afecta autenticación y continuidad operativa.

### R-06 Convivencia Flyway + `ddl-auto: update`

Representa un riesgo estructural de gobernanza del esquema. Puede generar ambientes no equivalentes y dificultar trazabilidad de cambios en datos.

## 5.2 Riesgos altos

### Seguridad

- CORS rígido y dependiente de IPs
- XSS sin endurecimiento adicional
- abuso de generación de OTP
- mensajes internos de error

### Rendimiento

- filtros en memoria
- correo síncrono
- crecimiento de tablas auxiliares

### Operación

- URLs e IPs privadas en configuración
- falta de monitoreo y alertamiento
- dependencia fuerte de PostgreSQL

## 6. Plan de respuesta a riesgos

## 6.1 Estrategias de respuesta

Las estrategias utilizadas en este documento son:

- `Mitigar`: reducir probabilidad o impacto
- `Evitar`: cambiar el diseño o proceso para eliminar el riesgo
- `Transferir`: delegar parte del riesgo a terceros o servicios especializados
- `Aceptar`: asumir el riesgo con monitoreo y contingencia

## 6.2 Respuesta detallada por riesgo

| ID | Estrategia | Plan de respuesta | Responsable sugerido |
|---|---|---|---|
| R-01 | Mitigar | Evaluar migración a cookies seguras HttpOnly o, si se mantiene `localStorage`, implementar CSP, revisión XSS, sanitización y auditorías de frontend. | Arquitectura / Frontend / Seguridad |
| R-02 | Mitigar | Externalizar CORS por ambiente, usar listas controladas por variables y evitar IPs hardcodeadas en producción. | Backend / DevOps |
| R-03 | Mitigar | Incorporar políticas CSP, revisión de dependencias frontend, sanitización de contenido dinámico y pruebas de seguridad web. | Frontend / Seguridad |
| R-04 | Mitigar | Configurar proveedor SMTP confiable, monitoreo de entrega, reintentos controlados y fallback operativo para soporte manual. | Backend / Operación |
| R-05 | Mitigar | Implementar manejo robusto de error, timeout, monitoreo y capacidad de diagnóstico de fallos de reCAPTCHA. | Backend |
| R-06 | Evitar | Desactivar `ddl-auto: update` en ambientes controlados y usar exclusivamente Flyway para evolución del esquema. | Backend / DBA |
| R-07 | Mitigar | Mover filtros a consultas de base de datos, agregar índices adecuados y revisar listados críticos con crecimiento de datos. | Backend / DBA |
| R-08 | Mitigar | Desacoplar envío de correo mediante colas, tareas asíncronas o ejecución fuera del hilo principal cuando sea viable. | Backend |
| R-09 | Mitigar | Parametrizar `frontend-base-url`, `VITE_API_BASE_URL` y orígenes permitidos por ambiente. | Backend / Frontend / DevOps |
| R-10 | Mitigar | Normalizar respuestas de error para producción y restringir mensajes internos detallados a logs controlados. | Backend |
| R-11 | Mitigar | Añadir throttling por IP/usuario, monitoreo de intentos, límites de emisión OTP y alertas por comportamiento anómalo. | Backend / Seguridad |
| R-12 | Mitigar | Estandarizar la estrategia de hash usando únicamente `PasswordEncoder` administrado por Spring. | Backend |
| R-13 | Mitigar | Incorporar monitoreo centralizado, métricas, dashboards de salud y alertas sobre fallos críticos. | DevOps / Operación |
| R-14 | Mitigar | Implementar respaldos, verificación de restauración, monitoreo de disponibilidad y tuning básico de PostgreSQL. | DBA / Infraestructura |
| R-15 | Mitigar | Definir políticas de retención o archivado para OTP y auditoría, además de índices y tareas de mantenimiento. | DBA / Backend |
| R-16 | Mitigar | Versionar y validar parámetros temporales por ambiente; documentar valores esperados y revisar expiraciones en QA. | Backend / QA |
| R-17 | Mitigar | Revisar logs, niveles de logging y contenido de mensajes para evitar exposición innecesaria de datos operativos. | Backend / Seguridad |
| R-18 | Aceptar con control | Mantener restricción de unicidad y considerar bloqueo transaccional o validación reforzada si crece la concurrencia administrativa. | Backend / DBA |
| R-19 | Mitigar | Incrementar cobertura de pruebas unitarias, integración y API sobre flujos críticos del negocio. | Backend / QA |
| R-20 | Mitigar | Validar configuración del frontend por ambiente y agregar checklist de despliegue para URL base de API. | Frontend / DevOps |

## 7. Plan de contingencia por categoría

## 7.1 Seguridad

Ante incidentes de seguridad:

- invalidar sesiones activas si hay sospecha de robo de token,
- revisar logs de auditoría,
- verificar integridad de configuraciones,
- rotar secretos JWT si fuera necesario,
- deshabilitar temporalmente rutas expuestas si hay ataque activo.

## 7.2 Correo y autenticación

Ante falla de correo:

- verificar conectividad SMTP y credenciales,
- revisar logs del backend,
- habilitar soporte manual para activación o cambio de contraseña,
- priorizar restauración del servicio porque impacta acceso al sistema.

## 7.3 Base de datos

Ante falla de PostgreSQL:

- activar procedimiento de restauración desde backup,
- validar integridad de migraciones,
- comprobar consistencia de usuarios, OTP y preguntas,
- ejecutar revisión posterior a la recuperación.

## 7.4 Rendimiento

Ante degradación de respuesta:

- identificar endpoints con consultas costosas,
- revisar tablas con crecimiento acelerado,
- verificar tiempos de SMTP o dependencias externas,
- perfilar consultas y uso de memoria.

## 8. Vulnerabilidades comunes a vigilar

## 8.1 XSS

Riesgo especialmente relevante por uso de `localStorage` para JWT.

Respuesta:

- revisión de renderizado dinámico,
- sanitización,
- CSP,
- pruebas de seguridad del frontend.

## 8.2 CSRF

El backend opera en modo stateless con JWT y CSRF deshabilitado. En el diseño actual el riesgo es menor que en cookies de sesión clásicas, pero debe revisarse si cambia el mecanismo de autenticación.

## 8.3 Fuerza bruta / abuso de login

Aunque existe OTP, un flujo de login puede ser objetivo de abuso.

Respuesta:

- limitar frecuencia,
- auditar intentos,
- reforzar análisis de IP y comportamiento.

## 8.4 Exposición de configuración sensible

Secretos JWT, claves SMTP y reCAPTCHA dependen de variables de entorno.

Respuesta:

- control estricto de `.env`,
- segregación por ambiente,
- no exponer secretos en repositorio o logs.

## 9. Cuellos de botella de rendimiento identificados

- envío de correo dentro de flujos de negocio sensibles,
- consultas y filtros en memoria para históricos y listados,
- crecimiento de tablas de auditoría y OTP,
- dependencia de una sola instancia de backend y base de datos,
- llamadas externas a reCAPTCHA en rutas de acceso.

## 10. Dependencias externas críticas

| Dependencia | Uso | Riesgo principal | Respuesta recomendada |
|---|---|---|---|
| PostgreSQL | Persistencia total del sistema | indisponibilidad, lentitud, corrupción lógica | backup, monitoreo, tuning, control de migraciones |
| SMTP / proveedor de correo | OTP y primer acceso | caída del proveedor, rechazo de envío, latencia | fallback operativo, métricas, reintentos |
| Google reCAPTCHA | validación antiabuso | indisponibilidad externa, claves inválidas | manejo de error, monitoreo, revisión de configuración |
| Variables de entorno | secretos y parámetros | configuración errónea o incompleta | checklist por ambiente, validación previa de despliegue |
| Dependencias npm/maven | build y ejecución | vulnerabilidades o incompatibilidades | actualización controlada, escaneo de dependencias |

## 11. Recomendaciones prioritarias

### Prioridad inmediata

- eliminar `ddl-auto: update` en entornos controlados,
- parametrizar completamente URLs y CORS,
- revisar exposición del JWT en frontend,
- fortalecer manejo de error para producción,
- asegurar monitoreo de SMTP y reCAPTCHA.

### Prioridad de corto plazo

- automatizar pruebas de servicios críticos,
- mover filtros intensivos al repositorio / base de datos,
- definir retención de auditoría y OTP,
- documentar procedimientos de contingencia.

### Prioridad de mediano plazo

- introducir observabilidad más robusta,
- evaluar asincronía para correo,
- endurecer frontend frente a XSS,
- establecer revisiones de seguridad periódicas.

## 12. Conclusión

TutorLink posee una base tecnológica sólida y apropiada para una aplicación institucional, pero su operación segura y estable depende de controlar varios riesgos característicos de su stack: sesiones JWT en cliente, dependencia de correo y reCAPTCHA, configuración por ambiente y gobernanza del esquema de base de datos.

El registro de riesgos presentado permite priorizar acciones de mitigación sobre los puntos con mayor impacto: seguridad de sesión, resiliencia del acceso, confiabilidad del correo, control de configuración y escalabilidad operativa. La respuesta recomendada no exige rediseñar el sistema de inmediato, pero sí formalizar controles y endurecimientos para reducir exposición técnica y operativa.
