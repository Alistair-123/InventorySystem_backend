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

  const units = [];

  for (const name of unitsData) {
    const unit = await Unit.create({
      unitName: name,
      status: "active"
    });

    units.push(unit);
  }

  console.log("✅ Units Seeded:", units.length);
  return units;
}
