import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

dotenv.config();

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URL);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptMe API",
      version: "1.0.0",
      description: "Documentación de la API AdoptMe - Proyecto Académico",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.swagger.js", "./src/routes/*.router.js"],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

export default app;