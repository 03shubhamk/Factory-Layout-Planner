/**
 * Production Flow Sequence Utilities
 */

export function reorderFlowSteps(steps, fromIndex, toIndex) {
  if (!Array.isArray(steps)) return [];
  const result = Array.from(steps);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function validateFlowSequence(steps, availableMachines) {
  if (!Array.isArray(steps) || steps.length < 2) {
    return { valid: false, message: 'Production flow requires at least 2 connected machine steps.' };
  }
  const machineIds = new Set(availableMachines.map(m => m.id));
  const missingSteps = steps.filter(id => !machineIds.has(id));
  if (missingSteps.length > 0) {
    return { valid: false, message: 'Flow sequence contains invalid machine references.' };
  }
  return { valid: true, message: 'Valid flow sequence.' };
}
