import bcrypt from 'bcrypt';
import Personnel from '../../models/Personnel/Personnel.js';
const saltRounds = 10;

export const createPersonnel = async (req, res) => {
    try{
        const {personnelId, firstName, middleName, lastName, personnelType, designation, designationName, status, password, role } = req.body;

        // Check if personnelId already exists
        const existingPersonnel = await Personnel.findOne({ personnelId });
        if(existingPersonnel) return res.status(400).json({ message: "Personnel ID already exists" });
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newPersonnel = new Personnel({
            personnelId,
            firstName,
            middleName,
            lastName,
            personnelType,
            designation,
            designationName,
            status,
            password: hashedPassword,
            role
        });

        await newPersonnel.save();
        res.status(201).json({ message: "Personnel created successfully", personnel: newPersonnel });
    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


