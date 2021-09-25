require("dotenv").config();
require("./mongodb");
const express = require("express");
const cors = require("cors");
const logger = require("./loggerMiddleware");
const Img = require("./models/Img");
const multer = require("multer");
const fs = require("fs");
const { connection } = require("mongoose");
const app = express();
const upload = multer({ dest: "uploads/" });
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (request, response, next) => {
  response.send(
    "<form action='/api/upload' enctype='multipart/form-data' method='post'><input type='file' name='image'/><button name='submit' type='submit'>SUBMIT</button></form>"
  );
});

//upload image
app.post("/api/upload/", upload.single("image"), (req, response) => {
  const newImg = new Img();
  newImg.img.data = fs.readFileSync(req.file.path);
  newImg.img.contentType = "image/png";
  newImg
    .save()
    .then((res) => {
      response.status(200).json({ received: 200, id: res._id });
    })
    .catch((e) => console.error(e));
});

//request image by id
app.get("/api/images/:id", (request, response) => {
  Img.findOne(ObjectId(request.params.id))
    .then((res) => {
      response.status(302).type("image/png").send(res.img.data);
    })
    .catch((err) =>
      response.status(404).json({ error: "No images with this id" })
    );
});

//404 fallback
app.use((request, response) => {
  response.status(404).json({ error: "Image not found" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`hosteando en ${PORT}`));
