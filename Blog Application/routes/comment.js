const express = require("express");
const {
  makeComment,
  editComment,
  deleteComment,
} = require("../controllers/comment"); // Import controller functions
const router = express.Router(); // Create an instance of the router

// Route to create a new comment
router.post("/comments", makeComment);

// Route to update an existing comment
router.put("/comments", editComment);

// Route to delete a comment
router.delete("/comments", deleteComment);

// Export the router to be used in other parts of the application
module.exports = router;
