import Brand from "../../models/Brand/Brand.js";

export const createBrand = async (req, res) => {
    try {
        const { brandId, brandName, status } = req.body;
        // Check if categoryId already exists
        const existingBrand = await Brand.findOne({ brandId });
        if (existingBrand)
        return res.status(400).json({ message: "Brand ID already exists" });


        const newBrand= new Brand({
            brandId,
            brandName,
            status
        });

        await newBrand.save();
       res.status(201).json({
        message: "Brand created successfully",
        brand: newBrand
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getBrands = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit
        const search = req.query.search || "";

        const query = {}

        if(search){
            query.$or = [
                { brandId: { $regex: search, $options: "i"}},
                { brandName: { $regex: search, $options: "i"}}
            ];
        }

        const [brand, totalBrands] = await Promise.all([
            Brand.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Brand.countDocuments(query),
        ]);

        res.status(200).send({
            data: brand,
            pagination: {
                totalItems: totalBrands,
                totalPages: Math.ceil(totalBrands / limit),
                currentPage: page,
                pageSize: limit,
            }
        })
    }catch(error){
        res.status(500).json({
        message: "Server Error",
        error: error.message,
    });
    }
}

export const updateBrand = async (req, res) => {
    try{
        const { id } = req.params
        const { brandId, brandName, status } = req.body;
        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { brandId, brandName, status },
            { new: true }
        );
        if (!updatedBrand) return res.status(404).json({ message: "Brand not found" });
        res.status(200).json({ message: "Brand updated successfully", brand: updatedBrand });
    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const deleteBrand = async(req, res) => {
    try{
        const { id } = req.params
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) return res.status(404).json({ message: "Brand not found" });
        res.status(200).json({ message: "Brand deleted successfully" });
    }catch(error){
         res.status(500).json({ message: "Server Error", error: error.message });
    }
}