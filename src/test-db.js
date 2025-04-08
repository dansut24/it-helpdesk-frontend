const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "it_helpdesk",
  connectTimeout: 5000, // 5 seconds max
});

db.connect((err) => {
  if (err) {
    console.error("❌ Connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL");

  db.query("SELECT 1", (err, result) => {
    if (err) {
      console.error("❌ Query error:", err);
    } else {
      console.log("✅ Basic query success:", result);
    }
    db.end();
  });
});
