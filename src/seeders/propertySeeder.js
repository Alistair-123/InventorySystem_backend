import Property from "../models/Property/Property.js";
import Items from "../models/Item/Items.js";
import AcquisitionType from "../models/AcquisitionType/AcquisitionType.js";
import Personnel from "../models/Personnel/Personnel.js";
import Office from "../models/Office/Office.js";

export default async function seedProperties() {
  await Property.deleteMany();

  const items = await Items.find();
  const acquisitions = await AcquisitionType.find();
  const personnels = await Personnel.find();
  const offices = await Office.find();

  // ✅ Safety Check
  if (!items.length || !acquisitions.length || !personnels.length || !offices.length) {
    throw new Error(
      "❌ Seed Items, AcquisitionTypes, Personnel, and Offices before Properties."
    );
  }

  const properties = [];

  for (let i = 1; i <= 20; i++) {
    properties.push({
      propertyNo: `PROP-${String(i).padStart(4, "0")}`,
      item: items[i % items.length]._id,
      acquisitionDate: new Date(),
      acquisitionType: acquisitions[i % acquisitions.length]._id,
      acquisitionValue: Math.floor(Math.random() * 50000) + 5000,
      personnel: personnels[i % personnels.length]._id,
      office: offices[i % offices.length]._id,
      status: "serviceable"
    });
  }

  const inserted = await Property.insertMany(properties);

  console.log("✅ Properties Seeded:", inserted.length);
  return inserted;
}
