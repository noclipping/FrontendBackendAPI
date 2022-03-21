const express = require("express");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500" }));

var jsonParser = bodyParser.json();

app.use(jsonParser);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
    currentTime: Date.now() % 23023,
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post Created",
        // authData below is taken from jwt.sign({user}) the {user} being the poyload
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res, next) => {
  // this is where you would do authentication with database
  console.log(req.body);
  if (req.body.name.length < 1 || req.body.email.length < 1) {
    res.status(404).send({ error: "username/email not long enough" });
    return next;
  }
  const user = {
    id: 1,
    username: req.body.name,
    email: req.body.email,
  };
  jwt.sign({ user }, "secretKey", { expiresIn: "2 days" }, (err, token) => {
    res.json({
      token,
    });
  });
});

// FORMAT OF TOKEN

// Authorization: Bearer <access_token>

function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // forbidden
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // set token in req object
    req.token = bearerToken;
    // Next middleware

    next();
  } else {
    res.sendStatus(403);
    // could send res.json({err:'custom err message'})
  }
  next();
}

app.listen(5000, () => console.log("Server started on port 5000"));
