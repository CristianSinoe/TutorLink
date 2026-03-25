# EDT / WBS de Entregables de Software - TutorLink

Fecha de elaboración: 2026-03-23

## 1. Propósito del documento

Este documento presenta la EDT/WBS (Estructura de Desglose del Trabajo) de TutorLink orientada a entregables de software. La descomposición se construye a partir de la arquitectura real del proyecto, sus módulos funcionales, componentes frontend, servicios backend y artefactos de soporte.

La EDT se expresa hasta 3 niveles de profundidad y se enfoca en productos entregables, no en actividades detalladas.

## 2. Criterio de descomposición

La estructura se organiza a partir de los principales bloques del sistema:

- plataforma frontend,
- plataforma backend,
- persistencia y modelo de datos,
- seguridad y control de acceso,
- integraciones y comunicaciones,
- documentación y soporte técnico.

## 3. EDT / WBS del proyecto

### 1.0 TutorLink - Sistema de Gestión de Tutorías Académicas

### 1.1 Plataforma Frontend Web

#### 1.1.1 Núcleo de aplicación SPA

- configuración base de Vite
- enrutamiento principal de la aplicación
- gestión de contexto de autenticación
- cliente HTTP compartido con interceptores

#### 1.1.2 Módulo de acceso y autenticación

- pantalla de login
- pantalla de verificación OTP
- pantalla de primer acceso / activación
- componentes visuales de identidad y preloader de acceso

#### 1.1.3 Módulo de experiencia por rol

- layouts protegidos para administrador
- layouts protegidos para estudiante
- layouts protegidos para tutor
- guards de rutas por autenticación y rol

### 1.2 Frontend Administrativo

#### 1.2.1 Gestión de usuarios

- vista general de usuarios
- vista de administración de estudiantes
- vista de administración de tutores
- vista de administración de administradores

#### 1.2.2 Gestión académica

- vista de asignaciones tutor-estudiante
- formularios y componentes de alta/edición
- modal de creación de administradores
- página de perfil administrativo

#### 1.2.3 Soporte de operación administrativa

- consumo de endpoints de importación CSV
- consumo de endpoints de cambio de estado
- consumo de endpoints de sugerencias y asignaciones
- manejo de navegación interna del módulo admin

### 1.3 Frontend del Estudiante

#### 1.3.1 Espacio principal del estudiante

- dashboard del estudiante
- página de información del estudiante
- navegación protegida del módulo estudiante

#### 1.3.2 Gestión de preguntas académicas

- formulario de nueva pregunta
- vista de listado de preguntas
- visualización de detalle e historial de respuestas
- consumo de servicios del tutor asignado

#### 1.3.3 Integración de sesión y experiencia

- lectura de perfil autenticado
- persistencia local de sesión
- control de errores de acceso
- redirección automática por expiración de sesión

### 1.4 Frontend del Tutor

#### 1.4.1 Espacio principal del tutor

- dashboard del tutor
- vista de preguntas pendientes
- vista de historial de preguntas atendidas

#### 1.4.2 Gestión operativa de atención

- formularios de respuesta
- formularios de corrección
- formularios de rechazo y reclasificación
- visualización de historial de respuestas

#### 1.4.3 Gestión de perfil del tutor

- vista de perfil profesional/académico
- edición de biografía y enlaces
- edición de preferencias de notificación
- integración con endpoints de perfil

### 1.5 Plataforma Backend API

#### 1.5.1 Capa web / controladores REST

- controladores de autenticación
- controlador de administración de usuarios
- controlador de estudiante
- controlador de tutor

#### 1.5.2 Capa de servicios de negocio

- servicio de autenticación y JWT
- servicio de gestión administrativa de usuarios
- servicio de preguntas y respuestas
- servicio de usuarios, estudiantes y tutores

#### 1.5.3 Capa de contratos y transformación

- DTOs de autenticación
- DTOs administrativos
- DTOs de preguntas y dashboards
- mapeadores y respuestas paginadas

### 1.6 Backend de Seguridad y Acceso

#### 1.6.1 Seguridad de aplicación

- configuración de Spring Security
- filtro JWT de autenticación
- codificación y verificación de contraseñas
- política de autorización por roles

#### 1.6.2 Gestión de autenticación reforzada

- generación de tokens JWT
- generación y validación de OTP
- validación de primer acceso
- cambio de contraseña con OTP

#### 1.6.3 Seguridad operativa y validación pública

- validación reCAPTCHA
- endpoint de verificación pública
- endpoint de salud
- manejo global de errores de acceso

### 1.7 Backend de Gestión Académica

#### 1.7.1 Gestión de usuarios y perfiles

- creación y actualización de estudiantes
- creación y actualización de tutores
- creación de administradores
- consulta de perfil autenticado

#### 1.7.2 Gestión de asignaciones

- asignación tutor-estudiante
- importación masiva de asignaciones
- consulta y eliminación de asignaciones
- sugerencia de estudiantes no asignados

#### 1.7.3 Gestión de preguntas y respuestas

- creación de preguntas por estudiante
- publicación y corrección de respuestas
- rechazo y reclasificación de preguntas
- consultas de historial, pendientes y resumen operativo

### 1.8 Persistencia y Modelo de Datos

#### 1.8.1 Modelo de dominio

- entidades de usuarios y roles
- entidades de estudiante, tutor y asignación
- entidades de pregunta y respuesta
- entidades de OTP y auditoría

#### 1.8.2 Acceso a datos

- repositorios JPA de usuarios
- repositorios JPA de tutorías y asignaciones
- repositorios JPA de preguntas y respuestas
- repositorios JPA de OTP y auditoría

#### 1.8.3 Evolución de base de datos

- migraciones Flyway iniciales
- migraciones de normalización de usuarios
- migraciones de preguntas y respuestas
- migraciones de perfil tutor y primer acceso

### 1.9 Integraciones y Comunicaciones

#### 1.9.1 Integración de correo

- servicio de envío de correos
- plantillas HTML para primer acceso
- plantillas HTML para OTP de cambio de contraseña
- previsualización de correos en entorno de desarrollo

#### 1.9.2 Integración de validación externa

- integración con reCAPTCHA
- lectura de claves por configuración
- validación de riesgo en registro y login
- validación de riesgo en creación de preguntas

#### 1.9.3 Integración de configuración operativa

- variables de entorno del backend
- configuración de base de datos
- configuración de CORS y URLs base
- logging a archivo

### 1.10 Calidad, Soporte y Documentación

#### 1.10.1 Soporte técnico del software

- manejo global de excepciones
- utilidades de validación
- utilidades de fechas y formato
- pruebas base de arranque del backend

#### 1.10.2 Documentación del proyecto

- resumen ejecutivo de arquitectura técnica
- acta de constitución y business case
- requisitos del software y SRS
- EDT/WBS de entregables

#### 1.10.3 Artefactos de despliegue y mantenimiento

- `Dockerfile` del backend
- archivo de configuración de aplicación
- scripts de construcción del frontend
- estructura de logs y soporte operativo

## 4. Resumen ejecutivo de la EDT

La EDT presentada muestra a TutorLink como un producto de software compuesto por entregables bien diferenciados entre frontend, backend, datos, seguridad, integraciones y documentación. La mayor densidad funcional se concentra en:

- autenticación y control de acceso,
- gestión administrativa de usuarios,
- asignación tutor-estudiante,
- ciclo de vida de preguntas y respuestas.

Desde una perspectiva de gestión de proyecto, esta WBS permite:

- planificar paquetes de trabajo por módulo,
- asignar responsables por dominio funcional,
- controlar avance por entregable,
- estimar esfuerzo técnico con mejor trazabilidad.

## 5. Observación de uso

Si esta EDT se utiliza en planeación formal del proyecto, el siguiente paso recomendable es convertir cada entregable de nivel 3 en:

- paquete de trabajo,
- responsable,
- criterio de aceptación,
- estimación de esfuerzo,
- dependencia técnica.
