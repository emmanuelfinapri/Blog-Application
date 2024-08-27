// Importing required modules
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

// Function to register a new user
const register = async (req, res) => {
  const { password, ...others } = req.body; // Extract password and other user details
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
  const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

  const newUser = new userModel({ ...others, password: hashedPassword }); // Create a new user instance with hashed password
  try {
    // Save the new user to the database
    const savedUser = await newUser.save();
    // Send a success response with the saved user data
    res.json({
      message: "Account created successfully",
      user: savedUser,
    });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(404).json({ message: error.message });
  }
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if the user exists in the database
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res.json({ message: "User not found" });
    }

    // Verify the provided password with the stored hashed password
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.json({ message: "Password does not match" });
    }

    // Send a success response with the user information
    res.json({
      message: `Welcome ${userInfo.username}, you are now logged in`,
      user: userInfo,
    });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to update user information
const updateUserInfo = async (req, res) => {
  const { id, password, ...others } = req.body; // Extract user ID, password, and other fields to update

  try {
    // Update user information in the database
    const updatedUser = await userModel.findByIdAndUpdate(id, others, {
      new: true,
    });

    // Send a response with the updated user data
    res.json(updatedUser);
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to update a user's password
const updatePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body; // Extract user ID, old password, and new password from request body
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing

  try {
    // Retrieve the user by ID
    const getUser = await userModel.findById(id);
    // Verify the old password matches the stored password
    const verify = bcrypt.compareSync(oldPassword, getUser.password);
    if (!verify) {
      return res.json({ message: "Old password does not match" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    // Update the user's password in the database
    await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Send a success response
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to handle forgot password
const forgotPassword = async (req, res) => {
  const { id, newPassword } = req.body; // Extract user ID and new password from request body
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
  const hashedPassword = bcrypt.hashSync(newPassword, salt); // Hash the new password

  try {
    // Retrieve the user by ID
    const getUser = await userModel.findById(id);
    if (!getUser) {
      return res.json({ message: "Sorry, this user does not exist" });
    }

    // Update the user's password in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Send a response with the updated user data
    res.json(updatedUser);
  } catch (error) {
    // Send an error response if there's an exception
    res.status(404).json({ message: error.message });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { id } = req.body; // Extract user ID from request body

  try {
    // Retrieve the user by ID
    const getUser = await userModel.findById(id);
    if (!getUser) {
      return res.json({ message: "Sorry, this user does not exist" });
    }

    // Delete the user from the database
    await userModel.findByIdAndDelete(id);

    // Send a success response
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Exporting all functions for use in other parts of the application
module.exports = {
  register,
  loginUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
  forgotPassword,
};
