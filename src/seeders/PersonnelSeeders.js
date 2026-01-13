import bcrypt from "bcryptjs";

const salt = await bcrypt.genSalt(10);

export const personnelSeed = [
  {
    personnelId: "ADMIN-001",
    firstName: "System",
    middleName: "",
    lastName: "Administrator",
    personnelType: "plantilla",
    designation: "IT Head",
    designationName: "Information Technology Head",
    status: "active",
    password: await bcrypt.hash("Admin@123", salt),
    role: "admin",
  },
  {
    personnelId: "USER-001",
    firstName: "Juan",
    middleName: "S",
    lastName: "Dela Cruz",
    personnelType: "jobOrder",
    designation: "Staff",
    designationName: "Office Staff",
    status: "active",
    password: await bcrypt.hash("User@123", salt),
    role: "user",
  },
];
