require("dotenv").config();
require("./mongodb");
const express = require("express");
const cors = require("cors");
const logger = require("./loggerMiddleware");
const Img = require("./models/Img");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (request, response, next) => {
  response.send(
    "<form action='/api/upload' enctype='multipart/form-data' method='post'><input type='file' name='image'/><button name='submit' type='submit'>SUBMIT</button></form>"
  );
});

//upload image
app.post("/api/upload", upload.single("image"), (req, response) => {
  const newImg = new Img();
  console.log(req.file.path);
  newImg.img.data = fs.readFileSync(req.file.path);
  newImg.img.contentType = "image/png";
  newImg
    .save()
    .then((res) => {
      response.status(200).json({ received: 200, id: res._id });
      fs.unlinkSync(req.file.path);
    })
    .catch((e) => console.error(e));
});

//request image by id
app.get("/api/images/:id", (request, response) => {
  Img.findById(request.params.id)
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`hosteando en ${PORT}`));
