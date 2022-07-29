require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const { stringify } = require("querystring");
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/subscribe", async (req, res) => {
  if (!req.body.captcha)
    return res
      .status(400)
      .json({ success: false, msg: "Please select captcha" });

  // Secret key
  const secretKey = process.env["RECAPTCHA_SECRET_KEY"];

  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress,
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then((res) => res.json());

  // If not successful
  if (body.success !== undefined && !body.success)
    return res
      .status(400)
      .json({ success: false, msg: "Captcha verification failed." });

  // If successful
  return res.status(200).json({ success: true, msg: "Captcha passed." });
});

app.listen(3000, () => console.log("Server started on port 3000"));
