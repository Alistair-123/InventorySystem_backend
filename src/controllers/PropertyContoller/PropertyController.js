import Items from '../../models/Item/Items.js';
import Personnel from '../../models/Personnel/Personnel.js';
import Office from '../../models/Office/Office.js';
import AcquisitionType from '../../models/AcquisitionType/AcquisitionType.js';
import Property from "../../models/Property/Property.js";
export const getPropertyFormOptions = async (req, res) => {
  try {
    const [
      items,
      personnel,
      offices,
      acquisitionTypes
    ] = await Promise.all([
      Items.find({})
        .select("_id itemId itemName")
        .sort({ itemName: 1 }),

      Personnel.find({ status: "active" })
        .select("_id personnelId firstName lastName")
        .sort({ lastName: 1 }),

      Office.find({ status: "active" })
        .select("_id officeId officeName")
        .sort({ officeName: 1 }),

      AcquisitionType.find({ status: "active" })
        .select("_id acquisitionTypeId acquisitionTypeName")
        .sort({ acquisitionTypeName: 1 })
    ]);

    return res.status(200).json({
      items,
      personnel,
      offices,
      acquisitionTypes
    });
  } catch (error) {
    console.error("Property form options error:", error);
    return res.status(500).json({
      message: "Failed to load property form options"
    });
  }
};



/* ============================
   CREATE PROPERTY
============================ */
export const createProperty = async (req, res) => {
  try {
    const {
      propertyNo,
      item,
      acquisitionDate,
      acquisitionType,
      acquisitionValue,
      personnel,
      office,
      status
    } = req.body;

    if (
      !propertyNo ||
      !item ||
      !acquisitionDate ||
      !acquisitionType ||
      !acquisitionValue ||
      !personnel ||
      !office
    ) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const existing = await Property.findOne({ propertyNo });
    if (existing) {
      return res.status(409).json({
        message: "Property number already exists"
      });
    }

    const property = await Property.create({
      propertyNo,
      item,
      acquisitionDate,
      acquisitionType,
      acquisitionValue,
      personnel,
      office,
      status
    });

    return res.status(201).json({
      message: "Property created successfully",
      property
    });
  } catch (error) {
    console.error("Create property error:", error);
    return res.status(500).json({
      message: "Failed to create property"
    });
  }
};

/* ============================
   READ ALL PROPERTIES
============================ */
export const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = (req.query.search || "").trim();

    const skip = (page - 1) * limit;

    let searchFilter = {};

    /* ==================================================
       BUILD SEARCH FILTER (CORRECT WAY)
    ================================================== */
    if (search) {
      const [items, personnel, offices] = await Promise.all([
        Items.find({
          itemName: { $regex: search, $options: "i" },
        }).select("_id"),

        Personnel.find({
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        }).select("_id"),

        Office.find({
          officeName: { $regex: search, $options: "i" },
        }).select("_id"),
      ]);

      searchFilter = {
        $or: [
          { propertyNo: { $regex: search, $options: "i" } },
          { item: { $in: items.map((i) => i._id) } },
          { personnel: { $in: personnel.map((p) => p._id) } },
          { office: { $in: offices.map((o) => o._id) } },
        ],
      };
    }

    /* ==================================================
       QUERY + COUNT (CONSISTENT)
    ================================================== */
    const [properties, total] = await Promise.all([
      Property.find(searchFilter)
        .populate("item", "itemName itemId")
        .populate("acquisitionType", "acquisitionTypeName")
        .populate("personnel", "firstName lastName personnelId")
        .populate("office", "officeName officeId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Property.countDocuments(searchFilter),
    ]);

    /* ==================================================
       RESPONSE
    ================================================== */
    return res.status(200).json({
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get properties error:", error);
    return res.status(500).json({
      message: "Failed to fetch properties",
    });
  }
};

/* ============================
   READ SINGLE PROPERTY
============================ */
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate("item")
      .populate("acquisitionType")
      .populate("personnel")
      .populate("office");

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    return res.status(200).json(property);
  } catch (error) {
    console.error("Get property by id error:", error);
    return res.status(500).json({
      message: "Failed to fetch property"
    });
  }
};

/* ============================
   UPDATE PROPERTY
============================ */
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Property.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("item", "itemName itemId")
      .populate("acquisitionType", "acquisitionTypeName")
      .populate("personnel", "firstName lastName personnelId")
      .populate("office", "officeName officeId");

    if (!updated) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    return res.status(200).json({
      message: "Property updated successfully",
      property: updated
    });
  } catch (error) {
    console.error("Update property error:", error);
    return res.status(500).json({
      message: "Failed to update property"
    });
  }
};

/* ============================
   DELETE PROPERTY
============================ */
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Property.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    return res.status(200).json({
      message: "Property deleted successfully"
    });
  } catch (error) {
    console.error("Delete property error:", error);
    return res.status(500).json({
      message: "Failed to delete property"
    });
  }
};
