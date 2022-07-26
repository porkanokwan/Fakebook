module.exports = (err, req, res, next) => {
  console.log(err);
  // check case ที่ error เพื่อดูว่ามี error name อะไรบ้าง
  console.log(err.name);
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.statusCode = 400;
    err.message = err.errors[0].message;
  }
  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
  }
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }
  res.status(err.statusCode || 500).json({ message: err.message });
};
