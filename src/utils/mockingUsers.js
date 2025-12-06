import { faker } from "@faker-js/faker";
import { createHash } from "./index.js";
import mongoose from "mongoose";

const generateMockUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const role = faker.helpers.arrayElement(["user", "admin"]);
  const passwordFromEnv = process.env.MOCK_USER_PASSWORD || "coder123";
  const hashedPassword = await createHash(passwordFromEnv);

  return {
    _id: new mongoose.Types.ObjectId(),
    first_name: firstName,
    last_name: lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: hashedPassword,
    role: role,
    pets: [],
    __v: 0,
  };
};

export const generateMockUsers = async (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    const user = await generateMockUser();
    users.push(user);
  }
  return users;
};
