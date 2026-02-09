import Items from "../models/Item/Items.js";
import Category from "../models/Category/Categories.js";
import Brand from "../models/Brand/Brand.js";
import Unit from "../models/Unit/Unit.js";

export default async function seedItems() {
  await Items.deleteMany();

  const categories = await Category.find();
  const brands = await Brand.find();
  const units = await Unit.find();

  // Safety check
  if (!categories.length || !brands.length || !units.length) {
    throw new Error("❌ Seed Categories, Brands, and Units first before Items.");
  }

  const insertedItems = [];

  for (let i = 1; i <= 20; i++) {
    const item = await Items.create({
      itemName: `Item Sample ${i}`,
      itemDescription: `Description for item ${i}`,
      category: categories[i % categories.length]._id,
      brand: brands[i % brands.length]._id,
      unit: units[i % units.length]._id,
      status: "active" // include if your schema requires it
    });

    insertedItems.push(item);
  }

  console.log("✅ Items Seeded:", insertedItems.length);
  return insertedItems;
}
