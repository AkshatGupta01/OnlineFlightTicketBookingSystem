const Flight = require("../models/flightModel");

// Add a new flight
const AddFlight = async (req, res) => {
  try {
    const existingFlight = await Flight.findOne({ flightNumber: req.body.flightNumber });
    existingFlight
      ? res.send({ message: "Flight already exists", success: false, data: null })
      : await new Flight(req.body).save();

    res.status(200).send({
      message: "Flight created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all flights and if the journeyDate is passed 1 hour ago , make the status of the flight to "Completed"
const GetAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    flights.forEach(async (flight) => {
      const journey = new Date(flight.journeyDate);

      const departure = new Date(
        `${journey.getFullYear()}-${journey.getMonth() + 1
        }-${journey.getDate()} ${flight.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await flight.findByIdAndUpdate(flight._id, { status: "Completed" });
      }
      // console.log("departure time is : ", departure);
    });

    const orderedFlights = flights.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      } else if (a.status !== "Completed" && b.status === "Completed") {
        return -1;
      } else {
        return new Date(a.journeyDate) - new Date(b.journeyDate);
      }
    });

    res.status(200).send({
      message: "Flights fetched successfully",
      success: true,
      data: orderedFlights,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Flights Found",
      success: false,
      data: error,
    });
  }
};

// get all flights by from and to
const GetFlightsByFromAndTo = async (req, res) => {
  try {
    const flights = await Flight.find({
      from: req.query.from,
      to: req.query.to,
      journeyDate: req.query.journeyDate,
    });

    flights.forEach(async (flight) => {
      const journey = new Date(flight.journeyDate);
      const departure = new Date(
        `${journey.getFullYear()}-${journey.getMonth() + 1
        }-${journey.getDate()} ${flight.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await Flight.findByIdAndUpdate(flight._id, { status: "Completed" });
      }
    });

    const filteredFlights = flights.filter(
      (flight) => flight.status !== "Completed" && flight.status !== "Running"
    );
    res.status(200).send({
      message: "flights fetched successfully",
      success: true,
      data: filteredFlights,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Flights Found",
      success: false,
      data: error,
    });
  }
};

// update a flight
const UpdateFlight = async (req, res) => {
  // if the flight is completed , you can't update it
  const flight = await Flight.findById(req.params.id);
  if (flight.status === "Completed") {
    res.status(400).send({
      message: "You can't update a completed flight",
      success: false,
    });
  } else {
    try {
      await flight.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).send({
        message: "Flight updated successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: "Flight not found",
        success: false,
        data: error,
      });
    }
  }
};

// delete a flight
const DeleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Flight deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get flight by id
const GetFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    res.status(200).send({
      message: "Flight fetched successfully",
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddFlight,
  GetAllFlights,
  UpdateFlight,
  DeleteFlight,
  GetFlightById,
  GetFlightsByFromAndTo,
};
