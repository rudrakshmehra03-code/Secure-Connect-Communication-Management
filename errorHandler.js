function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({ message: "Email already registered" });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID or data format" });
  }

  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
}

module.exports = errorHandler;
