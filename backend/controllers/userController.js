const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }); // Find user by email
    if (!user) { // If user not found
      return res.status(404).send("User Not Found");
    }
    // Compare plain text password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){ // If passwords don't match
      return res.status(400).send("Invalid Credentials");
    }
    // Generate token
    const token = jwt.sign({
      userId: user._id
    }, process.env.SECRET_TOKEN, {
      expiresIn: "3600"
    });

    res.status(200).json({
      success: true,
      token:token,
      user,
    });
    console.log(token)
    
        
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }

    


} 


//Register 
const registerController = async (req, res) => {
  try {
     // Hash the password
     const salt = await bcrypt.genSalt(10);
     req.body.password = await bcrypt.hash(req.body.password, salt);
     
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
