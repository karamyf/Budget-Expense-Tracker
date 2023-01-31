const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) { 
      return res.status(404).send("User Not Found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).send("Invalid Credentials");
    }

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

    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

     // Hash
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
