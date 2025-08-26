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
     app.get('/expenses/:userId/today', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM expense WHERE user_id = ? AND DATE(date) = CURDATE() ORDER BY date DESC";
  
  con.query(sql, [userId], function(err, results) {
    if (err) {
      return res.status(500).send("Database server error");
    }
    
    // คำนวณผลรวมค่าใช้จ่ายวันนี้
    const total = results.reduce((sum, row) => sum + row.paid, 0);

    res.json({
      expenses: results,
      total: total
    });
  });
});


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