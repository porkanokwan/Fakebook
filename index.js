require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { sequelize } = require("./models");
sequelize.sync({ force: true });

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const friendRoute = require("./routes/friendRoute");

const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/notFound");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/comment", commentRoute);
app.use("/friends", friendRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server start port 8004...."));
