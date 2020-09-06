const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
require("../config/passport")(passport);
// const User = require("../models").User;
const { User, CompanyMember, Company, Template } = require("../models");

const { authenticateJWT } = require("../middleware/auth");

/* GET templates . */
router.get("/", authenticateJWT, async function (req, res, next) {
  // get the company_id of the user
  // TODO: extract this out. I keep reusing it.
  const userMembership = await CompanyMember.findOne({
    where: { user_id: req.user.id },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent in a company" });
    return;
  }

  const templates = await Template.findAll({
    where: { company_id: userMembership.Company.id },
    order: [["createdAt", "DESC"]],
    include: [{ model: User, attributes: { exclude: ["password"] } }],
  });

  if (!templates) {
    res.status(400).json({ msg: "Error" });
    return;
  }

  res.json(templates);
});

router.post("/create", authenticateJWT, async function (req, res, next) {
  const { name, link, primary_key, description } = req.body;
  if (!name || !link || !primary_key) {
    res.status(500).json({ msg: "Bad input" });
  }
  const userMembership = await CompanyMember.findOne({
    where: { user_id: req.user.id },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent in a company" });
    return;
  }

  const newTemplate = await Template.create({
    name,
    link,
    description,
    primary_key,
    creating_user_id: req.user.id,
    company_id: userMembership.Company.id,
  });

  if (!newTemplate) {
    res.status(500).json({ msg: "Error creating template" });
    return;
  }

  res.json(newTemplate);
});

module.exports = router;
