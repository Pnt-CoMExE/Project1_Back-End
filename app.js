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
    // Write your code here
    
// Delete expenses
    // Write your code here
    app.delete('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;

    const sql = "DELETE FROM expense WHERE id = ?";
    con.query(sql, [expenseId], (err, result) => {
        if (err) {
            return res.status(500).send("Delete failed. An error occurred."); // ตรวยสอบ error จากการลบข้อมูล และ จะส่ง error กลับไปให้ client
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("You can't find this item."); // === 0 คือถ้าไม่มีแถวไหนถูกลบ จะออกจากฟังก์ชัน และ ส่งข้อความนว่าไม่พบของครับ
        }

        res.json({ 
            success: true, 
            message: "The item was successfully deleted.", 
            id: expenseId 
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running at ' + PORT);
});