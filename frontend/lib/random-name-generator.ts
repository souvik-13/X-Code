import Chance from "chance";
const chance = new Chance();

const adjectives = [
  "Happy",
  "Sad",
  "Fast",
  "Slow",
  "Red",
  "Blue",
  "Big",
  "Small",
];
const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Jackfruit",
  "Kiwi",
  "Lemon",
  "Mango",
  "Nectarine",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Ugli",
  "Vimto",
  "Watermelon",
  "Xigua",
];

export const randomNameGenerator = (): string => {
  const randomAdjective =
    adjectives[chance.integer({ min: 0, max: adjectives.length - 1 })];
  const randomFruit =
    fruits[chance.integer({ min: 0, max: fruits.length - 1 })];

  const randomColorName = chance.color({ format: "name" });
  const randomAnimal = chance.animal({ type: "pet" });

  const rnadomName =
    (chance.bool() ? randomAdjective : randomColorName) +
    " " +
    (chance.bool() ? randomFruit : randomAnimal);
  // replace the space with a dash
  return rnadomName.replace(/ /g, "-");
};

