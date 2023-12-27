import React, { useEffect, useState } from "react";

import EditTodo from "./EditTodo";

const ListTodos = ({ allTodos, setTodosChange }) => {
  const [sortDirection, setSortDirection] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
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

  useEffect(() => {
    const savedFilterCriteria = localStorage.getItem("filterCriteria");
    const savedSortDirection = localStorage.getItem("sortDirection");
    if (savedFilterCriteria) setFilterCriteria(savedFilterCriteria);
    if (savedSortDirection) setSortDirection(savedSortDirection);
  }, []);

  useEffect(() => {
    localStorage.setItem("filterCriteria", filterCriteria);
    localStorage.setItem("sortDirection", sortDirection);
  }, [filterCriteria, sortDirection]);

  //delete todo function

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
        method: "DELETE",
        headers: { jwt_token: localStorage.token },
      });

      setTodosChange(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredTodos = allTodos.filter((todo) => {
    if (!filterCriteria || filterCriteria === "all") {
      return true;
    } else if (filterCriteria === "today") {
      const today = new Date().setHours(0, 0, 0, 0);
      const todoDate = new Date(todo.deadline).setHours(0, 0, 0, 0);
      return todoDate === today;
    } else {
      return todo.category_name === filterCriteria;
    }
  });

  let sortedTodos = filteredTodos;
  if (sortDirection === "asc" || sortDirection === "desc") {
    sortedTodos = filteredTodos.sort((a, b) => {
      return sortDirection === "asc"
        ? new Date(a.deadline) - new Date(b.deadline)
        : new Date(b.deadline) - new Date(a.deadline);
    });
  }

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterCriteria(value);
    if (value === "none") {
      localStorage.removeItem("filterCriteria");
    }
  };

  const handleSortChange = (e) => {
    setSortDirection(e.target.value);
    if (e.target.value === "none") {
      localStorage.removeItem("sortDirection");
    } else {
      localStorage.setItem("sortDirection", e.target.value);
    }
  };

  return (
    <>
      {" "}
      <div className="row mb-3 mt-3">
        <div className="d-flex justify-content-end align-items-center">
          <label htmlFor="sort" className="ml-2 d-flex mr-1">
            Filter by:
          </label>
          <select
            id="filter"
            className="form-control d-inline-block me-2"
            value={filterCriteria}
            onChange={handleFilterChange}
            style={{ width: "auto" }}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor="sort" className="d-flex ml-3 mr-1">
            Sort by:
          </label>
          <select
            id="sort"
            className="form-control d-inline-block"
            value={sortDirection}
            onChange={handleSortChange}
            style={{ width: "auto" }}
          >
            <option value="none">None</option>
            <option value="asc">Earliest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Deadline</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedTodos.length !== 0 &&
              sortedTodos[0].todo_id !== null &&
              sortedTodos.map((todo) => (
                <tr key={todo.todo_id}>
                  <td>{todo.description}</td>
                  <td>{todo.category_name}</td>
                  <td>
                    {todo.deadline
                      ? new Date(todo.deadline).toLocaleDateString()
                      : "No Deadline"}
                  </td>{" "}
                  <td>
                    <EditTodo todo={todo} setTodosChange={setTodosChange} />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTodo(todo.todo_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListTodos;
