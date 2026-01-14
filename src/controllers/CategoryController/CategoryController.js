import Category from "../../models/Category/Categories.js";

export const createCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, status } = req.body;
        // Check if categoryId already exists
        const existingCategory = await Category.findOne({ categoryId });
        if (existingCategory) return res.status(400).json({ message: "Category ID already exists" });

        const newCategory = new Category({
            categoryId,
            categoryName,
            status
        });

        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build query dynamically
    const query = {};

    if (search) {
      query.$or = [
        { categoryName: { $regex: search, $options: "i" } },
        { categoryId: { $regex: search, $options: "i" } },
      ];
    }


    const [categories, totalCategories] = await Promise.all([
      Category.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Category.countDocuments(query),
    ]);

    res.status(200).json({
      data: categories,
      pagination: {
        totalItems: totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, categoryName, status } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categoryId, categoryName, status },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}