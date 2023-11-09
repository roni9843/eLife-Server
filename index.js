const express = require("express");
const cors = require("cors");
const globalError = require("./error/error");
const connectDb = require("./db/db");
const config = require("./config/config");
const auth = require("./middleware/auth");
const router = require("./routes/index");
const morgan = require("morgan");

// ^ create app
const app = express();

// ^ use middleware
app.use(cors());
app.use(express.json());
app.use(router);
app.use(morgan("combined"));
// ^ custom middleware

// ! global err
app.use(globalError);

// * private route
app.get("/private", auth, (req, res) => {
  return res.status(200).json({
    message: "i am private route",
  });
});

//? create root route
app.get("/", (req, res) => {
  res.send({
    message: "this is root route",
  });
});

// ? mongodb connect
connectDb(config.DB_CONN)
  .then(() => {
    console.log("database connected");
    // app lister
    app.listen(config.PORT, () => {
      console.log(`server is running at ${config.PORT}`);
    });
  })
  .catch((e) => console.log(e));
