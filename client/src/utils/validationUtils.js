/**
 * Form & Input Validation Utilities
 */

export function validateFactoryInput({ name, length, width, departmentCount }) {
  const errors = {};
  if (!name || !name.trim()) {
    errors.name = 'Factory name is required.';
  }
  const l = parseFloat(length);
  if (isNaN(l) || l <= 0 || l > 500) {
    errors.length = 'Length must be between 1 and 500 meters.';
  }
  const w = parseFloat(width);
  if (isNaN(w) || w <= 0 || w > 500) {
    errors.width = 'Width must be between 1 and 500 meters.';
  }
  const d = parseInt(departmentCount);
  if (isNaN(d) || d < 1 || d > 20) {
    errors.departmentCount = 'Department count must be between 1 and 20.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
