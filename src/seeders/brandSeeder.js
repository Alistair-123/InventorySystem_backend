import Brand from "../models/Brand/Brand.js";

export default async function seedBrands() {
  await Brand.deleteMany();

  const brandsData = [
    "Dell",
    "HP",
    "Lenovo",
    "Acer",
    "Asus",
    "Apple",
    "Samsung",
    "Epson",
    "Canon",
    "Brother",
    "Sony",
    "LG",
    "Panasonic",
    "Toshiba",
    "MSI",
    "Huawei",
    "Xiaomi",
    "Philips",
    "Sharp",
    "IBM"
  ];

  const brands = await Brand.insertMany(
    brandsData.map((name) => ({
      brandName: name,
      status: "active"
    }))
  );

  console.log("✅ Brands Seeded:", brands.length);
  return brands;
}
