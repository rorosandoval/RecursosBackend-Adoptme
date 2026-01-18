# AdoptMe - Documentación de API

**Proyecto Final - Backend III**

Proyecto con carácter académico. Este documento describe todos los endpoints disponibles, los esquemas de entrada/salida, la estructura del proyecto, y las instrucciones para ejecutar con Docker.

---

## Resumen de Entrega Final

Esta entrega incluye la implementación completa de los requisitos solicitados:

### ✅ Documentación en Swagger
- **Módulo Users completamente documentado** en OpenAPI 3.0
- Accesible en: `http://localhost:8080/api/docs`
- Incluye esquemas, ejemplos y validaciones

### ✅ Tests Funcionales
- **Tests completos para todos los endpoints de adoption.router.js**
- Cobertura de casos de éxito y errores
- Ejecutar con: `npm test`
- Herramientas: Mocha, Supertest, Chai

### ✅ Dockerfile
- Imagen Docker optimizada basada en Node 18-Alpine
- Configuración de puertos, volúmenes y variables de entorno
- `.dockerignore` para optimizar el tamaño de la imagen

### ✅ Imagen en Dockerhub
- **Imagen disponible en:** [https://hub.docker.com/r/rodrigosv89/adoptme-entrega-final](https://hub.docker.com/r/rodrigosv89/adoptme-entrega-final)
- Comando para descargar: `docker pull rodrigosv89/adoptme-entrega-final:latest`

---

**URL Base:** `http://localhost:8080`  
**Documentación Swagger:** `http://localhost:8080/api/docs`  
**Dockerhub:** [rodrigosv89/adoptme-entrega-final](https://hub.docker.com/r/rodrigosv89/adoptme-entrega-final)

---

## Índice

1. [Instalación y Ejecución](#instalación-y-ejecución)
2. [Docker](#docker)
3. [Endpoints](#endpoints)
4. [Tests](#tests)
5. [Swagger Documentation](#swagger-documentation)
6. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Instalación y Ejecución

### Requisitos previos
- Node.js v18+
- MongoDB
- npm o yarn

### Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/rorosandoval/RecursosBackend-Adoptme.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Asegúrate de que MONGO_URL apunta a tu instancia de MongoDB
# MONGO_URL=mongodb://localhost:27017/adoptmedb
# PORT=8080
# MOCK_USER_PASSWORD=coder123
# JWT_SECRET=tuclaveSecretaAqui

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

La aplicación estará disponible en `http://localhost:8080`

---

## Docker

### Construcción de la imagen Docker

```bash
# Construir la imagen
docker build -t adoptme-api:latest .

# Etiquetar para Dockerhub
docker tag adoptme-api:latest tuusuario/adoptme-api:latest
```

### Ejecución con Docker

#### Opción 1: Con docker run

```bash
docker pull rodrigosv89/adoptme-entrega-final:latest

docker run -d \
  --name adoptme-api \
  -p 8080:8080 \
  -e MONGO_URL="tu_url_de_mongo_atlas" \
  rodrigosv89/adoptme-entrega-final:latest
```

#### Opción 2: Con docker-compose

Crear un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: adoptme-db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: adoptmedb

  api:
    build: .
    container_name: adoptme-api
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    environment:
      MONGO_URL: mongodb://mongodb:27017/adoptmedb
      PORT: 8080
      MOCK_USER_PASSWORD: coder123
      JWT_SECRET: tuclaveSecretaAqui
    restart: unless-stopped

volumes:
  mongodb_data:
```

Ejecutar:
```bash
docker-compose up -d
```

### Imagen en Dockerhub

La imagen está disponible en Dockerhub:

```
docker pull rodrigosv89/adoptme-entrega-final:latest
```

**Enlace directo:** https://hub.docker.com/r/rodrigosv89/adoptme-entrega-final

Para ejecutar la imagen desde Dockerhub:

```bash
docker run -d \
  --name adoptme \
  -p 8080:8080 \
  -e MONGO_URL="tu_url_de_mongo_atlas" \
  -e PORT=8080 \
  rodrigosv89/adoptme-entrega-final:latest
```

---

## Endpoints

### Pets

#### GET /api/pets/
Obtener todas las mascotas.

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/pets/"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Fido",
      "specie": "Perro",
      "birthDate": "2021-01-15",
      "adopted": false,
      "owner": null,
      "image": "https://ejemplo.com/imagen.jpg",
      "__v": 0
    }
  ]
}
```

---

#### POST /api/pets/
Crear una nueva mascota (JSON).

**Esquema de entrada:**
```json
{
  "name": "string (requerido)",
  "specie": "string - Perro | Gato | Conejo | Hamster | Ave | Pez (requerido)",
  "birthDate": "date - YYYY-MM-DD (requerido)"
}
```

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/pets/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fido",
    "specie": "Perro",
    "birthDate": "2021-01-15"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fido",
    "specie": "Perro",
    "birthDate": "2021-01-15T00:00:00.000Z",
    "adopted": false,
    "owner": null,
    "image": "",
    "__v": 0
  }
}
```

**Respuesta de error (400) - Valores incompletos:**
```json
{
  "status": "error",
  "error": "Valores incompletos"
}
```

---

#### POST /api/pets/withimage
Crear mascota con subida de imagen (multipart/form-data).

**Esquema de entrada:**
```
name: string (requerido)
specie: string - Perro | Gato | Conejo | Hamster | Ave | Pez (requerido)
birthDate: date - YYYY-MM-DD (requerido)
image: file (requerido)
```

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/pets/withimage" \
  -F "image=@/ruta/local/imagen.jpg" \
  -F "name=Fido" \
  -F "specie=Perro" \
  -F "birthDate=2021-01-15"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fido",
    "specie": "Perro",
    "birthDate": "2021-01-15T00:00:00.000Z",
    "adopted": false,
    "owner": null,
    "image": "/ruta/a/public/img/nombrearchivo.jpg",
    "__v": 0
  }
}
```

---

#### PUT /api/pets/:pid
Actualizar una mascota identificada por su ID.

**Parámetro:** `:pid` = ID de la mascota (MongoDB ObjectId)

**Campos actualizables:**
```json
{
  "name": "string (opcional)",
  "specie": "string (opcional)",
  "birthDate": "date (opcional)",
  "image": "string (opcional)",
  "adopted": "boolean (opcional)"
}
```

**Ejemplo de petición:**
```bash
curl -X PUT "http://localhost:8080/api/pets/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fido Actualizado",
    "adopted": true
  }'
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Mascota actualizada"
}
```

---

#### DELETE /api/pets/:pid
Eliminar una mascota identificada por su ID.

**Parámetro:** `:pid` = ID de la mascota

**Ejemplo de petición:**
```bash
curl -X DELETE "http://localhost:8080/api/pets/507f1f77bcf86cd799439011"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Mascota eliminada"
}
```

---

### Adoptions

#### GET /api/adoptions/
Obtener todas las adopciones.

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/adoptions/"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "owner": "507f1f77bcf86cd799439001",
      "pet": "507f1f77bcf86cd799439011",
      "__v": 0
    }
  ]
}
```

---

#### GET /api/adoptions/:aid
Obtener una adopción por su ID.

**Parámetro:** `:aid` = ID de la adopción

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/adoptions/507f1f77bcf86cd799439012"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439012",
    "owner": {
      "_id": "507f1f77bcf86cd799439001",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com"
    },
    "pet": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Fido",
      "specie": "Perro"
    },
    "__v": 0
  }
}
```

---

#### POST /api/adoptions/:uid/:pid
Crear una adopción asociando un usuario y una mascota.

**Parámetros:**
- `:uid` = ID del usuario (MongoDB ObjectId)
- `:pid` = ID de la mascota (MongoDB ObjectId)

**Esquema de respuesta:**
```json
{
  "owner": "ObjectId del usuario",
  "pet": "ObjectId de la mascota"
}
```

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/adoptions/507f1f77bcf86cd799439001/507f1f77bcf86cd799439011"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439012",
    "owner": "507f1f77bcf86cd799439001",
    "pet": "507f1f77bcf86cd799439011",
    "__v": 0
  }
}
```

---

### Users

#### GET /api/users/
Obtener todos los usuarios.

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/users/"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "507f1f77bcf86cd799439001",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "pets": [],
      "__v": 0
    }
  ]
}
```

---

#### GET /api/users/:uid
Obtener un usuario por su ID.

**Parámetro:** `:uid` = ID del usuario

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/users/507f1f77bcf86cd799439001"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "role": "user",
    "pets": [],
    "__v": 0
  }
}
```

---

#### PUT /api/users/:uid
Actualizar un usuario identificado por su ID.

**Parámetro:** `:uid` = ID del usuario

**Campos actualizables:**
```json
{
  "first_name": "string (opcional)",
  "last_name": "string (opcional)",
  "email": "string (opcional)",
  "role": "string (opcional) - user | admin"
}
```

**Ejemplo de petición:**
```bash
curl -X PUT "http://localhost:8080/api/users/507f1f77bcf86cd799439001" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juannuevo@example.com"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Usuario actualizado"
}
```

---

#### DELETE /api/users/:uid
Eliminar un usuario identificado por su ID.

**Parámetro:** `:uid` = ID del usuario

**Ejemplo de petición:**
```bash
curl -X DELETE "http://localhost:8080/api/users/507f1f77bcf86cd799439001"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Usuario eliminado"
}
```

---

### Sessions (Autenticación)

#### POST /api/sessions/register
Registrar un nuevo usuario.

**Esquema de entrada:**
```json
{
  "first_name": "string (requerido)",
  "last_name": "string (requerido)",
  "email": "string (requerido, único)",
  "password": "string (requerido)"
}
```

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/sessions/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "password": "micontraseña123"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "role": "user",
    "pets": [],
    "__v": 0
  }
}
```

**Respuesta de error (400) - Email duplicado:**
```json
{
  "status": "error",
  "error": "El email ya está registrado"
}
```

---

#### POST /api/sessions/login
Login de usuario (obtener sesión/token).

**Esquema de entrada:**
```json
{
  "email": "string (requerido)",
  "password": "string (requerido)"
}
```

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/sessions/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "micontraseña123"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

**Respuesta de error (401) - Credenciales inválidas:**
```json
{
  "status": "error",
  "error": "Credenciales inválidas"
}
```

---

#### GET /api/sessions/current
Obtener información del usuario actual (endpoint protegido según implementación).

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/sessions/current" \
  -H "Authorization: Bearer {TOKEN}"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

---

#### GET /api/sessions/unprotectedLogin
Versión no protegida de login (uso académico/pruebas).

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/sessions/unprotectedLogin"
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Login endpoint sin protección"
}
```

---

#### GET /api/sessions/unprotectedCurrent
Versión no protegida de obtener usuario actual (uso académico/pruebas).

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/sessions/unprotectedCurrent"
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "_id": "507f1f77bcf86cd799439001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com"
  }
}
```

---

### Mocks / Generación de datos de prueba

#### GET /api/mocks/mockingpets
Obtener datos mock de mascotas.

**Especies disponibles:** Perro, Gato, Conejo, Hamster, Ave, Pez

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/mocks/mockingpets"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "name": "Buddy",
      "specie": "Perro",
      "birthDate": "2022-03-15T10:30:00Z",
      "adopted": false,
      "image": "https://loremflickr.com/cache/resized/..."
    },
    {
      "name": "Whiskers",
      "specie": "Gato",
      "birthDate": "2021-07-22T14:45:00Z",
      "adopted": false,
      "image": "https://loremflickr.com/cache/resized/..."
    }
  ]
}
```

---

#### GET /api/mocks/mockingusers
Obtener datos mock de usuarios.

**Ejemplo de petición:**
```bash
curl -X GET "http://localhost:8080/api/mocks/mockingusers"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "first_name": "María",
      "last_name": "García",
      "email": "maria.garcia@example.com",
      "password": "hashedPassword123",
      "role": "user",
      "pets": []
    },
    {
      "first_name": "Carlos",
      "last_name": "López",
      "email": "carlos.lopez@example.com",
      "password": "hashedPassword456",
      "role": "admin",
      "pets": []
    }
  ]
}
```

---

#### POST /api/mocks/generateData
Generar datos de prueba (persistencia o simulación según implementación).

**Ejemplo de petición:**
```bash
curl -X POST "http://localhost:8080/api/mocks/generateData"
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Datos de prueba generados correctamente",
  "payload": {
    "petsCreated": 10,
    "usersCreated": 5
  }
}
```

---

## Estructura del proyecto

La estructura principal del proyecto (excluye archivos de pruebas):

```
.
├── Dockerfile
├── .dockerignore
├── docker-compose.yml (opcional)
├── package.json
├── .env.example
├── README.md
├── src/
│   ├── app.js
│   ├── controllers/
│   │   ├── adoptions.controller.js
│   │   ├── mocks.controller.js
│   │   ├── pets.controller.js
│   │   ├── sessions.controller.js
│   │   └── users.controller.js
│   ├── dao/
│   │   ├── Adoption.dao.js
│   │   ├── Pets.dao.js
│   │   ├── Users.dao.js
│   │   └── models/
│   │       ├── Adoption.js
│   │       ├── Pet.js
│   │       └── User.js
│   ├── dto/
│   │   ├── Pet.dto.js
│   │   └── User.dto.js
│   ├── public/
│   │   └── img/
│   ├── repository/
│   │   ├── AdoptionRepository.js
│   │   ├── GenericRepository.js
│   │   ├── PetRepository.js
│   │   └── UserRepository.js
│   ├── routes/
│   │   ├── adoption.router.js
│   │   ├── mocks.router.js
│   │   ├── pets.router.js
│   │   ├── sessions.router.js
│   │   ├── users.router.js
│   │   └── users.swagger.js
│   ├── services/
│   │   └── index.js
│   └── utils/
│       ├── index.js
│       ├── mocking.js
│       ├── mockingUsers.js
│       └── uploader.js
└── test/
    └── adoption.test.js
```

---

## Tests

Se han desarrollado tests funcionales completos para todos los endpoints del router `adoption.router.js` utilizando **Mocha**, **Supertest** y **Chai**.

### Ejecutar tests

```bash
npm test
```

### Cobertura de tests

Los tests incluyen cobertura completa para:

- **GET /api/adoptions/** 
  - ✅ Obtener todas las adopciones (lista vacía o con datos)
  - ✅ Retornar al menos una adopción si existen en BD

- **GET /api/adoptions/:aid**
  - ✅ Obtener una adopción por ID (éxito)
  - ✅ Error 404 si la adopción no existe
  - ✅ Error si el ID no es válido

- **POST /api/adoptions/:uid/:pid**
  - ✅ Crear una adopción exitosamente
  - ✅ Error 404 si el usuario no existe
  - ✅ Error 404 si la mascota no existe
  - ✅ Error 400 si la mascota ya está adoptada
  - ✅ Marcar la mascota como adoptada después de crear la adopción
  - ✅ Agregar la mascota a la lista de mascotas del usuario

### Archivos de test

- `test/adoption.test.js` - Tests funcionales completos para adoption router

### Salida esperada al ejecutar tests

```
Adoption Router Tests
  GET /api/adoptions/
    ✓ Debe obtener todas las adopciones (lista vacía o con datos)
    ✓ Debe retornar al menos una adopción si existen en BD
  GET /api/adoptions/:aid
    ✓ Debe obtener una adopción por ID
    ✓ Debe retornar 404 si la adopción no existe
    ✓ Debe retornar error si el ID no es válido
  POST /api/adoptions/:uid/:pid
    ✓ Debe crear una adopción exitosamente
    ✓ Debe retornar 404 si el usuario no existe
    ✓ Debe retornar 404 si la mascota no existe
    ✓ Debe retornar 400 si la mascota ya está adoptada
    ✓ Debe marcar la mascota como adoptada después de crear la adopción
    ✓ Debe agregar la mascota a la lista de mascotas del usuario

  11 passing
```

---

## Swagger Documentation

La documentación interactiva de la API está disponible en Swagger UI.

### Acceder a Swagger

Una vez que la aplicación esté corriendo:

```
http://localhost:8080/api/docs
```

### Módulos documentados en Swagger

- **Users Module** ✅ - Completamente documentado
  - `GET /api/users/` - Obtener todos los usuarios
  - `GET /api/users/{uid}` - Obtener usuario por ID
  - `PUT /api/users/{uid}` - Actualizar usuario
  - `DELETE /api/users/{uid}` - Eliminar usuario

### Características de la documentación Swagger

- Esquemas JSON completos con validaciones
- Ejemplos de respuestas exitosas y de error
- Descripciones detalladas de parámetros y campos
- Códigos HTTP de respuesta
- Modelos reutilizables (User schema)

### Archivos Swagger

- `src/routes/users.swagger.js` - Documentación del módulo de Users en OpenAPI 3.0

---

## Dockerfile

Se ha creado un `Dockerfile` para containerizar la aplicación y generar una imagen de Docker.

### Contenido del Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

### Características

- Basado en `node:18-alpine` (imagen ligera)
- Instala dependencias con npm
- Expone puerto 8080
- Comando de inicio: `npm start`

### Archivos relacionados

- `.dockerignore` - Excluye archivos innecesarios de la imagen

---

## Notas importantes

- La URL base de la API es `http://localhost:8080` (ajusta según tu entorno).
- Para endpoints que requieren carga de archivos, usa `multipart/form-data` (campo `image` en `/api/pets/withimage`).
- Todos los IDs mostrados en los ejemplos son MongoDB ObjectIds (formato hexadecimal de 24 caracteres).
- Las fechas se pueden enviar en formato YYYY-MM-DD; se convertirán a ISO 8601 en la base de datos.
- Las respuestas siempre incluyen un campo `status` que puede ser "success" o "error".
- Esta documentación tiene fines académicos; revisa los controladores para detalles específicos de validación y códigos HTTP exactos.

---

## Autor

Rodrigo Sandoval