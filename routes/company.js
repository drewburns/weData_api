var express = require("express");
var router = express.Router();
// require("../config/passport")(passport);
const Company = require("../models").Company;
const User = require("../models").User;
const CompanyMember = require("../models").CompanyMember;
const { authenticateJWT } = require("../middleware/auth");

router.get("/all", authenticateJWT, async function (req, res, next) {
  const companies = await Company.findAll({});
  res.json({ companies });
});
router.get("/", authenticateJWT, async function (req, res, next) {
  const userMembership = await CompanyMember.findOne({
    where: {
      user_id: req.user.id,
    },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent" });
    return;
  }
  res.json({ company: userMembership.Company });
});

router.post("/create", authenticateJWT, async function (req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ msg: "Please name." });
    return;
  }
  // check if they are already part of a company
  const existingCompany = await CompanyMember.findOne({
    where: {
      user_id: req.user.id,
    },
  });

  if (existingCompany) {
    res.status(400).json({ msg: "You are already part of a company" });
    return;
  }

  const company = await Company.create({
    name: req.body.name,
  });

  const newMember = await CompanyMember.create({
    user_id: req.user.id,
    company_id: company.id,
  });

  console.log(newMember);
  res.json({ company });
});

router.post("/addMember", authenticateJWT, async function (req, res, next) {
  // TODO: check if this requesting user is part of company
  if (!req.body.email || !req.body.company_id) {
    res.status(400).json({ msg: "Please give user." });
    return;
  }

  const userWithEmail = await User.findOne({
    where: { email: req.body.email },
  });
  if (!userWithEmail) {
    res.status(400).json({ msg: "That user does not exist" });
    return;
  }
  //   console.log(userWithEmail);

  // TODO: add sql unique for this
  const doesMemberExist = await CompanyMember.findOne({
    where: {
      user_id: userWithEmail.id,
      // company_id: req.body.company_id,
    },
  });
  if (doesMemberExist) {
    res.status(400).json({ msg: "User already on team" });
    return;
  }

  const newMember = await CompanyMember.create({
    user_id: userWithEmail.id,
    company_id: req.body.company_id,
  });

  if (!newMember) {
    res.status(400).json({ msg: "Error" });
    return;
  }
  res.json("OK");
});

router.get("/members/:companyID", authenticateJWT, async function (
  req,
  res,
  next
) {
  const doesMemberExist = await CompanyMember.findOne({
    where: {
      user_id: req.user.id,
      company_id: req.params.companyID,
    },
  });
  if (!doesMemberExist) {
    res.status(400).json({ msg: "You are not on this team" });
    return;
  }

  var members = await CompanyMember.findAll({
    where: { company_id: req.params.companyID },
    include: { model: User, as: "User", attributes: { exclude: ["password"] } },
  });
  members = members.map((m) => m.User);

  res.json({ members });
});
module.exports = router;
