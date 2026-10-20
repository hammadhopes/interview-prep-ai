const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware.js");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// REQUIRING ROUTES
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes.js");

// USING ROUTES
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// SERVE FRONTEND (production build)
const frontendDist = path.join(__dirname, "../../Frontend/dist");

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    // Any non-API route returns the React app so page refreshes work
    app.get("/{*splat}", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

// ERROR HANDLING (must come after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;