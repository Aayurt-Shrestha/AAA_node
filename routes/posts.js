var express = require("express");
const validator = require("validator");
const authService = require("../services/auth.services");
var router = express.Router();
const models = require("../db/models");
const acl = require("express-acl");
acl.config({
  //specify your own baseUrl
  filename: "nacl.json",
  baseUrl: "/posts"
});
router.use(acl.authorize);

router.post("/add", async (req, res, next) => {
  let result = {};
  let errors = [];
  const { title, description, userId } = req.body;
  await models.Post.create({
    title,
    description,
    userId
  })
    .then(newPost => {
      result.response = "Success";
    })
    .catch(error => {
      result.errors = errors;
      return res.status(400).send(result);
    });
  res.status(200).send("Post Successful");
});
router.get("/", async (req, res, next) => {
  let result = {};
  let errors = [];
  //changes need to be done
  try {
    await models.Post.findAll({
      include: {
        model: Subcategory,
        as: "CategorySubcategories",
        attributes: ["id", "name"],
        include: {
          model: Topic,
          as: "SubcategoryTopic",
          attributes: ["id", "topic"]
        }
      }
    })
      .then(posts => {
        result.response = "success";
        result.post = posts;
        res.status(200).send(result);
      })
      .catch(err => {
        console.log("Could not find Category with given id. ", err);
      });
  } catch (err) {
    console.log("error", err);
    next(err);
  }
});
module.exports = router;
