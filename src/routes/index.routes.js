const routerPost = require("./post.routes.js");
const routerAuth = require("./auth.routes.js");
const routerUser = require("./user.routes.js");
const express = require("express");

const routes = (app) => {
  app.use(
    "/api",
    express.urlencoded({ extended: false }),
    express.json(),
    routerUser,
    routerPost
  ),
    app.use(
      "/auth",
      express.urlencoded({ extended: false }),
      express.json(),
      routerAuth
    );
};

module.exports = routes;
