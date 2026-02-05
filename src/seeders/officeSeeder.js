import Office from "../models/Office/Office.js";

export default async function seedOffices() {
  await Office.deleteMany();

  const officesData = [
    "Mayor's Office",
    "Vice Mayor's Office",
    "Accounting Office",
    "Treasurer's Office",
    "HR Office",
    "IT Office",
    "Engineering Office",
    "Planning Office",
    "Health Office",
    "Agriculture Office",
    "Disaster Risk Office",
    "Tourism Office",
    "Education Office",
    "Legal Office",
    "Budget Office",
    "Supply Office",
    "Records Office",
    "Admin Office",
    "Youth Office",
    "Senior Citizen Office"
  ];

  const offices = await Office.insertMany(
    officesData.map((name) => ({
      officeName: name,
      status: "active"
    }))
  );

  console.log("✅ Offices Seeded:", offices.length);
  return offices;
}
