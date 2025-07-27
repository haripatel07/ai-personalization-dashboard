import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Defining available properties, operators, and content variants
// In a real app, these might come from a backend API or a configuration file.
const availableProperties = ['userType', 'hasPurchased', 'browser', 'device', 'purchaseCount'];
const availableOperators = ['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains', 'notContains'];

function RuleEditor({ onSaveRules, availableContentVariants }) {
  const [rules, setRules] = useState([]); // State to hold all defined rules

  const addRule = () => {
    setRules([
      ...rules,
      {
        id: Date.now(), // Unique ID for key prop and easy tracking
        name: `New Rule ${rules.length + 1}`,
        conditions: [{ property: '', operator: '', value: '' }],
        contentVariant: 'default',
      },
    ]);
  };

  const updateRule = (ruleId, field, value) => {
    setRules(rules.map((rule) =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const addCondition = (ruleId) => {
    setRules(rules.map((rule) =>
      rule.id === ruleId ? { ...rule, conditions: [...rule.conditions, { property: '', operator: '', value: '' }] } : rule
    ));
  };

  const updateCondition = (ruleId, conditionIndex, field, value) => {
    setRules(rules.map((rule) => {
      if (rule.id === ruleId) {
        const newConditions = rule.conditions.map((cond, idx) =>
          idx === conditionIndex ? { ...cond, [field]: value } : cond
        );
        return { ...rule, conditions: newConditions };
      }
      return rule;
    }));
  };

  const deleteCondition = (ruleId, conditionIndex) => {
    setRules(rules.map((rule) => {
      if (rule.id === ruleId) {
        const newConditions = rule.conditions.filter((_, idx) => idx !== conditionIndex);
        return { ...rule, conditions: newConditions };
      }
      return rule;
    }));
  };

  const deleteRule = (ruleId) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
  };

  const handleSaveAllRules = () => {
    // For now, we'll just pass the rules up to the parent component (App.jsx)
    // In a real application, you would send these rules to a backend API.
    onSaveRules(rules);
    console.log("Rules Saved:", rules); // For debugging
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Configure Personalization Rules</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={addRule} sx={{ mb: 3 }}>
        Add New Rule
      </Button>

      {rules.map((rule, ruleIndex) => (
        <Paper key={rule.id} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              label="Rule Name"
              value={rule.name}
              onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
              fullWidth
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => deleteRule(rule.id)} color="error" aria-label="delete rule">
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" gutterBottom>Conditions:</Typography>
          {rule.conditions.map((condition, condIndex) => (
            <Box key={condIndex} display="flex" alignItems="center" mb={1} sx={{ '& > *': { mr: 1 } }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Property</InputLabel>
                <Select
                  value={condition.property}
                  label="Property"
                  onChange={(e) => updateCondition(rule.id, condIndex, 'property', e.target.value)}
                >
                  {availableProperties.map((prop) => (
                    <MenuItem key={prop} value={prop}>{prop}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={condition.operator}
                  label="Operator"
                  onChange={(e) => updateCondition(rule.id, condIndex, 'operator', e.target.value)}
                >
                  {availableOperators.map((op) => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Value"
                value={condition.value}
                onChange={(e) => updateCondition(rule.id, condIndex, 'value', e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <IconButton onClick={() => deleteCondition(rule.id, condIndex)} color="error" aria-label="delete condition">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<AddIcon />} onClick={() => addCondition(rule.id)} sx={{ mt: 1 }}>
            Add Condition
          </Button>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Content Variant</InputLabel>
            <Select
              value={rule.contentVariant}
              label="Content Variant"
              onChange={(e) => updateRule(rule.id, 'contentVariant', e.target.value)}
            >
              {availableContentVariants.map((variant) => (
                <MenuItem key={variant} value={variant}>{variant}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      ))}
      {rules.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleSaveAllRules} sx={{ mt: 2 }}>
          Save All Rules
        </Button>
      )}
    </Box>
  );
}

export default RuleEditor;