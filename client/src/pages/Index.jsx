
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Flight Booking</title>
      </Helmet>
      <div className="h-full w-full justify-center align-center">
        <div className="flex flex-col items-center justify-items-center m-5">
          <h1 className="text-[4rem]">Welcome! Book Flights Easily</h1>
          <Link to="/login">
            <button className="bg-blue-800 text-white p-2">Get Started</button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Index;
