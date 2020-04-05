var express = require("express");
const validator = require("validator");
const authService = require("../services/auth.services");

// const acl = require("express-acl");

var router = express.Router();
const models = require("../db/models");

// acl.config({
//   //specify your own baseUrl
//   filename: "nacl.json",
//   baseUrl: "/asd"
// });
// router.use(acl.authorize);
// /* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("respond with a resource");
// });
/* POST users . */
router.post("/register", async (req, res, next) => {
  let result = {};
  let errors = [];
  const {
    email,
    password,
    userName,
    address,
    roleName,
    roledescription
  } = req.body;
  await models.User.create(
    {
      email,
      password,
      DbaRole: {
        roleName,
        roledescription
      },
      UserDetail: {
        userName,
        address
      }
    },
    {
      include: { model: (models.UserDetail, models.DbaRole) }
    }
  )
    .then(newUser => {
      result.response = "Success";
      result.userId = newUser.id;
    })
    .catch(error => {
      result.errors = errors;
      return res.status(200).send(result);
    });
  res.status(200).send("respond with a post resource");
});
//ROUTER login
router.post("/login", async (req, res, next) => {
  let result = {};
  let errors = [];

  // if (!req.is("application/json")) {
  //   errors.push({ msg: "Expects 'application/json'" });
  //   return res.status(400).send(errors);
  // }

  /** Email and Password Validation */
  if (validator.isEmpty(req.body.email)) {
    errors.push({ msg: "Please enter a valid email." });
  }

  if (validator.isEmpty(req.body.password)) {
    errors.push({ msg: "Please enter a password." });
  }

  if (errors.length > 0) {
    result.response = "error";
    result.errors = errors;
    return res.status(400).send(result);
  }

  try {
    await authService.authUser(req.body, (err, data) => {
      if (err) {
        errors.push({ msg: err });
        result.response = "errors";
        result.errors = errors;
        return res.status(200).send(result);
      }
      // no user
      if (data.response === "errors") {
        errors.push({ msg: "Please check email/password" });
        result.response = "errors";
        result.errors = errors;
        return res.status(200).send(result);
      }
      res.status(200).send(data);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
