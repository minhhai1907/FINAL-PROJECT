const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const auth = require("../middlewares/auth");

/**
 * @route POST /posts
 * @description Create a new post
 * @access Login required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  validators.validate([body("image", "Missing image").exists().notEmpty()]),
  postController.createNewPost
);

/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access Login required
 */
router.get(
  "/:id",/**postID */
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);

/**
 * @route GET /posts/userId
 * @description Get  posts By current ID
 * @access Login required
 */
router.get(
  "/postList/:userId",/**currentUserId */
  authMiddleware.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getPostByCurrentUser
);

/**
 * @route PUT /posts/:id
 * @description Update a post
 * @access Login required
 */
router.put(
  "/:id",/**postID of author */
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  postController.updateSinglePost
);

/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */
router.delete(
  "/:id",/**postId of author */
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.deleteSinglePost
);


//   "/all/userId", 
//   validators.validate([
//     param("userId").exists().isString().custom(validators.checkObjectId),
//   ]),
//   postController.getPosts
// );
/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */
 router.get(

  "/user/:userId",
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getPosts
);


//  router.get(

//   "/all",
//   // validators.validate([
//   //   param("userId").exists().isString().custom(validators.checkObjectId),
//   // ]),
//   postController.getAllPosts
// );

/**
 * @route GET /posts/:id/comments
 * @description Get comments of a post
 * @access Login required
 */
router.get(
  "/:id/comments",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getCommentsOfPost
);


module.exports = router;
