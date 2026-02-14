const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


const errorHandler = require("./middleware/error.middleware"); 


const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://*.vercel.app"
  ],
  credentials: true
}));

// test route
app.get("/", (req, res) => {
    res.send("Tenant Management API running...");
});

// routes 
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/roles", require("./routes/roles.routes"));
app.use("/api/sites", require("./routes/sites.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

app.use(errorHandler);


module.exports = app;
