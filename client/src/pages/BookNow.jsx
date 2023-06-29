import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import StripeCheckout from "react-stripe-checkout";
import { Helmet } from "react-helmet";
import moment from "moment";
import base_url from "../assets/url";

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [flight, setFlight] = useState(null);

  const getFlight = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`${base_url}/api/flights/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setFlight(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `${base_url}/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          flight: flight._id,
          seats: selectedSeats,
          transactionId,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(`${base_url}/api/bookings/make-payment`, {
        token,
        amount: selectedSeats.length * flight.price,
      });

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getFlight();
  }, [getFlight]);
  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {flight && (
          <Row className="m-3 p-5" gutter={[30, 30]}>
            <Col lg={12} xs={24} sm={24}>
              <h1 className="font-extrabold text-2xl text-blue-500">
                {flight.name}
              </h1>
              <h1 className="text-2xl font-bold">
                {flight.from} - {flight.to}
              </h1>
              <hr className="border-black" />

              <div className="flex flex-col gap-1 ">
                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Journey Date : </b>
                  <span className="">{flight.journeyDate}</span>
                </h1>

                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Price :</b> DH {flight.price}{" "}
                  /-
                </h1>
                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Departure Time</b> :{" "}
                  {moment(flight.departure, "HH:mm").format("hh:mm A")}
                </h1>
                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Arrival Time</b> :{" "}
                  {moment(flight.arrival, "HH:mm").format("hh:mm A")}
                </h1>
              </div>
              <hr className="border-black" />

              <div className="flex w-60 flex-col ">
                <h1 className="text-lg mt-2 font-bold">
                  <span className="text-blue-600 italic">Capacity : </span>{" "}
                  <p>{flight.capacity}</p>
                </h1>
                <h1 className="text-lg font-bold">
                  <span className="text-blue-600 italic">Seats Left : </span>{" "}
                  <p>{flight.capacity - flight.seatsBooked.length}</p>
                </h1>
              </div>
              <hr className="border-black" />

              <div className="flex flex-col gap-2 w-48 ">
                <h1 className="text-xl">
                  <b className="text-blue-600 italic">Selected Seats : </b>{" "}
                  {selectedSeats.join(", ")}
                </h1>
                <h1 className="text-xl mt-2 mb-3">
                  <b className="text-blue-600 italic"> Price :</b> DH{" "}
                  {flight.price * selectedSeats.length}
                </h1>

                <StripeCheckout
                  billingAddress
                  disabled={selectedSeats.length === 0}
                  token={onToken}
                  amount={flight.price * selectedSeats.length * 100}
                  currency="MAD"
                  stripeKey="pk_test_51NOHnDSHQtB1Sw9fGICcjNoMQrSq7bspEnKF9JuEuw9TjTGLO1RFGTQ1BWpHxHeMFL8ILMGLN760TgFqBAgTn8W200VzfssXPQ"
                >
                  <button
                    className={`${selectedSeats.length === 0
                      ? "animate-none cursor-not-allowed btn btn-primary py-2 px-5 rounded-full btn-disabled text-white"
                      : "animate-bounce btn btn-primary py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-800 hover:duration-300 text-white"
                      }`}
                  >
                    Pay Now
                  </button>
                </StripeCheckout>
              </div>
            </Col>
            <Col lg={12} xs={24} sm={24}>
              <SeatSelection
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                flight={flight}
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
