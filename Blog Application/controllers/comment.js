// Importing the required models
const commentModel = require("../models/comment");
const userModel = require("../models/user");
const postModel = require("../models/post");

// Function to create a new comment
const makeComment = async (req, res) => {
  const body = req.body;
  console.log(body.commentorsId); // Log the ID of the commentor for debugging

  // Create a new comment instance using the request body
  const newComment = new commentModel(body);

  try {
    // Save the new comment to the database
    await newComment.save();

    // Find the user's information by their ID
    const userInfo = await userModel.findById(body.commentorsId);
    // Find the post's information by its ID
    const postInfo = await postModel.findById(body.postId);

    // If either the user or post doesn't exist, send an error response
    if (!userInfo || !postInfo) {
      return res.json({
        message:
          "Sorry, either the user or the post doesn't exist. Please check again.",
      });
    }

    console.log(userInfo); // Log the user information for debugging

    // Send a success response with details about the new comment
    res.json({
      message: "Comment created successfully",
      like: `${userInfo.username} commented on the post with title '${postInfo.title}' with comment '${newComment.comment}'`,
    });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

// Function to edit an existing comment
const editComment = async (req, res) => {
  const { id, comment } = req.body; // Extract the comment ID and new comment text from the request body

  try {
    // Find the comment to be edited by its ID
    const commentInfo = await commentModel.findById(id);

    // If the comment doesn't exist, send a 404 error response
    if (!commentInfo) {
      return res
        .status(404)
        .json({ message: "Sorry, this comment does not exist" });
    }

    // Update the comment with the new text
    await commentModel.findByIdAndUpdate(id, { comment: comment });

    // Send a success response after updating the comment
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    // Log the error message if there's an exception
    console.log(error.message);
  }
};

// Function to delete an existing comment
const deleteComment = async (req, res) => {
  const { id } = req.body; // Extract the comment ID from the request body

  try {
    // Find the comment to be deleted by its ID
    const commentInfo = await commentModel.findById(id);

    // If the comment doesn't exist, send a 404 error response
    if (!commentInfo) {
      return res
        .status(404)
        .json({ message: "Sorry, this comment does not exist" });
    }

    // Delete the comment from the database
    await commentModel.findByIdAndDelete(id);

    // Send a success response after deleting the comment
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    // Log the error message if there's an exception
    console.log(error.message);
  }
};

// Export the functions to be used in other parts of the application
module.exports = { makeComment, editComment, deleteComment };
