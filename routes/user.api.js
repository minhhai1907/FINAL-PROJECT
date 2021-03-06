const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const userController = require("../controllers/user.controller");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route POST /users
 * @description Register new user
 * @access Public
 */
router.post(
  "/register",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route GET /user/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me",authMiddleware.loginRequired, userController.getCurrentUser);


router.put("/favourite/:id",authMiddleware.loginRequired,userController.putFavourite)
/**
 * @route PUT /user/:id
 * @description Update user profile
 * @access Login required
 */

 router.put("/:id",authMiddleware.loginRequired,  userController.updateProfile);
/**
 * @route DELETE /user/:id
 * @description Update user profile
 * @access Login required
 */
 router.delete("/",authMiddleware.loginRequired,  userController.deleteProfile);
 
 /**
 * @route GET /user/:id
 * @description Get a user profile
 * @access Login required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);
/**
 * @route GET /users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 */
router.get("/",authMiddleware.loginRequired,  userController.getUsers);





module.exports = router;








// const express = require("express");
// const userCtrl=require('../controllers/userCtrl')
// const auth=require('../middlewares/auth')
// const router=express.Router();



// router.post('/register',userCtrl.register );

// router.post('/login',userCtrl.login );

// router.get('/logout',userCtrl.logout);

// router.get('/refresh_token',userCtrl.refreshToken)

// router.get('/infor',userCtrl.getUser)

// router.get('/all',userCtrl.getAllUsersList)





module.exports=router