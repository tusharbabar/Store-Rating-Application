const validateStoreFields = (storeData) => {
  const errors = [];
  if (!storeData.name || storeData.name.trim().length === 0) errors.push('Store Name is required');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!storeData.email || !emailRegex.test(storeData.email)) errors.push('Valid Store Email is required');
  if (!storeData.address || storeData.address.length > 400) errors.push('Valid Address is required (max 400 chars)');
  return errors;
};

module.exports = { validateStoreFields };
