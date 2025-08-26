const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const con = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT id, password FROM users WHERE username = ?";
    con.query(sql, [username], function(err, results) {
        if (err) return res.status(500).send("Database server error");
        if (results.length != 1) return res.status(401).send("Wrong username");

        bcrypt.compare(password, results[0].password, function(err, same) {
            if (err) return res.status(500).send("Hashing error");
            if (same) return res.json({ userId: results[0].id });
            return res.status(401).send("Wrong password");
        });
    });
});

// Show all expenses
    // Write your code here

// Show today's expenses
    // Write your code here

// Search expenses
    // Write your code here

// Add new expenses
    app.post("/expenses/add/:userId", (req, res) => {
  const userIdParam = req.params.userId;
  const { item, paid } = req.body ?? {};

  if (!userIdParam ||  !item || paid === undefined) {
    return res.status(400).json({ message: "Missing required fields: userId(param), item, paid" });
  }

  const amount = Number(paid);
  if (!Number.isFinite(amount)) {
    return res.status(400).json({ message: "paid must be a number" });
  }


  const sql = "INSERT INTO expense (user_id, item, paid, date) VALUES (?, ?, ?, NOW())";
  con.query(sql, [userIdParam, item, amount], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error", detail: err.message });
    }
    res.status(201).json({ message: "Expense added successfully", id: result.insertId });
  });
});

    
// Delete expenses
    // Write your code here

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running at ' + PORT);
});