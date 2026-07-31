const validateRating = (rating) => {
  if (!rating || rating < 1 || rating > 5) {
    return 'Rating must be an integer between 1 and 5';
  }
  return null;
};

module.exports = { validateRating };
