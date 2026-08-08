const joi = require("joi");

function validateLoginRequest() {
  const loginSchema = joi.object({
    password: joi.string().min(3).required(),
    email: joi.string().email().required(),
  });
  return loginSchema;
}

module.exports = validateLoginRequest;
