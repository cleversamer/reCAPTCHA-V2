require("dotenv").config();
const request = require("request");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/subscribe", (req, res, next) => {
  const { captcha } = req.body;
  if (!captcha) {
    res.status(400).json({ success: false, mssg: "Please select captcha." });
  }

  const secretKey = process.env["RECAPTCHA_SECRET_KEY"];
  const remoteIp = req.connection.remoteAddress;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${remoteIp}`;

  request(verifyUrl, (err, res, body) => {
    body = JSON.parse(body);

    if (!body.success) {
      return res
        .status(400)
        .json({ success: false, mssg: "CAPTCHA select failed." });
    }

    res.status(200).json({ success: true, mssg: "CAPTCHA select succeeded." });
  });
});

const port = process.env["PORT"] || 3000;
app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
