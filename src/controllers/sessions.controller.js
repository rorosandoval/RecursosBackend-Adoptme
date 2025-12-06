import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const exists = await usersService.getUserByEmail(email);
    if (exists)
      return res
        .status(400)
        .send({ status: "error", error: "El usuario ya existe" });
    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    let result = await usersService.create(user);
    console.log(result);
    res.send({ status: "success", payload: result._id });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const user = await usersService.getUserByEmail(email);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword)
      return res
        .status(400)
        .send({ status: "error", error: "Password incorrecto" });
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Logeado" });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const cookie = req.cookies["coderCookie"];
    if (!cookie) {
      return res.status(401).send({ status: "error", error: "No autenticado" });
    }
    const user = jwt.verify(cookie, "tokenSecretJWT");
    if (user) return res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const unprotectedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    const user = await usersService.getUserByEmail(email);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword)
      return res
        .status(400)
        .send({ status: "error", error: "Password incorrecto" });

    const token = jwt.sign(
      {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        pets: user.pets
      }, 
      "tokenSecretJWT", 
      { expiresIn: "1h" }
    );
    
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({
        status: "success",
        message: "Usuario autenticado sin protección",
      });
  } catch (error) {
    next(error);
  }
};

const unprotectedCurrent = async (req, res, next) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
    if (!cookie) {
      return res.status(401).send({ status: "error", error: "No autenticado" });
    }
    const user = jwt.verify(cookie, "tokenSecretJWT");
    if (user) return res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};