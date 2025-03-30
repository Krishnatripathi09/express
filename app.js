const express = require("express");
const { adminAuth } = require("./middlewares/admin");
const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});

app.get("/admin", adminAuth, (req, res) => {
  res.send("I am Admin Data ");
});
