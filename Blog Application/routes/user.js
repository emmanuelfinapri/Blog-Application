const express = require("express");
const routes = express.Router(); // Create an instance of the router
const {
  register,
  loginUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
  forgotPassword,
} = require("../controllers/user"); // Import controller functions

// Route to register a new user
routes.post("/user", register);

// Route to log in a user
routes.post("/login", loginUser);

// Route to update user information
routes.put("/user", updateUserInfo);

// Route to change the user's password
routes.put("/change-password", updatePassword);

// Route to handle forgotten password
routes.put("/forgot-password", forgotPassword);

// Route to delete a user
routes.delete("/delete-user", deleteUser);

// Export the router to be used in other parts of the application
module.exports = routes;
