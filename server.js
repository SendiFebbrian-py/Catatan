const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// serve semua file static dari folder root
app.use(express.static(path.join(__dirname)));

// default route → arahkan ke dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Dasboard", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
