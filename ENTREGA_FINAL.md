# Backend III - Entrega Final - Checklist

## Requisitos Completados

### 1. Documentación en Swagger del módulo "Users" ✅

- [x] Documentación con Swagger en OpenAPI 3.0
- [x] Archivo: `src/routes/users.swagger.js`
- [x] Endpoints documentados:
  - GET /api/users/
  - GET /api/users/{uid}
  - PUT /api/users/{uid}
  - DELETE /api/users/{uid}
- [x] Incluye esquemas completos y ejemplos
- [x] Accesible en: http://localhost:8080/api/docs

### 2. Tests Funcionales para adoption.router.js ✅

- [x] Archivo: `test/adoption.test.js`
- [x] Framework: Mocha + Supertest + Chai
- [x] Cobertura completa de todos los endpoints:
  - GET /api/adoptions/
  - GET /api/adoptions/:aid
  - POST /api/adoptions/:uid/:pid
- [x] Tests de casos exitosos
- [x] Tests de casos de error (404, 400)
- [x] Validaciones de persistencia en BD
- [x] Ejecución: `npm test`
- [x] Todos los tests pasando

### 3. Dockerfile ✅

- [x] Archivo: `Dockerfile`
- [x] Basado en node:18-alpine
- [x] Incluye instrucciones para:
  - Instalación de dependencias
  - Copia de archivos
  - Exposición de puerto 8080
  - Comando de inicio
- [x] `.dockerignore` configurado

### 4. Docker Compose (Bonus) ✅

- [x] Archivo: `docker-compose.yml`
- [x] Servicio MongoDB incluido
- [x] Servicio API configurado
- [x] Volúmenes persistentes
- [x] Red personalizada

### 5. Imagen en Dockerhub ✅

- [x] Imagen subida: `rorosandoval/adoptme-api:latest`
- [x] URL: https://hub.docker.com/r/rorosandoval/adoptme-api
- [x] Comando de descarga: `docker pull rorosandoval/adoptme-api:latest`

### 6. README.md Actualizado ✅

- [x] Instrucciones de instalación local
- [x] Instrucciones de Docker (docker run)
- [x] Instrucciones de Docker Compose
- [x] Link a imagen en Dockerhub
- [x] Documentación completa de endpoints
- [x] Descripción de tests
- [x] Información de Swagger
- [x] Estructura del proyecto actualizada

---

## Cómo Ejecutar

### Local
```bash
npm install
npm run dev
npm test
```

### Docker
```bash
docker build -t adoptme-api:latest .
docker run -p 8080:8080 -e MONGO_URL=mongodb://host.docker.internal:27017/adoptmedb adoptme-api:latest
```

### Docker Compose
```bash
docker-compose up -d
```

### Desde Dockerhub
```bash
docker pull rorosandoval/adoptme-api:latest
docker run -p 8080:8080 -e MONGO_URL=mongodb://host.docker.internal:27017/adoptmedb rorosandoval/adoptme-api:latest
```

---

## Acceso a Recursos

- **API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/api/docs
- **Dockerhub:** https://hub.docker.com/r/rorosandoval/adoptme-api

---

**Autor:** Rodrigo Sandoval  
**Fecha:** Enero 2026
