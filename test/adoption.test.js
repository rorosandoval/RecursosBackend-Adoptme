import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { expect } from "chai";
import app from "../src/app.js";
import petModel from "../src/dao/models/Pet.js";
import userModel from "../src/dao/models/User.js";
import adoptionModel from "../src/dao/models/Adoption.js";

dotenv.config();

describe("Adoption Router Tests", function() {
  this.timeout(10000); 

  let petId, userId, adoptionId;
  let petIdAdopted;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URL);
    }

    await adoptionModel.deleteMany({});
    await petModel.deleteMany({});
    await userModel.deleteMany({});

    const user = await userModel.create({
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan@test.com",
      password: "hashedPassword123",
      role: "user",
      pets: [],
    });
    userId = user._id;

    const pet = await petModel.create({
      name: "Fido",
      specie: "Perro",
      birthDate: new Date("2021-01-15"),
      adopted: false,
      image: "https://ejemplo.com/imagen.jpg",
    });
    petId = pet._id;

    const petAdopted = await petModel.create({
      name: "Mishi",
      specie: "Gato",
      birthDate: new Date("2020-05-10"),
      adopted: true,
      owner: userId,
      image: "https://ejemplo.com/gato.jpg",
    });
    petIdAdopted = petAdopted._id;

    const adoption = await adoptionModel.create({
      owner: userId,
      pet: petIdAdopted,
    });
    adoptionId = adoption._id;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/adoptions/", () => {
    it("Debe obtener todas las adopciones", async () => {
      const res = await request(app).get("/api/adoptions/");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
    });
  });

  describe("GET /api/adoptions/:aid", () => {
    it("Debe obtener una adopción por ID", async () => {
      const res = await request(app).get(`/api/adoptions/${adoptionId}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload._id.toString()).to.equal(adoptionId.toString());
    });

    it("Debe retornar 404 si la adopción no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/adoptions/${fakeId}`);

      expect(res.status).to.equal(404);
    });
  });

  describe("POST /api/adoptions/:uid/:pid", () => {
    let newPetId, newUserId;

    beforeEach(async () => {
      const user = await userModel.create({
        first_name: "María",
        last_name: "García",
        email: `maria${Date.now()}@test.com`,
        password: "hashedPassword456",
        role: "user",
        pets: [],
      });
      newUserId = user._id;

      const pet = await petModel.create({
        name: "Rex",
        specie: "Perro",
        birthDate: new Date("2022-03-20"),
        adopted: false,
        image: "https://ejemplo.com/rex.jpg",
      });
      newPetId = pet._id;
    });

    it("Debe crear una adopción exitosamente", async () => {
      const res = await request(app).post(`/api/adoptions/${newUserId}/${newPetId}`);

      expect(res.status).to.equal(200);
      const adoption = await adoptionModel.findOne({ owner: newUserId, pet: newPetId });
      expect(adoption).to.exist;
    });

    it("Debe retornar 400 si la mascota ya está adoptada", async () => {
      const res = await request(app).post(`/api/adoptions/${newUserId}/${petIdAdopted}`);
      expect(res.status).to.equal(400);
    });
  });
});