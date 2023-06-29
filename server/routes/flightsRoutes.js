const express = require("express");
const router = express();

const {
  AddFlight,
  GetAllFlights,
  UpdateFlight,
  DeleteFlight,
  GetFlightById,
  GetFlightsByFromAndTo,
} = require("../Controllers/flightController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-flight", authMiddleware, AddFlight);
router.post("/get-all-flights", authMiddleware, GetAllFlights);
router.put("/:id", authMiddleware, UpdateFlight);
router.delete("/:id", authMiddleware, DeleteFlight);
router.get("/:id", authMiddleware, GetFlightById);
router.post("/get", authMiddleware, GetFlightsByFromAndTo);

module.exports = router;
