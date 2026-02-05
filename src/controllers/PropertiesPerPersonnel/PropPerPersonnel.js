import Personnel from "../../models/Personnel/Personnel.js";
import Property from "../../models/Property/Property.js";

/*
|--------------------------------------------------------------------------
| GET Personnel Property Summary
|--------------------------------------------------------------------------
| Example:
| GET /api/personnels/properties-summary?search=juan&page=1&limit=5
|--------------------------------------------------------------------------
*/
export const getPersonnelPropertySummary = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page);
    const perPage = parseInt(limit);

    // ✅ Search filter
    const searchFilter = {
      $or: [
        { personnelId: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } }
      ]
    };

    // ✅ Total personnels count (for pagination)
    const totalPersonnels = await Personnel.countDocuments(searchFilter);

    // ✅ Fetch personnels with pagination
    const personnels = await Personnel.find(searchFilter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    // ✅ Count properties for each personnel
    const results = await Promise.all(
      personnels.map(async (personnel) => {
        const propertyCount = await Property.countDocuments({
          personnel: personnel._id
        });

        return {
          _id: personnel._id,
          personnelId: personnel.personnelId,
          fullName: `${personnel.firstName} ${personnel.lastName}`,
          designationName: personnel.designationName,
          status: personnel.status,
          propertyCount
        };
      })
    );

    res.status(200).json({
      success: true,
      page: currentPage,
      totalPages: Math.ceil(totalPersonnels / perPage),
      totalPersonnels,
      data: results
    });
  } catch (error) {
    console.error("Personnel Property Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch personnel property summary"
    });
  }
};


export const getPersonnelProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const currentPage = parseInt(page);
    const perPage = parseInt(limit);

    // ✅ Count total properties for pagination
    const totalProperties = await Property.countDocuments({
      personnel: id
    });

    // ✅ Fetch properties
    const properties = await Property.find({ personnel: id })
      .populate("item", "itemName")
      .populate("office", "officeName")
      .populate("acquisitionType", "typeName")
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      page: currentPage,
      totalPages: Math.ceil(totalProperties / perPage),
      totalProperties,
      data: properties
    });
  } catch (error) {
    console.error("Personnel Properties Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch personnel properties"
    });
  }
};