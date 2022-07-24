const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "." + file.mimetype.split("/")[1]);
  },
});

module.exports = multer({ storage: storage });
