import React, { useState, useEffect } from "react";

const EditTodo = ({ todo, setTodosChange }) => {
  const [description, setDescription] = useState(todo.description);
  const [deadline, setDeadline] = useState(todo.deadline);
  const [category_id, setCategoryId] = useState(todo.category_id);
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

  //edit description function

  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const body = { description, category_id, deadline };

      const myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("jwt_token", localStorage.token);

      await fetch(`http://localhost:5000/dashboard/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      setTodosChange(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  // This function will be triggered when the modal is about to be shown
  const onOpenModal = () => {
    setDescription(todo.description);
    setDeadline(todo.deadline ? todo.deadline.split("T")[0] : "");
    setCategoryId(todo.category_id);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
        onClick={onOpenModal} // Set the state to the current todo when opening the modal
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo.todo_id}`}
        onClick={() => setDescription(todo.description)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setDescription(todo.description)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
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
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
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
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateDescription(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setDescription(todo.description)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTodo;
