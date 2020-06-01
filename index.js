const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// connect to Mongo and set application js
connectDB();
app.use(cors());
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

// import routes
app.use("/api/user", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyects", require("./routes/proyects"));
app.use("/api/tasks", require("./routes/tasks"));

app.listen(PORT, () => {
  // console.log(`run in ${PORT}`)
});
