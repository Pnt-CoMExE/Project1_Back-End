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
app.get('/expenses/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT id, item, paid, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date FROM expense WHERE user_id = ? ORDER BY date DESC"; // Y 4 หลัก . m,d,h,i,s 2 หลัก 
    con.query(sql, [userId], function(err, results) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});


// Show today's expenses
    // Write your code here

// Search expenses
    // Write your code here

// Add new expenses
    // Write your code here
    
// Delete expenses
    // Write your code here

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running at ' + PORT);
});