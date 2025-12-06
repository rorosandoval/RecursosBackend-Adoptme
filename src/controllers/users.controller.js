import { usersService } from "../services/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "Usuario actualizado" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({ status: "success", message: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
