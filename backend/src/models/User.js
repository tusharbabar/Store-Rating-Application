const { validateFields } = require('../utils/validators');

const validateUserFields = (data, isSignupOrCreate = false) => {
  return validateFields({ ...data, isSignupOrCreate });
};

module.exports = { validateUserFields };
