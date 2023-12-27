import React, { useState, useEffect } from "react";

const InputTodo = ({ setTodosChange }) => {
  const [description, setDescription] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/dashboard/categories",
          {
            method: "GET",
            headers: { jwt_token: localStorage.token },
          }
        );
        const jsonData = await response.json();
        setCategories(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("jwt_token", localStorage.token);

      const body = { description, category_id, deadline };
      const response = await fetch("http://localhost:5000/dashboard/todos", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();

      console.log(parseResponse);

      setTodosChange(true);
      setDescription("");
      setCategoryId("");
      setDeadline("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h5 className="text-center">Create a New Task</h5>
      <form className="d-flex mt-3 mb-3 " onSubmit={onSubmitForm}>
        <input
          type="text"
          placeholder="Add Description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="form-control"
          value={category_id}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="form-control"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>
    </>
  );
};

export default InputTodo;
