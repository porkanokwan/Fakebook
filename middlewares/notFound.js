module.exports = (req, res) => {
  res.status(404).json({ message: "Resource not found on this server" });
};
