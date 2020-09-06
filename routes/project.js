const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
// require('../config/passport')(passport);
// const User = require("../models").User;
const Project = require("../models").Project;
const User = require("../models").User;
const Company = require("../models").Company;
const Query = require("../models").Query;
const CompanyMember = require("../models").CompanyMember;
const Column = require("../models").Column;

const { authenticateJWT } = require("../middleware/auth");
const { createQueryFromTemplate } = require("../helpers/project");
const ProjectParticipant = require("../models").ProjectParticipant;

/* GET users listing. */
router.get("/", authenticateJWT, async function (req, res, next) {
  const userMembership = await CompanyMember.findOne({
    where: { user_id: req.user.id },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent in a company" });
    return;
  }

  // TODO: manipulate
  const companiesProjects = await ProjectParticipant.findAll({
    where: { company_id: userMembership.Company.id },
  });

  const projects = await Project.findAll({
    where: { id: companiesProjects.map((c) => c.project_id) },
    order: [["createdAt", "DESC"]],
    include: [{ model: ProjectParticipant, include: Company }],
  });

  res.json(projects);
});

router.post("/create", authenticateJWT, async function (req, res, next) {
  const { name, company_ids, template_id } = req.body;
  // get the company_id of the user
  const userMembership = await CompanyMember.findOne({
    where: { user_id: req.user.id },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent in a company" });
    return;
  }

  // uses the company id of only the company they are a part of
  const newProject = await Project.create({
    name,
    owner_company_id: userMembership.Company.id,
  });

  //   console.log(newProject);
  // create for the requesting user
  await ProjectParticipant.create({
    company_id: userMembership.Company.id,
    project_id: newProject.id,
  });

  // now create participants in the project
  //TODO: dont allow company to be added twice!
  await Promise.all(
    company_ids.map((company_id) => {
      ProjectParticipant.create({ company_id, project_id: newProject.id });
    })
  );
  //   );

  const projectWithParticipants = await Project.findOne({
    where: { id: newProject.id },
    include: [{ model: ProjectParticipant, include: Company }],
  });

  if (template_id) {
    const newQuery = await createQueryFromTemplate(newProject, template_id);
    if (newQuery.error) {
      res.status(500).json({ msg: "Error making query" });
      return;
    }
  }
  res.json(projectWithParticipants);
});

router.get("/:projectID", authenticateJWT, async function (req, res, next) {
  // get the company_id of the user
  const userMembership = await CompanyMember.findOne({
    where: { user_id: req.user.id },
    include: Company,
  });

  if (!userMembership) {
    res.status(400).json({ msg: "You arent in a company" });
    return;
  }

  const project = await Project.findOne({
    where: { id: req.params.projectID },
    include: [
      { model: ProjectParticipant, include: Company },
      { model: Query, include: [Column] },
    ],
  });

  if (!project) {
    res.status(400).json({ msg: "Project doesnt exist" });
    return;
  }

  const companiesInProject = project.ProjectParticipants.map(
    (p) => p.Company.id
  );

  if (!companiesInProject.includes(userMembership.Company.id)) {
    res.status(400).json({ msg: "You arent in this project" });
    return;
  }

  res.json(project);
});

module.exports = router;
