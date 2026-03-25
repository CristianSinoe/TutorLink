# Manual de Usuario e Informe Final del Proyecto - TutorLink

Fecha de elaboración: 2026-03-24

## Parte I. Manual de Usuario

## 1. Propósito del manual

Este manual describe, paso a paso, el uso de los flujos principales de TutorLink, tomando como base las rutas y vistas implementadas actualmente en el frontend del sistema.

La guía se organiza por perfil de usuario:

- administrador,
- estudiante,
- tutor.

## 2. Requisitos previos de uso

Antes de utilizar la plataforma, el usuario debe contar con:

- un navegador web moderno,
- acceso a internet o a la red institucional donde se encuentre desplegado TutorLink,
- credenciales institucionales válidas,
- acceso a su correo institucional para recibir códigos OTP o enlaces de primer acceso.

## 3. Acceso al sistema

### 3.1 Inicio de sesión

Ruta principal:

- `/login`

Pasos:

1. Ingresar al sistema mediante la pantalla de inicio de sesión.
2. Escribir el correo institucional en el campo correspondiente.
3. Escribir la contraseña en el campo de acceso.
4. Confirmar el reCAPTCHA.
5. Presionar el botón `Inicia sesión en TutorLink`.

Resultado esperado:

- si las credenciales son válidas, el sistema solicitará verificación OTP;
- si existe un error, se mostrará un mensaje explicativo.

### 3.2 Verificación en dos pasos

Ruta:

- `/otp`

Pasos:

1. Revisar el correo institucional para localizar el código de 6 dígitos.
2. Escribir el código en el campo `Código de verificación`.
3. Presionar `Confirmar código`.

Resultado esperado:

- el sistema validará el OTP,
- si es correcto, redirigirá automáticamente al panel correspondiente según el rol.

### 3.3 Primer acceso / activación de cuenta

Ruta:

- `/first-login`

Este flujo se utiliza cuando la cuenta fue creada por un administrador.

Pasos:

1. Abrir el enlace recibido por correo.
2. Verificar que el sistema cargue el token en la página de activación.
3. Escribir una nueva contraseña.
4. Confirmar la nueva contraseña.
5. Presionar `Definir contraseña`.

Resultado esperado:

- la contraseña queda registrada,
- el sistema informa que ya es posible iniciar sesión.

## 4. Manual para Administrador

Rutas principales:

- `/admin`
- `/admin/students`
- `/admin/tutors`
- `/admin/assignments`
- `/admin/users`
- `/admin/admins`
- `/admin/profile`

### 4.1 Acceso al panel administrativo

Después de iniciar sesión con rol `ADMIN`, el sistema redirige al panel administrativo.

Desde el menú lateral o superior, el administrador puede acceder a:

- Dashboard
- Estudiantes
- Tutores
- Asignaciones
- Usuarios
- Administradores
- Mi perfil

### 4.2 Consultar el dashboard administrativo

Ruta:

- `/admin`

Funciones disponibles:

- visualizar usuarios totales,
- consultar usuarios activos y bloqueados,
- ver cantidad de estudiantes,
- ver cantidad de tutores,
- ver total de asignaciones,
- consultar accesos rápidos a módulos clave,
- revisar asignaciones recientes.

Pasos:

1. Entrar al dashboard.
2. Revisar las tarjetas de resumen.
3. Presionar `Actualizar datos` si se desea refrescar la información.
4. Usar los accesos rápidos para entrar al módulo requerido.

### 4.3 Gestionar estudiantes

Ruta:

- `/admin/students`

Funciones disponibles:

- listar estudiantes,
- buscar por criterios visibles en la tabla,
- filtrar por estado,
- crear estudiante,
- importar estudiantes por CSV,
- consultar detalle,
- editar datos.

#### Crear un estudiante

Pasos:

1. Entrar al módulo `Estudiantes`.
2. Abrir el formulario de creación.
3. Capturar nombre, apellidos, correo, contraseña inicial, matrícula, carrera, plan, semestre, teléfono y fecha de nacimiento.
4. Guardar el registro.

Resultado esperado:

- el estudiante queda registrado,
- el sistema prepara su activación mediante correo de primer acceso.

#### Importar estudiantes por CSV

Pasos:

1. Abrir la opción de importación.
2. Seleccionar el archivo CSV.
3. Confirmar la carga.
4. Revisar el resultado de creados y omitidos.

#### Editar un estudiante

Pasos:

1. Localizar el estudiante en el listado.
2. Abrir la acción de edición.
3. Modificar los campos necesarios.
4. Guardar cambios.

### 4.4 Gestionar tutores

Ruta:

- `/admin/tutors`

Funciones disponibles:

- listar tutores,
- crear tutor,
- importar tutores por CSV,
- editar tutor,
- revisar datos del tutor.

#### Crear un tutor

Pasos:

1. Entrar al módulo `Tutores`.
2. Abrir el formulario de creación.
3. Capturar nombre, apellidos, correo, contraseña inicial, código de tutor, departamento, especialidad y teléfono.
4. Guardar el registro.

Resultado esperado:

- el tutor queda registrado,
- el sistema envía el correo de primer acceso.

### 4.5 Gestionar asignaciones tutor-estudiante

Ruta:

- `/admin/assignments`

Funciones disponibles:

- listar asignaciones agrupadas por tutor,
- buscar tutor por nombre, correo o código,
- abrir detalle de cada tutor,
- asignar estudiante mediante matrícula,
- usar sugerencias/autocompletado,
- eliminar asignaciones,
- importar asignaciones por CSV.

#### Asignar un estudiante a un tutor

Pasos:

1. Abrir `Asignaciones`.
2. Localizar el tutor deseado.
3. Abrir el detalle del tutor.
4. Escribir la matrícula del estudiante o seleccionar una sugerencia.
5. Confirmar la asignación.

Resultado esperado:

- el estudiante queda vinculado al tutor seleccionado,
- si ya tenía tutor, la asignación previa se reemplaza.

#### Importar asignaciones por CSV

Pasos:

1. Abrir la opción de importación.
2. Seleccionar el archivo CSV.
3. Confirmar la carga.
4. Revisar el resultado de asignaciones creadas y errores.

### 4.6 Gestionar usuarios y estados

Ruta:

- `/admin/users`

Funciones esperadas según navegación actual:

- consultar cuentas del sistema,
- revisar su estado,
- identificar cuentas activas, bloqueadas o deshabilitadas,
- aplicar cambios de estado cuando la interfaz lo permita.

### 4.7 Gestionar administradores

Ruta:

- `/admin/admins`

Funciones disponibles:

- listar administradores existentes,
- crear nuevos administradores.

Pasos:

1. Entrar al módulo `Administradores`.
2. Abrir el formulario de creación.
3. Capturar datos del nuevo administrador.
4. Guardar el registro.

Resultado esperado:

- el sistema crea la cuenta,
- se envía el enlace de primer acceso.

### 4.8 Consultar perfil administrativo

Ruta:

- `/admin/profile`

Uso:

- revisar información del administrador autenticado,
- consultar datos visibles del perfil actual.

### 4.9 Cerrar sesión como administrador

Pasos:

1. Localizar el botón `Cerrar sesión`.
2. Presionarlo.

Resultado esperado:

- la sesión se elimina,
- el sistema redirige a `/login`.

## 5. Manual para Estudiante

Rutas principales:

- `/student`
- `/student/ask`
- `/student/questions`
- `/student/info`

### 5.1 Acceso al panel del estudiante

Después del login exitoso, el sistema redirige a `/student`.

Desde la navegación del módulo, el estudiante puede acceder a:

- Dashboard
- Hacer pregunta
- Mis preguntas
- Mi información

### 5.2 Consultar el dashboard del estudiante

Ruta:

- `/student`

Información disponible:

- total de preguntas enviadas,
- total de preguntas respondidas,
- total de preguntas pendientes,
- últimas respuestas registradas,
- atajos hacia nueva pregunta y listado.

Pasos:

1. Entrar al dashboard.
2. Revisar tarjetas de resumen.
3. Usar los botones de acceso rápido según la necesidad.

### 5.3 Enviar una nueva pregunta

Ruta:

- `/student/ask`

Pasos:

1. Entrar a `Hacer pregunta`.
2. Escribir el título o asunto.
3. Seleccionar el alcance de la pregunta.
4. Escribir una descripción clara y completa.
5. Presionar `Enviar pregunta`.

Resultado esperado:

- la pregunta se registra,
- el sistema redirige al listado de preguntas.

Observación:

- el formulario muestra los alcances disponibles como `General`, `Programa educativo`, `Plan de estudios`, `Semestre` y `Académico`.

### 5.4 Consultar mis preguntas

Ruta:

- `/student/questions`

Funciones disponibles:

- listar preguntas propias,
- filtrar por texto,
- filtrar por estado,
- filtrar por alcance,
- abrir detalle de cada pregunta.

Pasos:

1. Entrar a `Mis preguntas`.
2. Usar filtros si se requiere.
3. Presionar `Ver detalle` en la pregunta deseada.

Resultado esperado:

- se abrirá un modal o vista de detalle con información ampliada de la pregunta.

### 5.5 Revisar el detalle de una pregunta

Desde el detalle se espera revisar:

- título,
- descripción,
- estado,
- alcance,
- información de respuesta,
- historial si aplica.

Esto permite al estudiante saber si su pregunta:

- está pendiente,
- fue respondida,
- fue corregida,
- fue rechazada.

### 5.6 Consultar información personal y académica

Ruta:

- `/student/info`

Información disponible:

- nombre completo,
- correo institucional,
- matrícula,
- carrera,
- plan de estudios,
- semestre,
- teléfono,
- fecha de nacimiento,
- estado de cuenta.

### 5.7 Cambiar contraseña como estudiante

Desde `Mi información`, el estudiante puede abrir el modal de cambio de contraseña.

Pasos:

1. Entrar a `Mi información`.
2. Presionar `Cambiar contraseña`.
3. Seguir el flujo indicado por el modal.
4. Confirmar el código recibido por correo si el flujo lo solicita.

### 5.8 Cerrar sesión como estudiante

Pasos:

1. Presionar `Cerrar sesión` desde la navegación o la cabecera.

Resultado esperado:

- el sistema cierra la sesión y vuelve a `/login`.

## 6. Manual para Tutor

Rutas principales:

- `/tutor`
- `/tutor/pending`
- `/tutor/history`
- `/tutor/profile`

### 6.1 Acceso al panel del tutor

Después del login, el usuario con rol `TUTOR` es dirigido a su panel principal.

Desde el menú del tutor se puede acceder a:

- Dashboard
- Preguntas pendientes
- Historial de respuestas
- Mi perfil

### 6.2 Consultar el dashboard del tutor

Ruta:

- `/tutor`

Información disponible:

- preguntas pendientes,
- preguntas respondidas hoy,
- total de respuestas,
- preguntas recientes asignadas,
- accesos rápidos a pendientes e historial.

Pasos:

1. Entrar al dashboard del tutor.
2. Revisar las tarjetas resumen.
3. Consultar la tabla de preguntas recientes.
4. Usar los botones de acceso rápido cuando sea necesario.

### 6.3 Gestionar preguntas pendientes

Ruta:

- `/tutor/pending`

Funciones disponibles:

- buscar preguntas por texto,
- filtrar por alcance,
- abrir detalle,
- responder,
- corregir como publicación corregida,
- rechazar,
- reclasificar el alcance.

#### Responder una pregunta

Pasos:

1. Entrar a `Preguntas pendientes`.
2. Aplicar filtros si es necesario.
3. Abrir el detalle de la pregunta.
4. Elegir la acción `Publicar respuesta (aprobar)`.
5. Escribir la respuesta.
6. Guardar la acción.

Resultado esperado:

- la pregunta deja de estar pendiente,
- la respuesta queda registrada.

#### Corregir una respuesta

Pasos:

1. Abrir la pregunta.
2. Seleccionar la acción `Publicar como corregida`.
3. Escribir la nueva respuesta o corrección.
4. Guardar.

Resultado esperado:

- el sistema registra una versión corregida.

#### Rechazar una pregunta

Pasos:

1. Abrir la pregunta.
2. Seleccionar `Rechazar pregunta`.
3. Escribir el motivo de rechazo.
4. Confirmar.

Resultado esperado:

- la pregunta queda marcada como rechazada.

#### Reclasificar una pregunta

Pasos:

1. Abrir el detalle.
2. Seleccionar un nuevo alcance si corresponde.
3. Guardar la acción.

Resultado esperado:

- la pregunta cambia de alcance dentro del sistema.

### 6.4 Consultar historial de respuestas

Ruta:

- `/tutor/history`

Funciones disponibles:

- buscar preguntas respondidas,
- filtrar por alcance,
- filtrar por estado,
- consultar historial de respuestas por pregunta,
- realizar correcciones desde el historial cuando la interfaz lo habilite.

Pasos:

1. Entrar a `Historial de respuestas`.
2. Aplicar filtros deseados.
3. Seleccionar una pregunta para revisar historial.
4. Si se requiere, abrir el modal de corrección y guardar cambios.

### 6.5 Gestionar perfil del tutor

Ruta:

- `/tutor/profile`

Funciones disponibles:

- consultar datos básicos,
- editar biografía,
- agregar enlace académico,
- agregar enlace profesional,
- activar o desactivar preferencias de notificación,
- cambiar contraseña.

#### Actualizar perfil

Pasos:

1. Entrar a `Mi perfil`.
2. Revisar la sección `Información básica`.
3. Editar la bio y enlaces.
4. Marcar o desmarcar preferencias.
5. Presionar `Guardar cambios`.

### 6.6 Cambiar contraseña como tutor

Pasos:

1. Entrar a `Mi perfil`.
2. Presionar `Cambiar contraseña`.
3. Completar el flujo indicado por el modal.

### 6.7 Cerrar sesión como tutor

Pasos:

1. Presionar `Cerrar sesión`.

Resultado esperado:

- la sesión finaliza y el sistema regresa a `/login`.

## 7. Recomendaciones de uso

- Utilizar siempre el correo institucional correcto.
- Revisar la bandeja de entrada y spam para localizar OTP o enlaces de acceso.
- Cerrar sesión al terminar de usar la plataforma.
- Mantener actualizada la información académica y de perfil cuando corresponda.
- En el caso del estudiante, redactar preguntas claras y completas.
- En el caso del tutor, usar la reclasificación solo cuando el alcance original no sea adecuado.

## Parte II. Informe Final del Proyecto

## 8. Propósito del informe final

El presente informe final resume los módulos completados del proyecto TutorLink con base en la implementación actualmente disponible en el repositorio, especialmente en el backend Spring Boot y el frontend React.

## 9. Objetivo general del proyecto

Desarrollar una plataforma web de tutorías académicas que permita administrar usuarios institucionales, asignar estudiantes a tutores, canalizar preguntas académicas y dar seguimiento a las interacciones de forma segura, organizada y trazable.

## 10. Módulos completados

### 10.1 Módulo de autenticación y acceso

Estado:

- completado funcionalmente

Capacidades implementadas:

- login con correo y contraseña,
- validación reCAPTCHA,
- segundo factor mediante OTP,
- primer acceso para cuentas creadas por administración,
- cambio de contraseña con flujo de verificación,
- cierre de sesión y control de rutas protegidas.

### 10.2 Módulo de administración de usuarios

Estado:

- completado funcionalmente

Capacidades implementadas:

- alta de estudiantes,
- alta de tutores,
- alta de administradores,
- edición de perfiles de estudiantes y tutores,
- listado general de usuarios,
- visualización de estados,
- flujo de primer acceso por correo.

### 10.3 Módulo de importación masiva

Estado:

- completado funcionalmente

Capacidades implementadas:

- importación CSV de estudiantes,
- importación CSV de tutores,
- importación CSV de asignaciones tutor-estudiante.

### 10.4 Módulo de asignaciones académicas

Estado:

- completado funcionalmente

Capacidades implementadas:

- asignación de estudiante a tutor,
- reemplazo de asignación previa si existe,
- listado agrupado de asignaciones,
- búsqueda por tutor,
- sugerencias de estudiantes no asignados,
- eliminación de asignaciones.

### 10.5 Módulo del estudiante

Estado:

- completado funcionalmente

Capacidades implementadas:

- dashboard del estudiante,
- registro de nuevas preguntas,
- consulta de preguntas propias,
- consulta de detalle e historial,
- consulta de datos personales y académicos,
- cambio de contraseña desde su perfil.

### 10.6 Módulo del tutor

Estado:

- completado funcionalmente

Capacidades implementadas:

- dashboard del tutor,
- consulta de preguntas pendientes,
- respuesta a preguntas,
- corrección de respuestas,
- rechazo de preguntas,
- reclasificación de preguntas,
- historial de respuestas,
- edición de perfil y preferencias,
- cambio de contraseña.

### 10.7 Módulo de seguridad

Estado:

- completado funcionalmente

Capacidades implementadas:

- JWT para autenticación stateless,
- control de acceso por rol,
- OTP para login,
- reCAPTCHA en flujos críticos,
- filtro de seguridad en backend,
- guards de rutas en frontend.

### 10.8 Módulo de persistencia y modelo de datos

Estado:

- completado funcionalmente

Capacidades implementadas:

- persistencia de usuarios,
- perfiles de estudiante y tutor,
- asignaciones tutor-estudiante,
- preguntas y respuestas versionadas,
- OTP,
- auditoría,
- migraciones de base de datos con Flyway.

### 10.9 Módulo de correo y comunicación

Estado:

- completado funcionalmente

Capacidades implementadas:

- correo de primer acceso,
- correo de OTP para cambio de contraseña,
- plantillas HTML de correo,
- integración con `JavaMailSender`.

### 10.10 Módulo de auditoría y trazabilidad

Estado:

- completado funcionalmente

Capacidades implementadas:

- registro de eventos de autenticación,
- registro de operaciones críticas,
- almacenamiento de IP, ruta, método y resultado,
- apoyo a trazabilidad operativa.

## 11. Resultado global del proyecto

TutorLink cuenta con una solución funcional que cubre los procesos principales del dominio de tutorías académicas:

- acceso seguro,
- administración de cuentas,
- asignaciones académicas,
- interacción entre estudiante y tutor,
- seguimiento del estado de las preguntas,
- trazabilidad básica de seguridad y operación.

La implementación actual muestra una integración consistente entre frontend, backend y base de datos, con separación clara por roles y módulos.

## 12. Logros principales

- Se implementó una plataforma con control de acceso por rol.
- Se formalizó el proceso de onboarding mediante primer acceso.
- Se incorporó MFA por OTP para reforzar autenticación.
- Se habilitó la gestión administrativa de estudiantes, tutores y administradores.
- Se implementó el ciclo completo de preguntas y respuestas académicas.
- Se añadió trazabilidad mediante auditoría.
- Se dejó una base documental amplia para arquitectura, requisitos, pruebas y riesgos.

## 13. Limitaciones actuales observables

Con base en la implementación actual, aún pueden observarse oportunidades de mejora:

- dependencia de correo para flujos críticos,
- configuración con IPs y URLs de red local,
- oportunidad de homogeneizar algunas validaciones entre frontend y backend,
- necesidad de ampliar pruebas automatizadas,
- margen de mejora en endurecimiento de seguridad del frontend.

## 14. Conclusión final

El proyecto TutorLink puede considerarse funcionalmente completado en sus módulos principales para una primera versión operativa del sistema. La solución implementa los procesos esenciales de una plataforma de tutorías académicas institucionales y proporciona una base sólida para evolución futura.

Desde una perspectiva de cierre de proyecto, los módulos de autenticación, administración, asignaciones, estudiante, tutor, seguridad, persistencia, correo y auditoría se encuentran desarrollados e integrados. El siguiente paso natural sería profundizar en estabilización, pruebas automatizadas, endurecimiento de seguridad y preparación para despliegue controlado en producción.
