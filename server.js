const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// temporary storage (prototype)
const links = {};

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// create short link
app.post("/shorten", (req, res) => {
  const { url } = req.body;
  const code = Math.random().toString(36).slice(2, 8);
  links[code] = url;
  res.json({ code });
});

// open short link → warning page
app.get("/s/:code", (req, res) => {
  if (!links[req.params.code]) {
    return res.send("Invalid link");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// resolve original url
app.get("/resolve/:code", (req, res) => {
  const url = links[req.params.code];
  if (!url) return res.status(404).json({ error: "Not found" });
  res.json({ url });
});

app.listen(PORT, () => {
  console.log("Server running");
});

