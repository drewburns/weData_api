var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/fakeData1", function (req, res, next) {
  const fakeData = [
    {
      shipmentID: 7,
      arrivalDate: "June 3,2020 4:40PM EST",
      port: "Los Angeles",
    },
    { shipmentID: 2, arrivalDate: "June 3,2020 4:40PM EST", port: "Newark" },
    { shipmentID: 3, arrivalDate: "June 3,2020 4:43PM EST", port: "Busan" },
    { shipmentID: 4, arrivalDate: "June 4,2020 4:45PM EST", port: "Busan" },
    { shipmentID: 5, arrivalDate: "June 4,2020 4:45PM EST", port: "Singapore" },
    { shipmentID: 6, arrivalDate: "June 4,2020 4:45PM EST", port: "Hong Kong" },
  ];
  res.json(fakeData);
});

module.exports = router;
