const express = require("express");
const userController = require("../controllers/userController");

const routerUser = express.Router();

routerUser
  .get("/users/users-data", userController.userData)
  .post("/users/register", userController.createUser)
  .post("/users/login", userController.loginUser)
  .put("/users/edit-account", userController.editUserData)
  .delete("/users/remove", userController.deleteUsers);

module.exports = routerUser;
