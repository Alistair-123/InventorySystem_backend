import Personnel from "../models/Personnel/Personnel.js";
import bcrypt from "bcryptjs";

export default async function seedPersonnel() {
  await Personnel.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const personnels = [];

  for (let i = 1; i <= 20; i++) {
    personnels.push({
      personnelId: `PER-${String(i).padStart(3, "0")}`,
      firstName: `Employee${i}`,
      middleName: "M",
      lastName: `Lastname${i}`,
      personnelType: i % 2 === 0 ? "plantilla" : "jobOrder",
      designationName: i % 2 === 0 ? "Staff Officer" : "Clerk",
      status: "active",
      password: hashedPassword,
      role: i === 1 ? "admin" : "user"
    });
  }

  const inserted = await Personnel.insertMany(personnels);

  console.log("✅ Personnel Seeded:", inserted.length);
  return inserted;
}
