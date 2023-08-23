# mongoCitas

mongoCitas es una aplicación de gestión de usuarios, medicos y citas, construida con Node.js y una base de datos MongoDB. Esta aplicación te permite administrar tus citas de manera eficiente y organizada. A continuación, encontrarás información detallada sobre cómo configurar y ejecutar el proyecto.

## Requerimientos

El proyecto está desarrollado utilizando Node.js y MongoDB, por lo que necesitarás lo siguiente para ejecutarlo:

- Node.js ([https://nodejs.org](https://nodejs.org/)) - Verifica que la versión instalada sea compatible con las dependencias del proyecto. Se recomienda la versión 18.16.0 de Node.js.
- MongoDB Atlas (https://www.mongodb.com/cloud/atlas) - Se requiere una base de datos MongoDB en línea para almacenar la información del proyecto.

## Configuración del archivo .env

Crea un archivo `.env` en la raíz del proyecto, configura las variables de entorno necesarias y la conexión a la base de datos. Un ejemplo de cómo configurar el archivo `.env` se proporciona en el archivo `.env.example`:

```json
MY_SERVER={"hostname":"127.10.10.15", "port":"3001"}

ATLAS_USER="tu_usuario_de_MongoDB_Atlas"
ATLAS_PASSWORD="tu_contraseña_de_MongoDB_Atlas"
ATLAS_DB="nombre_de_tu_base_de_datos_en_Atlas"

# Clave privada para JWT
JWT_PASSWORD="tu_contraseña_de_creación_del_token"
```

## Instalación de Dependencias

Ejecuta el siguiente comando en la terminal para instalar las dependencias necesarias:

```
npm install
```

## Montar el Servidor

Una vez configuradas las variables de entorno, puedes iniciar el servidor con el siguiente comando:

```
npm run dev
```

## Generación del token

Para de interactuar con los endpoints debes primeramente crear un token  a partir del usuario y su rol:

1. **Rol: admin**
   - Acceso:
     - "/medico"
     - "/usuario"
     - "/cita"
     - "/acudiente"
2. **Rol: medico**
   - Acceso:
     - "/usuario"
     - "/cita"
     - "/acudiente"
3. **Rol: usuario**
   - Acceso:
     - "/usuario"

```
GET http://127.10.10.15:3001/token/<rol>
```

Usaremos el usuario que tiene rol admin para poder ingresar a todas las peticiones.

Se generará el siguiente código que se debe agregar al HTTP Header de tipo Authorization:

```json
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTRiODM1NmRmODc3ZmZhYjI3NTUzYiIsImlhdCI6MTY5MjcyNjYwNywiZXhwIjoxNjkyNzMwMjA3fQ.Cj9iA7QH6s3Eweew7Frw0LY09SSRbAYqwTzehheAUWg
```

## Petición

Para de interactuar con los endpoints puedes hacerlo mediante la siguiente petición GET:

```
GET http://127.10.10.15:3001/<nombre_endpoint>
```

## Endpoints Disponibles

### Listar usuarios

Endpoint: `GET /usuario`

Este endpoint te permite listar todos los usuarios registradas en el sistema, ordenadas alfabéticamente. Ejemplos de Datos:

```json
[
  {
    "id": 4,
    "nombre": "Ana",
    "segundo_nombre": "María",
    "primer_apellido": "López",
    "segundo_apellido": "Torres",
    "telefono": "9999999999",
    "direccion": "Calle 123, Ciudad",
    "email": "ana@example.com",
    "tipodoc": "Cédula de Ciudadanía",
    "genero": "Femenino",
    "acudiente": 4
  },
  {
    "id": 3,
    "nombre": "Carlos",
    "primer_apellido": "González",
    "segundo_apellido": "Sánchez",
    "telefono": "5555555555",
    "direccion": "Calle 123, Ciudad",
    "email": "carlos@example.com",
    "tipodoc": "Cédula de Ciudadanía",
    "genero": "Masculino",
    "acudiente": 3
  },
    ...]
```

### Crear Usuario

Endpoint: `POST /usuario`

Crea un nuevo usuario en el sistema. Los datos de entrada deben incluir:

- `NOMBRE`

- `PRIMER_APELLIDO`

- `TELEFONO`

- `DIRECCION`

- `TIPODOC`

- `ACUDIENTE`

  Ejemplos de datos a enviar:

  ```json
  {
      "NOMBRE": "Juan",
      "SEGUNDO_NOMBRE": "david",
      "PRIMER_APELLIDO": "Pérez",
      "SEGUNDO_APELLIDO": "Gómez",
      "TELEFONO": "1234567890",
      "DIRECCION": "Calle 123, Ciudad",
      "EMAIL": "juan@example.com",
      "TIPODOC": "Cédula de Ciudadanía",
      "GENERO": "Masculino",
      "ACUDIENTE": 1
    }
  ```

  Respuesta:

  ```json
  {
    "message": "User added successfully",
    "insertedId": "64e4f69fa4077b1d3f298ca8"
  }
  ```

### Listar Médicos por Especialidad

Endpoint: `GET /medico/:especialidad`

Ejemplos de datos a enviar:

```json
GET http://127.10.10.15:3001/medico/Pediatría
```

Respuesta:

```json
[
  {
    "_id": "64e4a4e5d5eb943f70e349d2",
    "id": 3,
    "nombreCompleto": "Dr. Luis Martínez",
    "consultorio": "Consultorio C",
    "especialidad": "Pediatría"
  }
]
```

### Listar médico y consultorio asignado

Endpoint: `GET /medico/consultorio`

Ejemplos de datos a enviar:

```json
GET http://127.10.10.15:3001/medico/consultorio
```

Respuesta:

```json
[
  {
    "id": 1,
    "nombreCompleto": "Dr. Juan Pérez",
    "consultorio": "Consultorio A"
  },
  {
    "id": 2,
    "nombreCompleto": "Dra. Ana Rodríguez",
    "consultorio": "Consultorio B"
  },
...]
```

### Obtener todas las citas alfabéticamente

**Petición:**

```http
GET http://127.10.10.15:3001/cita
```

**Respuesta:**

```json
[
  {
    "fecha": "2023-07-30T00:00:00.000Z",
    "estado": "Realizada",
    "paciente": "Ana López",
    "medico": "Dra. Laura Gómez"
  },
  {
    "fecha": "2023-07-23T00:00:00.000Z",
    "estado": "Realizada",
    "paciente": "Carlos González",
    "medico": "Dr. Luis Martínez"
  },
  ...
]
```

### Encontrar la próxima cita para un paciente específico

**Petición:**

```http
GET http://127.10.10.15:3001/cita/usuario/1
```

**Respuesta:**

```json
{
  "fecha": "2023-08-05T00:00:00.000Z",
  "estado": "Pendiente",
  "paciente": "María Rodríguez",
  "medico": "Dr. Juan Pérez"
}
```

### Encontrar todos los pacientes que tienen citas con un médico específico

**Petición:**

```http
GET http://127.10.10.15:3001/cita/medico/1
```

**Respuesta:**

```json
[
  {
    "fecha": "2023-08-05T00:00:00.000Z",
    "estado": "Pendiente",
    "paciente": "María Rodríguez"
  },
  {
    "fecha": "2023-08-15T00:00:00.000Z",
    "estado": "Pendiente",
    "paciente": "Javier Pérez"
  },
  ...
]
```

### Encontrar todas las citas para un día específico

**Petición:**

```http
GET http://127.10.10.15:3001/cita/2023-07-30
```

**Respuesta:**

```json
[
  {
    "estado": "Realizada",
    "paciente": "Ana López",
    "medico": "Dra. Laura Gómez"
  },
  ...
]
```

### Contar el número de citas que un médico tiene en un día específico

**Petición:**

```http
GET http://127.10.10.15:3001/cita/2023-07-30/1
```

**Respuesta:**

```json
{
  "medico": "Dr. Juan Pérez",
  "fecha": "2023-07-30",
  "cantidadCitas": 5
}
```

### Obtener todas las citas realizadas por los pacientes de un género si su estado de la cita fue atendida

**Petición:**

```http
GET http://127.10.10.15:3001/cita/atendida/Femenino
```

**Respuesta:**

```json
[
  {
    "fecha": "2023-07-30T00:00:00.000Z",
    "paciente": "Ana López",
    "medico": "Dra. Laura Gómez"
  },
  ...
]
```

### Mostrar todas las citas rechazadas en un mes específico

**Petición:**

```http
GET http://127.10.10.15:3001/cita/rechazada/2023-07
```

**Respuesta:**

```json
[
  {
    "fecha": "2023-07-12T00:00:00.000Z",
    "paciente": "María Rodríguez",
    "medico": "Dr. Juan Pérez"
  },
  ...
]
```

## Dependencias Utilizadas

Este proyecto utiliza diversas dependencias para su funcionamiento. A continuación, se detallan las dependencias principales y sus respectivas versiones:

- **express**: 4.18.2 Express es un marco de aplicación web rápido, minimalista y flexible para Node.js. Es utilizado en este proyecto para manejar las rutas y la lógica de la aplicación.

- **dotenv**: 16.3.1 Dotenv es una librería que permite cargar variables de entorno desde un archivo `.env`. En este proyecto, se utiliza para gestionar las configuraciones sensibles.
- **express-rate-limit**: 6.8.1 Express Rate Limit es un middleware que proporciona limitación de velocidad y control de la frecuencia de las solicitudes HTTP. Se utiliza aquí para prevenir ataques de fuerza bruta y abusos.
- **mongodb**: 5.7.0 MongoDB es una base de datos NoSQL ampliamente utilizada. En este proyecto, se usa para almacenar y recuperar datos relacionados con el alquiler de autos.
- **nodemon**: 3.0.1 Nodemon es una herramienta que ayuda en el desarrollo al reiniciar automáticamente la aplicación cuando se detectan cambios en el código fuente. Esto agiliza el proceso de desarrollo y prueba.
- **jose** (4.14.4): Esta dependencia parece relacionarse con JSON Web Tokens (JWT) y puede estar relacionada con la autenticación y la seguridad en tu aplicación.
- **express-session** (1.17.3): Express Session es una librería que permite gestionar sesiones de usuario en aplicaciones Express.js. Puede ser utilizada para mantener el estado de la sesión del usuario en el servidor.
- **passport** (0.6.0): Passport es un middleware de autenticación para Node.js que proporciona una forma flexible de autenticar las solicitudes. Puede utilizarse para autenticación local, social y basada en tokens, entre otras estrategias.
- **passport-http-bearer** (1.0.1): Esta dependencia parece estar relacionada con la estrategia de autenticación Bearer en Passport. La autenticación Bearer se utiliza a menudo con tokens JWT para autenticar las solicitudes.
- **morgan** (^1.10.0): Morgan es un middleware de registro de solicitudes HTTP para Node.js. Puede utilizarse para registrar detalles sobre las solicitudes entrantes en la aplicación.