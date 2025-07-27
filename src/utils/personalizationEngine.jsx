// convert value to appropriate type for comparison
const convertValue = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(parseFloat(value)) && isFinite(value)) return parseFloat(value);
  return String(value).toLowerCase();
};

export const evaluateRules = (userProfile, rules) => {
  // Sort rules by a priority
  // order of rules in the array determines priority (first match wins)

  for (const rule of rules) {
    // A rule must have conditions to be evaluated
    if (!rule.conditions || rule.conditions.length === 0) {
      continue; // Skip rules without conditions
    }

    const allConditionsMet = rule.conditions.every(condition => {
      const userValue = userProfile[condition.property];
      const ruleValue = convertValue(condition.value); // Convert rule value for comparison

      // Handle cases where user profile might not have the property
      if (userValue === undefined || userValue === null) {
          return false;
      }

      const userComparableValue = convertValue(userValue); // Convert user value

      switch (condition.operator) {
        case 'equals':
          return userComparableValue === ruleValue;
        case 'notEquals':
          return userComparableValue !== ruleValue;
        case 'greaterThan':
          return userComparableValue > ruleValue;
        case 'lessThan':
          return userComparableValue < ruleValue;
        case 'contains': // For string values
          return String(userComparableValue).includes(String(ruleValue));
        case 'notContains': // For string values
          return !String(userComparableValue).includes(String(ruleValue));
        default:
          return false; // Unknown operator
      }
    });

    if (allConditionsMet) {
      return rule.contentVariant; // Return the content variant for the first matching rule
    }
  }

  // If no rules match, return the default variant
  return 'default';
};