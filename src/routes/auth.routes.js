const express = require("express");
const authController = require("../controllers/authController");
const userModel = require("../model/User");

const routerAuth = express.Router();

routerAuth
  .post("/admin", authController.authController, async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.headers.email });
      if (user.admin === true) {
        return res.status(202).send("Só admin pode rodar");
      }
    } catch (error) {
      res.status(403).send("Not admin: Access Denied");
    }
  })
  .post("/free", authController.authController, (req, res) => {
    res.send("Acesso permitido");
  });

module.exports = routerAuth;
