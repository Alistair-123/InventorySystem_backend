import mongoose from "mongoose";
import dotenv from "dotenv";

import seedCategories from "./categorySeeder.js";
import seedBrands from "./brandSeeder.js";
import seedUnits from "./unitSeeder.js";
import seedAcquisitionTypes from "./acquisitionSeeder.js";
import seedOffices from "./officeSeeder.js";
import seedPersonnel from "./PersonnelSeeders.js";
import seedItems from "./itemsSeeder.js";
import seedProperties from "./propertySeeder.js";

dotenv.config();

async function runSeeder() {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    console.log("🌱 Seeding Started...\n");

    await seedCategories();
    await seedBrands();
    await seedUnits();
    await seedAcquisitionTypes();
    await seedOffices();
    await seedPersonnel();
    await seedItems();
    await seedProperties();

    console.log("\n✅ ALL DATA SEEDED SUCCESSFULLY!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder Error:", err);
    process.exit(1);
  }
}

runSeeder();
