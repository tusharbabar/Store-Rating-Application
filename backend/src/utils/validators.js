const validateFields = ({ name, email, password, address, isSignupOrCreate = false }) => {
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 20 || name.length > 60) {
      errors.push('Name must be between 20 and 60 characters long.');
    }
  } else if (isSignupOrCreate) {
    errors.push('Name is required.');
  }

  if (address !== undefined) {
    if (typeof address !== 'string' || address.length > 400 || address.length === 0) {
      errors.push('Address is required and must not exceed 400 characters.');
    }
  } else if (isSignupOrCreate) {
    errors.push('Address is required.');
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Must follow standard email validation rules.');
    }
  } else if (isSignupOrCreate) {
    errors.push('Email is required.');
  }

  if (password !== undefined) {
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length < 8 || password.length > 16 || !hasUpper || !hasSpecial) {
      errors.push('Password must be 8-16 characters long, contain at least one uppercase letter, and at least one special character.');
    }
  } else if (isSignupOrCreate) {
    errors.push('Password is required.');
  }

  return errors;
};

module.exports = { validateFields };
