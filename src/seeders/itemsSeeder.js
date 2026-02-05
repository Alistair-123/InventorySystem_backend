import Items from "../models/Item/Items.js";
import Category from "../models/Category/Categories.js";
import Brand from "../models/Brand/Brand.js";
import Unit from "../models/Unit/Unit.js";

export default async function seedItems() {
  await Items.deleteMany();

  const categories = await Category.find();
  const brands = await Brand.find();
  const units = await Unit.find();

  const items = [];

  for (let i = 1; i <= 20; i++) {
    items.push({
      itemName: `Item Sample ${i}`,
      itemDescription: `Description for item ${i}`,
      category: categories[i % categories.length]._id,
      brand: brands[i % brands.length]._id,
      unit: units[i % units.length]._id
    });
  }

  const inserted = await Items.insertMany(items);

  console.log("✅ Items Seeded:", inserted.length);
  return inserted;
}
