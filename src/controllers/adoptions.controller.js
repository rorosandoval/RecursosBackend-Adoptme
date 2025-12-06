import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
next(error);
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption)
      return res
        .status(404)
        .send({ status: "error", error: "Adopción no encontrada" });
    res.send({ status: "success", payload: adoption });
  } catch (error) {
next(error);
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user)
      return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
    const pet = await petsService.getBy({ _id: pid });
    if (!pet)
      return res.status(404).send({ status: "error", error: "Mascota no encontrada" });
    if (pet.adopted)
      return res
        .status(400)
        .send({ status: "error", error: "La mascota ya está adoptada" });
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });
    res.send({ status: "success", message: "MAscota adoptada" });
  } catch (error) {
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
