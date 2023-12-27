import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, CardHeader } from "reactstrap";

//components

import InputTodo from "./todolist/InputTodo";
import ListTodos from "./todolist/ListTodos";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const [todosChange, setTodosChange] = useState(false);

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      const parseData = await res.json();

      setAllTodos(parseData);

      setName(parseData[0].user_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    setTodosChange(false);
  }, [todosChange]);

  return (
    <>
      <Container
        fluid
        className="navbar text-white pt-5"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#17212B",
        }}
      >
        <div className="container">
          <h3>{name}'s To-Do List</h3>

          <button onClick={(e) => logout(e)} className="btn btn-primary">
            Logout
          </button>
        </div>
      </Container>

      <div className="container">
        <Container className="mt-4" fluid>
          <Row>
            <Col xl="12">
              <Card className="shadow mb-4">
                <CardHeader className="border-0">
                  <InputTodo setTodosChange={setTodosChange} />
                </CardHeader>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <ListTodos
                    allTodos={allTodos}
                    setTodosChange={setTodosChange}
                  />
                </CardHeader>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
