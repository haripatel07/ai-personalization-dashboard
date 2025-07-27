// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Grid, Paper, FormControl,
  InputLabel, Select, MenuItem, TextField,
  // Material-UI Theming imports
  createTheme, ThemeProvider, CssBaseline, IconButton, Button,
  // New imports for UI improvements
  Snackbar, Alert, Skeleton // Added for enhanced feedback and loading states
} from '@mui/material';

// Material-UI Icon imports for theme toggle
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for Dark Mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for Light Mode

// Recharts imports for all chart types used
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Import your custom components and local mock data
import RuleEditor from './components/RuleEditor';
import { mockUserProfiles } from './data/mockUsers'; // Still using local user profiles
import { mockContentVariants } from './data/mockContentVariants'; // Still using local content variants
import { evaluateRules } from './utils/personalizationEngine';


function App() {
  // --- State Declarations ---

  // Theme mode state, initialized from Local Storage
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('themeMode');
      return storedMode || 'light'; // Default to 'light' if not found
    }
    return 'light'; // Default for SSR or initial render without window
  });

  // Personalization Rules state, initialized from Local Storage
  const [rules, setRules] = useState(() => {
    try {
      const storedRules = localStorage.getItem('personalizationRules');
      return storedRules ? JSON.parse(storedRules) : [];
    } catch (error) {
      console.error("Failed to load rules from local storage:", error);
      return [];
    }
  });

  // State for current simulated user (selected from mockUserProfiles)
  const [selectedUser, setSelectedUser] = useState(mockUserProfiles[0]);

  // State for the key of the content variant determined by personalization engine
  const [personalizedContentKey, setPersonalizedContentKey] = useState('default');

  // State for A/B Test Configuration (Simulated)
  const [abTestConfig, setAbTestConfig] = useState({
    testName: 'Homepage Personalization Test',
    controlVariant: '', // Default to empty for validation
    variantAVariant: '', // Default to empty for validation
    variantBVariant: '',
    audienceSegment: 'all',
    status: 'running',
  });

  // State for A/B Test Configuration Validation Errors
  const [abTestConfigErrors, setAbTestConfigErrors] = useState({});

  // States for Dynamically Generated Chart Data
  const [dynamicEngagementData, setDynamicEngagementData] = useState([]);
  const [dynamicABTestData, setDynamicABTestData] = useState([]);
  const [dynamicAudienceSegmentation, setDynamicAudienceSegmentation] = useState([]);
  const [dynamicConversionRateData, setDynamicConversionRateData] = useState([]);

  // State for loading indicators for charts
  const [chartsLoading, setChartsLoading] = useState(true);

  // State for Snackbar feedback
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'info' | 'warning'

  // --- End State Declarations ---


  // --- Helper Functions ---

  // Function to show Snackbar messages
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Close Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Validation logic for A/B Test Configuration form
  const validateAbTestConfig = (config) => {
    const errors = {};
    if (!config.testName.trim()) {
      errors.testName = 'Test Name is required';
    }
    if (!config.controlVariant) {
      errors.controlVariant = 'Control Variant is required';
    }
    if (!config.variantAVariant) {
      errors.variantAVariant = 'Variant A is required';
    }
    if (config.controlVariant && config.variantAVariant && config.controlVariant === config.variantAVariant) {
      errors.variantAVariant = 'Variant A cannot be the same as Control Variant';
    }
    return errors;
  };

    // Effect to save theme mode to Local Storage whenever 'mode' state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  // Effect to save personalization rules to Local Storage whenever 'rules' state changes
  useEffect(() => {
    try {
      localStorage.setItem('personalizationRules', JSON.stringify(rules));
    } catch (error) {
      console.error("Failed to save rules to local storage:", error);
      showSnackbar("Failed to save rules locally.", "error");
    }
  }, [rules]);

  // Effect to re-evaluate personalization when selectedUser or rules change
  useEffect(() => {
    const contentKey = evaluateRules(selectedUser, rules);
    setPersonalizedContentKey(contentKey);
  }, [selectedUser, rules]);

  // Effect to generate dynamic data for all charts on component mount
  useEffect(() => {
    setChartsLoading(true); // Set loading to true when starting data generation
    // Simulate a network delay for data loading
    const timer = setTimeout(() => {
      // --- Helper Functions to Generate Mock Data ---
      const generateEngagementData = () => {
        const data = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let baseControl = 5;
        let basePersonalized = 10;

        for (let i = 0; i < 12; i++) {
          const monthName = months[i];
          const controlValue = parseFloat((baseControl + (Math.random() * 2 - 1)).toFixed(1));
          const personalizedValue = parseFloat((basePersonalized + (i * 0.7) + (Math.random() * 1.5 - 0.75)).toFixed(1));

          data.push({
            name: monthName,
            'Engagement Lift': Math.max(0, personalizedValue),
            'Control Group': Math.max(0, controlValue),
          });
          baseControl = controlValue;
          basePersonalized = personalizedValue;
        }
        return data;
      };

      const generateABTestData = () => {
        const controlConversion = parseFloat((Math.random() * (3.8 - 3.0) + 3.0).toFixed(1));
        const variantAConversion = parseFloat((Math.random() * (4.8 - 4.0) + 4.0).toFixed(1));
        const variantBConversion = parseFloat((Math.random() * (4.2 - 3.5) + 3.5).toFixed(1));

        const controlCTR = parseFloat((Math.random() * (9.0 - 7.0) + 7.0).toFixed(1));
        const variantACTR = parseFloat((Math.random() * (13.0 - 11.0) + 11.0).toFixed(1));
        const variantBCTR = parseFloat((Math.random() * (11.0 - 9.5) + 9.5).toFixed(1));

        return [
          { name: 'Control (Original Content)', 'Conversion Rate': controlConversion, 'Click-Through Rate': controlCTR },
          { name: 'Variant A (Personalized)', 'Conversion Rate': variantAConversion, 'Click-Through Rate': variantACTR },
          { name: 'Variant B (Different Personalization)', 'Conversion Rate': variantBConversion, 'Click-Through Rate': variantBCTR },
        ];
      };

      const generateAudienceSegmentation = () => {
        const premium = Math.floor(Math.random() * (30000 - 20000) + 20000);
        const newUsers = Math.floor(Math.random() * (45000 - 35000) + 35000);
        const returning = Math.floor(Math.random() * (40000 - 30000) + 30000);
        return [
          { name: 'Premium Users', value: premium },
          { name: 'New Users', value: newUsers },
          { name: 'Returning Users', value: returning },
        ];
      };

      const generateConversionRateComparison = () => {
          const nonPersonalized = parseFloat((Math.random() * (4.0 - 3.0) + 3.0).toFixed(1));
          const personalized = parseFloat((Math.random() * (5.5 - 4.5) + 4.5).toFixed(1));
          return [
            { name: 'Non-Personalized', rate: nonPersonalized },
            { name: 'Personalized', rate: personalized },
          ];
      };

      // Set the state with the newly generated data
      setDynamicEngagementData(generateEngagementData());
      setDynamicABTestData(generateABTestData());
      setDynamicAudienceSegmentation(generateAudienceSegmentation());
      setDynamicConversionRateData(generateConversionRateComparison());

      setChartsLoading(false); // Set loading to false after data is generated
    }, 1500); // Simulate 1.5 seconds loading time

    return () => clearTimeout(timer); // Cleanup timer on unmount

  }, []); // Empty dependency array: this effect runs only once on mount
  // --- End useEffects ---


  // Callback function for RuleEditor to update rules state
  const handleRulesSave = (savedRules) => {
    setRules(savedRules); // This triggers the useEffect to save to localStorage
    showSnackbar('Rules saved locally!', 'success'); // Show success message
  };

  // Get the current content object based on the determined key from personalization engine
  const currentPersonalizedContent = mockContentVariants[personalizedContentKey];


  // Create the Material-UI theme based on the current mode state using useMemo for performance
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode, // This property switches between 'light' and 'dark'
          primary: {
            main: mode === 'light' ? '#6200EE' : '#BB86FC', // Deep Purple / Light Purple
          },
          secondary: {
            main: mode === 'light' ? '#03DAC6' : '#03DAC6', // Teal Green
          },
          error: {
            main: '#CF6679', // Muted red for errors
          },
          background: {
            default: mode === 'light' ? '#F5F5F5' : '#121212', // Lighter gray for light, dark gray for dark
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E', // White for light cards, darker gray for dark cards
          },
          text: {
              primary: mode === 'light' ? '#212121' : '#E0E0E0',
              secondary: mode === 'light' ? '#757575' : '#B0B0B0',
          }
        },
        typography: {
          fontFamily: [
            'Inter', // Custom font
            'Roboto', // Fallback
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: { fontSize: '3rem', fontWeight: 700 },
          h2: { fontSize: '2.5rem', fontWeight: 700 },
          h3: { fontSize: '2rem', fontWeight: 600 },
          h4: { fontSize: '1.5rem', fontWeight: 600 },
          h5: { fontSize: '1.25rem', fontWeight: 500 },
          h6: { fontSize: '1rem', fontWeight: 500 },
          body1: { fontSize: '0.95rem' },
          button: { textTransform: 'none' }, // Keep button text as is
        },
        shape: {
          borderRadius: 8, // More rounded corners for components
        },
        // Custom shadows for light/dark mode - Defined up to 24
        shadows: createTheme({ palette: { mode: 'light' } }).shadows.map((s, i) => {
          if (mode === 'light') {
            if (i === 1) return '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)';
            if (i === 2) return '0px 2px 5px rgba(0,0,0,0.15), 0px 1px 2px rgba(0,0,0,0.20)';
            if (i === 3) return '0px 3px 8px rgba(0,0,0,0.18), 0px 2px 4px rgba(0,0,0,0.22)';
            if (i === 4) return '0px 4px 10px rgba(0,0,0,0.2), 0px 3px 6px rgba(0,0,0,0.25)'; // Added for elevation 4
            // Add more as needed, or let defaults handle it beyond index 3
            return s; // Use default MUI shadow for other indices
          } else { // Dark mode shadows
            if (i === 1) return '0px 1px 3px rgba(0,0,0,0.5), 0px 1px 2px rgba(0,0,0,0.3)';
            if (i === 2) return '0px 2px 5px rgba(0,0,0,0.6), 0px 1px 2px rgba(0,0,0,0.4)';
            if (i === 3) return '0px 3px 8px rgba(0,0,0,0.7), 0px 2px 4px rgba(0,0,0,0.5)';
            if (i === 4) return '0px 4px 10px rgba(0,0,0,0.8), 0px 3px 6px rgba(0,0,0,0.6)'; // Added for elevation 4
            return s; // Use default MUI shadow for other indices
          }
        }),
        components: {
          MuiPaper: {
            defaultProps: {
              elevation: 2, // Set default elevation for Paper to use our custom shadow[2]
            },
            styleOverrides: {
              root: {
                borderRadius: 8, // Ensure Paper respects the global border radius
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none', // Remove default app bar shadow
                borderBottom: `1px solid ${mode === 'light' ? '#E0E0E0' : '#333333'}`, // Subtle border
              },
            },
          },
          MuiButton: {
              styleOverrides: {
                  root: {
                      borderRadius: 8, // Match general border radius
                      textTransform: 'none', // Prevent uppercase transform
                  },
              },
          },
          MuiOutlinedInput: { // TextField outlined input
              styleOverrides: {
                  root: {
                      borderRadius: 8, // Match general border radius
                  },
              },
          },
          MuiSelect: { // Select input
              styleOverrides: {
                  select: {
                      borderRadius: 8, // Match general border radius
                  },
              },
          },
        }
      }),
    [mode], // Recreate theme object only when the mode changes
  );

  return (
    // Wrap the entire application with ThemeProvider and CssBaseline
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies base styles and sets background/text colors based on theme.mode */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Personalization Dashboard
            </Typography>
            {/* Theme Toggle Button */}
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))}
              color="inherit" // Inherits color from AppBar
              aria-label="toggle light/dark mode"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>

            {/* Performance Overview (Metrics Section) - Uses dynamic data */}
            <Grid xs={12} md={8} lg={9}> {/* Removed 'item' prop */}
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 480 }}> {/* Increased padding to p={3} */}
                <Typography variant="h5" gutterBottom>
                  Performance Overview
                </Typography>

                {chartsLoading ? (
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <Skeleton variant="rectangular" height={180} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={230} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="text" width="60%" sx={{ alignSelf: 'center' }} />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {/* Engagement Lift Over Time (Line Chart) */}
                    <Grid xs={12} md={6}> {/* Removed 'item' prop */}
                      <Typography variant="h6" gutterBottom>Engagement Lift Over Time</Typography>
                      <Box sx={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={dynamicEngagementData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Engagement Lift" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} animationDuration={1000} />
                            <Line type="monotone" dataKey="Control Group" stroke={theme.palette.secondary.main} animationDuration={1000} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>

                    {/* Conversion Rate Comparison (Bar Chart) */}
                    <Grid xs={12} md={6}> {/* Removed 'item' prop */}
                      <Typography variant="h6" gutterBottom>Conversion Rate Comparison</Typography>
                      <Box sx={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={dynamicConversionRateData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="rate" fill={theme.palette.primary.main} animationDuration={1000} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>

                    {/* Simulated A/B Test Results (Grouped Bar Chart) */}
                    <Grid xs={12}> {/* Removed 'item' prop */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Simulated A/B Test Results: {abTestConfig.testName}</Typography>
                      <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={dynamicABTestData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Conversion Rate" fill={theme.palette.secondary.main} animationDuration={1000} />
                            <Bar dataKey="Click-Through Rate" fill={theme.palette.primary.main} animationDuration={1000} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>

                    {/* Audience Segmentation (Pie Chart) */}
                    <Grid xs={12}> {/* Removed 'item' prop */}
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Audience Segmentation</Typography>
                      <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={dynamicAudienceSegmentation}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                              animationDuration={1000}
                            >
                              {dynamicAudienceSegmentation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={
                                  [theme.palette.primary.main, theme.palette.secondary.main, '#FFBB28', '#00C49F'][index % 4]
                                } />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                  </Grid> 
                )}
              </Paper>
            </Grid> {/* End Metrics Section */}

            {/* Summary Stats (from Phase 1, unchanged) */}
            <Grid xs={12} md={4} lg={3}> {/* Removed 'item' prop */}
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 240 }}> {/* Increased padding to p={3} */}
                <Typography variant="h6" gutterBottom>
                  Summary Stats
                </Typography>
                <Typography variant="body1">Engagement Lift: +15%</Typography>
                <Typography variant="body1">Conversion Rate: +5%</Typography>
                <Typography variant="body1">Personalized Views: 70%</Typography>
              </Paper>
            </Grid>

            {/* Rule Configuration Section (using RuleEditor component from Phase 2) */}
            <Grid xs={12}> {/* Removed 'item' prop */}
              <Paper sx={{ p: 3 }}> {/* Increased padding to p={3} */}
                <RuleEditor onSaveRules={handleRulesSave} availableContentVariants={Object.keys(mockContentVariants)} />
              </Paper>
            </Grid>

            {/* A/B Test Configuration Section (from Phase 3 + Validation from Refinement 2) */}
            <Grid xs={12}> {/* Removed 'item' prop */}
              <Paper sx={{ p: 3 }}> {/* Increased padding to p={3} */}
                <Typography variant="h6" gutterBottom>
                  A/B Test Configuration (Simulated)
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <TextField
                      label="Test Name"
                      fullWidth
                      value={abTestConfig.testName}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedConfig = {...abTestConfig, testName: newValue};
                        setAbTestConfig(updatedConfig);
                        setAbTestConfigErrors(validateAbTestConfig(updatedConfig));
                      }}
                      margin="normal"
                      error={!!abTestConfigErrors.testName}
                      helperText={abTestConfigErrors.testName}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <FormControl fullWidth margin="normal" error={!!abTestConfigErrors.controlVariant}>
                      <InputLabel>Control Variant</InputLabel>
                      <Select
                        value={abTestConfig.controlVariant}
                        label="Control Variant"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedConfig = {...abTestConfig, controlVariant: newValue};
                          setAbTestConfig(updatedConfig);
                          setAbTestConfigErrors(validateAbTestConfig(updatedConfig));
                        }}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {Object.keys(mockContentVariants).map((variantKey) => (
                          <MenuItem key={variantKey} value={variantKey}>{variantKey}</MenuItem>
                        ))}
                      </Select>
                      {abTestConfigErrors.controlVariant && <Typography color="error" variant="caption">{abTestConfigErrors.controlMeaningful.controlVariant}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <FormControl fullWidth margin="normal" error={!!abTestConfigErrors.variantAVariant}>
                      <InputLabel>Variant A</InputLabel>
                      <Select
                        value={abTestConfig.variantAVariant}
                        label="Variant A"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedConfig = {...abTestConfig, variantAVariant: newValue};
                          setAbTestConfig(updatedConfig);
                          setAbTestConfigErrors(validateAbTestConfig(updatedConfig));
                        }}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {Object.keys(mockContentVariants).map((variantKey) => (
                          <MenuItem key={variantKey} value={variantKey}>{variantKey}</MenuItem>
                        ))}
                      </Select>
                      {abTestConfigErrors.variantAVariant && <Typography color="error" variant="caption">{abTestConfigErrors.variantAVariant}</Typography>}
                    </FormControl>
                  </Grid>
                   <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Variant B (Optional)</InputLabel>
                      <Select
                        value={abTestConfig.variantBVariant}
                        label="Variant B (Optional)"
                        onChange={(e) => setAbTestConfig({...abTestConfig, variantBVariant: e.target.value})}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {Object.keys(mockContentVariants).map((variantKey) => (
                          <MenuItem key={variantKey} value={variantKey}>{variantKey}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                   <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Audience Segment</InputLabel>
                      <Select
                        value={abTestConfig.audienceSegment}
                        label="Audience Segment"
                        onChange={(e) => setAbTestConfig({...abTestConfig, audienceSegment: e.target.value})}
                      >
                        <MenuItem value="all">All Users</MenuItem>
                        <MenuItem value="new_users">New Users</MenuItem>
                        <MenuItem value="premium_users">Premium Users</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}> {/* Removed 'item' prop */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={abTestConfig.status}
                        label="Status"
                        onChange={(e) => setAbTestConfig({...abTestConfig, status: e.target.value})}
                      >
                        <MenuItem value="running">Running</MenuItem>
                        <MenuItem value="paused">Paused</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* Save A/B Test Config Button */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={() => {
                    const errors = validateAbTestConfig(abTestConfig);
                    setAbTestConfigErrors(errors);
                    if (Object.keys(errors).length === 0) {
                      showSnackbar('A/B Test Configuration is valid and simulated to be saved!', 'success');
                    } else {
                      showSnackbar('Please correct the errors in A/B Test Configuration before saving.', 'error');
                    }
                  }}
                >
                  Save A/B Test Config
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  (This A/B test configuration is simulated on the frontend. The metrics above are fixed mock data.)
                </Typography>
              </Paper>
            </Grid>

            {/* Content Preview Section (from Phase 2) */}
            <Grid xs={12}> {/* Removed 'item' prop */}
              <Paper sx={{ p: 3 }}> {/* Increased padding to p={3} */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Personalized Content Preview
                  </Typography>
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="user-select-label">Simulate User</InputLabel>
                    <Select
                      labelId="user-select-label"
                      value={selectedUser.id}
                      label="Simulate User"
                      onChange={(e) => setSelectedUser(mockUserProfiles.find(user => user.id === e.target.value))}
                    >
                      {mockUserProfiles.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ minHeight: 200, border: '1px dashed grey', p: 2, textAlign: 'center' }}>
                  {currentPersonalizedContent ? (
                    <>
                      <Typography variant="h5" color="primary" mb={1}>{currentPersonalizedContent.title}</Typography>
                      <Typography variant="body1" mb={2}>{currentPersonalizedContent.body}</Typography>
                      <img src={currentPersonalizedContent.imageUrl} alt="Personalized Content" style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px' }} />
                    </>
                  ) : (
                    <Typography variant="body2" color="error">Content variant not found for '{personalizedContentKey}' or no rules matched.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for user feedback */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}

export default App;