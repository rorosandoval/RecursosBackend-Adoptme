import { faker } from "@faker-js/faker";

const generateMockPet = () => {
  return {
    name: faker.animal.petName(),
    specie: faker.helpers.arrayElement([
      "Perro",
      "Gato",
      "Conejo",
      "Hamster",
      "Ave",
      "Pez",
    ]),
    birthDate: faker.date.past({ years: 10 }),
    adopted: false,
    image: faker.image.url(),
  };
};

export const generateMockPets = (num) => {
  const pets = [];
  for (let i = 0; i < num; i++) {
    pets.push(generateMockPet());
  }
  return pets;
};
