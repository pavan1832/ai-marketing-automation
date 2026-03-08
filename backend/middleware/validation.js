/**
 * Validation middleware for API requests
 */

exports.validateLead = (req, res, next) => {
  const { name, email, company, industry, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
  if (!company || company.trim().length < 2) errors.push("Company name is required");
  if (!industry) errors.push("Industry is required");
  if (!message || message.trim().length < 10) errors.push("Message must be at least 10 characters");

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }
  next();
};

exports.validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};
