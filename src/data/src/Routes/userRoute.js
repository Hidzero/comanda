import express from "express"
const router = express.Router();
import * as UserController from "../Controllers/userController.js"
import * as AuthController from "../Controllers/auth/authController.js"

router.post("/login", AuthController.login)

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", AuthController.verifyToken, UserController.getUserById);
router.post("/find", AuthController.verifyToken, UserController.getUserByAnything);
router.put("/:id", AuthController.verifyToken, UserController.updateUserById);
router.delete("/:id", AuthController.verifyToken, UserController.updateUserByAnything);
router.delete("/", AuthController.verifyToken, UserController.deleteUserById);
router.delete("/find", AuthController.verifyToken, UserController.deleteUserByAnything);

export default router;