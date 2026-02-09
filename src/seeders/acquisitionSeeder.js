import AcquisitionType from "../models/AcquisitionType/AcquisitionType.js";

export default async function seedAcquisitionTypes() {
  await AcquisitionType.deleteMany();

  const typesData = [
    "Purchased",
    "Donation",
    "Transfer",
    "Government Funded",
    "Private Sponsored",
    "Grant Provided",
    "LGU Allocation",
    "Borrowed Asset",
    "Lease Agreement",
    "Project Procurement",
    "Emergency Purchase",
    "Supplier Replacement",
    "Second-hand Purchase",
    "Imported Item",
    "Locally Procured",
    "Auction Purchase",
    "Confiscated Asset",
    "Returned Item",
    "Re-issued Asset",
    "Misc Acquisition"
  ];

  const acquisitions = [];

  for (const name of typesData) {
    const acquisition = await AcquisitionType.create({
      acquisitionTypeName: name,
      status: "active"
    });

    acquisitions.push(acquisition);
  }

  console.log("✅ Acquisition Types Seeded:", acquisitions.length);
  return acquisitions;
}
