const express = require("express");

const app = express();

app.use(`/test`, (req, res) => {
  res.send(`This is the test api endpoint`);
});

app.use(`/hello`, (req, res) => {
  res.send(`This is the hello api endpoint`);
});

app.listen(3333, () => {
  console.log(`Server started and listening on.....`);
});
