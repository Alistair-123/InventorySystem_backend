/* eslint-disable no-undef */
import Category from "../../models/Category/Categories.js";
import Brand from "../../models/Brand/Brand.js";
import Unit from "../../models/Unit/Unit.js";
import Items from "../../models/Item/Items.js";
import fs from "fs"

export const getReferenceData = async (req, res) => {
  try {
    const [categories, brands, units] = await Promise.all([
      Category.find({ status: "active" })
        .select("_id categoryName")
        .sort({ categoryName: 1 }),

      Brand.find({ status: "active" })
        .select("_id brandName")
        .sort({ brandName: 1 }),

      Unit.find({ status: "active" })
        .select("_id unitName")
        .sort({ unitName: 1 })
    ]);

    res.status(200).json({
      categories,
      brands,
      units
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reference data",
      error: error.message
    });
  }
};
export const createItem = async (req, res) => {
  try {
    const item = await Items.create({
      ...req.body,

      // ✅ store WEB-SAFE relative path only
      itemImage: req.file
        ? `${req.body.uploadType}/${req.file.filename}`
        : null
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* READ ALL */
export const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {
          $or: [
            { itemId: { $regex: search, $options: "i" } },
            { itemName: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      Items.find(searchQuery)
        .populate("category")
        .populate("brand")
        .populate("unit")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Items.countDocuments(searchQuery)
    ]);

    res.json({
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateItem = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ delete old image if replaced
    if (req.file && item.itemImage) {
      const oldPath = path.join(
        process.cwd(),
        "src/uploads",
        item.itemImage
      );

      fs.unlink(oldPath, err => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    Object.assign(item, req.body);

    if (req.file) {
      item.itemImage = `${req.body.uploadType}/${req.file.filename}`;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* DELETE */
export const deleteItem = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.itemImage) {
      const imagePath = path.join(
        process.cwd(),
        "src/uploads",
        item.itemImage
      );

      fs.unlink(imagePath, err => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};