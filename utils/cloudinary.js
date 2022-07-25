const util = require("util");
const cloudinary = require("cloudinary").v2;

// upload เก็บ promise obj ไว้ ทำให้เอาไปใช้ได้ง่ายขึ้น
exports.upload = util.promisify(cloudinary.uploader.upload);

// delete รูปที่ upload ใน cloudinary mem จะได้ไม่เต็ม
exports.destroy = util.promisify(cloudinary.uploader.destroy);
