import Category from "../models/Category/Categories.js";

export default async function seedCategories() {
  await Category.deleteMany();

  const categoriesData = [
    "Electronics",
    "Office Supplies",
    "Furniture",
    "IT Equipment",
    "Communication Devices",
    "Kitchen Appliances",
    "Tools & Hardware",
    "Medical Supplies",
    "Cleaning Materials",
    "Construction Materials",
    "Sports Equipment",
    "Laboratory Equipment",
    "School Supplies",
    "Audio Equipment",
    "Video Equipment",
    "Printing Supplies",
    "Security Devices",
    "Transportation Assets",
    "Agricultural Tools",
    "Miscellaneous Items"
  ];

  const categories = await Category.insertMany(
    categoriesData.map((name) => ({
      categoryName: name,
      status: "active"
    }))
  );

  console.log("✅ Categories Seeded:", categories.length);
  return categories;
}
