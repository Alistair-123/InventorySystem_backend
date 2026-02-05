import Unit from "../models/Unit/Unit.js";

export default async function seedUnits() {
  await Unit.deleteMany();

  const unitsData = [
    "Piece",
    "Box",
    "Set",
    "Unit",
    "Pack",
    "Bundle",
    "Roll",
    "Liter",
    "Gallon",
    "Kilogram",
    "Gram",
    "Meter",
    "Inch",
    "Foot",
    "Dozen",
    "Pair",
    "Carton",
    "Bag",
    "Bottle",
    "Container"
  ];

  const units = await Unit.insertMany(
    unitsData.map((name) => ({
      unitName: name,
      status: "active"
    }))
  );

  console.log("✅ Units Seeded:", units.length);
  return units;
}
