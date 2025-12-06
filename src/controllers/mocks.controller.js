import { generateMockPets } from "../utils/mocking.js";
import { generateMockUsers } from "../utils/mockingUsers.js";
import { usersService, petsService } from "../services/index.js";

const getMockingPets = async (req, res, next) => {
  try {
    const pets = generateMockPets(100);
    res.send({ status: "success", payload: pets });
  } catch (error) {
    next(error);
  }
};

const getMockingUsers = async (req, res, next) => {
  try {
    const users = await generateMockUsers(50);
    res.send({ status: "success", payload: users });
  } catch (error) {
    next(error);
  }
};

const generateData = async (req, res, next) => {
  try {
    const { users, pets } = req.body;
    if (users === undefined || pets === undefined) {
      return res.status(400).send({
        status: "error",
        error: "Valores incompletos. Se requieren 'users' y 'pets'",
      });
    }

    const usersNum = parseInt(users);
    const petsNum = parseInt(pets);

    if (isNaN(usersNum) || isNaN(petsNum) || usersNum < 0 || petsNum < 0) {
      return res.status(400).send({
        status: "error",
        error:
          "Parámetros inválidos. 'users' y 'pets' deben ser números positivos",
      });
    }

    const mockUsers = await generateMockUsers(usersNum);
    const mockPets = generateMockPets(petsNum);
    const usersToInsert = mockUsers.map(({ _id, __v, ...rest }) => rest);
    const petsToInsert = mockPets.map(({ _id, __v, ...rest }) => rest);

    let insertedUsers = [];
    let insertedPets = [];

    if (usersNum > 0) {
      insertedUsers = await usersService.createMany(usersToInsert);
    }

    if (petsNum > 0) {
      insertedPets = await petsService.createMany(petsToInsert);
    }

    res.send({
      status: "success",
      message: `Se generaron e insertaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas`,
      payload: {
        users: insertedUsers.length,
        pets: insertedPets.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMockingPets,
  getMockingUsers,
  generateData,
};
