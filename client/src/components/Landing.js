import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="container">
      <div className="jumbotron mt-5">
        <h1>Task Manager</h1>
        <p>Sign in and start building your to-do list</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary ml-3">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
