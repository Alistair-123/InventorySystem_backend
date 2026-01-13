/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Personnel from '../models/Personnel/Personnel.js';
import { personnelSeed } from './PersonnelSeeders.js';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const importData = async () => {
  try {
    await connectDB();

    await Personnel.deleteMany();
    await Personnel.insertMany(personnelSeed);

    console.log("Personnel seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Personnel.deleteMany();
    console.log("Personnel data destroyed");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.argv[2] === "-d" ? destroyData() : importData();
