# SERVITEC PRO V14 ENTERPRISE

# Blueprint de Base de Datos

Versión: V14.1

---

# Objetivo

Diseñar una base de datos escalable, modular y multiempresa que permita gestionar integralmente los procesos administrativos, técnicos y documentarios de empresas dedicadas al mantenimiento, calibración, equipamiento biomédico y gestión hospitalaria.

La base de datos deberá soportar el crecimiento del sistema durante muchos años sin requerir rediseños estructurales.

---

# Principios de Diseño

* Arquitectura Multiempresa.
* Arquitectura Multisede.
* UUID como clave primaria.
* Auditoría en todas las tablas.
* Relaciones mediante claves foráneas.
* Integridad referencial.
* Escalabilidad.
* Seguridad.
* Alto rendimiento.

---

# Dominios del Sistema

La base de datos se divide en los siguientes dominios funcionales:

1. Empresas
2. Usuarios y Seguridad
3. Clientes
4. Equipos
5. Catálogos
6. Cotizaciones
7. Órdenes de Servicio
8. Ejecución Técnica
9. Informes y Actas
10. Inventario
11. Compras y Proveedores
12. Dashboard e Indicadores

---

# Regla General

Toda tabla que represente información de negocio deberá pertenecer a una empresa mediante el campo:

empresa_id

Esto garantiza el funcionamiento del sistema en modo multiempresa.

---

# Auditoría

Como estándar del proyecto, las tablas incluirán, cuando corresponda:

* created_at
* updated_at
* created_by
* updated_by
* estado

---

# Convenciones

* Nombres de tablas en minúsculas.
* Nombres en plural.
* Campos en snake_case.
* UUID como identificador principal.
* Relaciones mediante claves foráneas.

---

# Estado

Documento en construcción.

Las tablas serán documentadas por dominio antes de su implementación mediante migraciones SQL.
---

# Dominio 1 – Empresas

## Objetivo

Administrar las empresas que utilizarán SERVITEC PRO, sus sedes, configuración, usuarios y parámetros generales.

Este dominio será el núcleo del sistema y permitirá operar en modo multiempresa.

## Tablas

### empresas

Almacena la información general de cada empresa.

Campos principales:

* id
* razon_social
* nombre_comercial
* ruc
* direccion
* telefono
* correo
* pagina_web
* logo_url
* estado

---

### sedes

Permite registrar una o varias sedes por empresa.

Campos principales:

* id
* empresa_id
* nombre
* direccion
* telefono
* responsable
* estado

---

### configuracion_empresa

Contiene la configuración operativa de cada empresa.

Campos principales:

* id
* empresa_id
* moneda
* igv
* serie_cotizacion
* serie_orden
* serie_factura
* serie_informe
* serie_acta

---

### usuarios

Usuarios que acceden al sistema.

Cada usuario pertenece a una empresa.

---

### roles

Define los perfiles del sistema.

Ejemplos:

* Administrador
* Supervisor
* Técnico
* Logística
* Gerencia

---

### permisos

Define las acciones permitidas para cada rol.

Los permisos se asignarán por módulo y por operación.

