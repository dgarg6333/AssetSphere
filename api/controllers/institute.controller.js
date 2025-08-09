import Institute from "../models/institute.model.js";
import User from "../models/user.model.js"; // Assuming you have a User model

export const addInstitute = async (req, res, next) => {
  try {
    // 1. Verify if the owner's email exists in the User collection
    const user = await User.findOne({ email: req.body.ownerEmail });
    if (!user) {
      return res.status(404).json({ message: "Institute with this email does not exist." });
    }

    // 2. Check if an institute with the same owner email already exists
    const existingInstitute = await Institute.findOne({ ownerEmail: req.body.ownerEmail });
    if (existingInstitute) {
      return res.status(409).json({ message: "An institute with this owner's email already exists." });
    }

    // 3. Create a new institute
    const newInstitute = new Institute({
      ...req.body,
    });

    // 4. Save the new institute to the database
    const savedInstitute = await newInstitute.save();

    // 5. Respond with the created institute
    res.status(201).json(savedInstitute);
  } catch (error) {
    // 6. Handle errors
    next(error);
  }
};

export const getInstituteByEmail = async (req, res, next) => { 
  try {
    const { emailId } = req.params;

    // Find the institute by owner's email
    const institute = await Institute.findOne({ ownerEmail: emailId });
    if (!institute) {
      return res.status(404).json({ message: "Institute not found." });
    }

    res.status(200).json(institute);
  } catch (error) {
    next(error);
  }
}