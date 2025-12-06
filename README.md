# AdoptMe - Documentación de API

Proyecto con carácter académico. Este documento describe todos los endpoints disponibles, los esquemas de entrada/salida y la estructura del proyecto.

**URL Base:** `http://localhost:8080`

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

La estructura principal del proyecto (excluye archivos de pruebas como `app.test.js`):

```
package.json
src/
  app.js
  controllers/
    adoptions.controller.js
    mocks.controller.js
    pets.controller.js
    sessions.controller.js
    users.controller.js
  dao/
    Adoption.dao.js
    Pets.dao.js
    Users.dao.js
    models/
      Adoption.js
      Pet.js
      User.js
  dto/
    Pet.dto.js
    User.dto.js
  public/
    img/
  repository/
    AdoptionRepository.js
    GenericRepository.js
    PetRepository.js
    UserRepository.js
  routes/
    adoption.router.js
    mocks.router.js
    pets.router.js
    sessions.router.js
    users.router.js
  services/
    index.js
  utils/
    index.js
    mocking.js
    mockingUsers.js
    uploader.js
```

---

Rodrigo Sandoval.