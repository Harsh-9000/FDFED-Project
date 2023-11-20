import express from "express";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3006",
//     credentials: true,
//   })
// );
app.use("/", express.static("uploads"));
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}

// Routes
import passwordAuthRoutes from "./routes/passwordAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import proprietorRoutes from "./routes/proprietorRoutes.js";

app.use("/api/v2/auth", passwordAuthRoutes);
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/proprietor", proprietorRoutes);

// it's for ErrorHandling
app.use(ErrorHandler);

export default app;
