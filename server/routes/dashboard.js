const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

//all todos and name

router.get("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT u.user_name, t.todo_id, t.description, t.category_id, t.deadline, c.name AS category_name " +
        "FROM users AS u " +
        "LEFT JOIN todos AS t ON u.user_id = t.user_id " +
        "LEFT JOIN categories AS c ON t.category_id = c.category_id " +
        "WHERE u.user_id = $1",
      [req.user.id]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//get all categories

router.get("/categories", async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories");
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//create a todo

router.post("/todos", authorize, async (req, res) => {
  try {
    console.log(req.body);
    const { description, category_id, deadline } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (user_id, description, category_id, deadline) VALUES($1, $2, $3, $4) RETURNING *",
      [req.user.id, description, category_id, deadline]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

router.put("/todos/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category_id, deadline } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todos SET description = $1, category_id = $2, deadline = $3 WHERE todo_id = $4 AND user_id = $5 RETURNING *",
      [description, category_id, deadline, id, req.user.id]
    );

    if (updateTodo.rows.length === 0) {
      return res.json("This todo is not yours");
    }

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

router.delete("/todos/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deleteTodo.rows.length === 0) {
      return res.json("This Todo is not yours");
    }

    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
