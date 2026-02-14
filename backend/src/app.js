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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
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
