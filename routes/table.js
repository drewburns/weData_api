var express = require("express");
const column = require("../models/column");
var router = express.Router();

const Project = require("../models").Project;
const User = require("../models").User;
const Company = require("../models").Company;
const Query = require("../models").Query;
const Column = require("../models").Column;
const DataPoint = require("../models").DataPoint;

const { authenticateJWT } = require("../middleware/auth");

// router.get("/")
router.post("/upsertQuery", authenticateJWT, async function (req, res, next) {
  const { query_id, link, p_key, name, project_id } = req.body;
  // when the p_key changes, we will need to cascade delete all the data points
  // or maybe we dont let them change the p_key?

  const [record, created] = await Query.upsert(
    { id: query_id, name, p_key, link, project_id }, // Record to upsert
    { returning: true } // Return upserted record
  );

  // maybe do something before this?
  // cascade delete if p_key changed?
  res.json(record);
});

router.post("/createColumn", authenticateJWT, async function (req, res, next) {
  const { query_id, name } = req.body;

  const newColumn = await Column.create({ query_id, name });

  res.json(newColumn);
});

router.post("/upsertDataPoint", authenticateJWT, async function (
  req,
  res,
  next
) {
  var { p_key_value, column_id, value } = req.body;
  p_key_value = p_key_value.toString();
  const dataPoint = await DataPoint.findOne({
    where: { p_key_value, column_id },
  });

  if (dataPoint) {
    await dataPoint.update({ value });
    res.json("OK");
  } else {
    const newDataPoint = await DataPoint.create({
      p_key_value,
      column_id,
      value,
    });
    res.json("OK");
  }
  // const [record, created] = await DataPoint.upsert(
  //   { id, p_key_value, column_id, value }, // Record to upsert
  //   { returning: true } // Return upserted record
  // );

  // res.json(record);
});

router.get("/dataForPKeysColumns", authenticateJWT, async function (
  req,
  res,
  next
) {
  // need p_key_value and column_id to find values;
  console.log(req.query);
  var { p_key_values, column_ids } = req.query;
  p_key_values = p_key_values.split(",");
  column_ids = column_ids.split(",");

  console.log("here!");
  const dataPoints = await DataPoint.findAll({
    where: {
      column_id: column_ids,
      p_key_value: p_key_values,
    },
  });

  res.json(dataPoints);
});

module.exports = router;
