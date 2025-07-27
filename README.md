# AI-Powered Content Personalization Dashboard (Frontend Only)

![Dashboard Screenshot 1](public\1.png)
![Dashboard Screenshot 2](public\2.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Future Improvements & UI Enhancements](#future-improvements--ui-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a dynamic and interactive **frontend-only** dashboard designed to showcase the management and impact of AI-driven content personalization. It provides a simulated environment for content creators and marketers to configure personalization rules, preview content variations for different user segments, and visualize the (simulated) performance metrics of personalized content and A/B tests.

Built with modern React best practices, this dashboard highlights advanced UI/UX, state management, data visualization, and client-side data persistence, all without requiring a separate backend.

## Features

* **Content Personalization Rule Editor:**
    * Create, edit, and delete custom personalization rules.
    * Define conditions based on simulated user attributes (e.g., `userType`, `hasPurchased`, `browser`, `device`, `purchaseCount`).
    * Assign specific content variants to rules.
    * Rules are prioritized, with the first matching rule determining the content.
* **Personalized Content Preview:**
    * Dynamically view how content changes based on selected simulated user profiles and active personalization rules.
    * Switch between various mock user profiles to test rule effectiveness.
* **Simulated A/B Testing Configuration:**
    * Define conceptual A/B/C tests, including test names, control variants, and multiple test variants.
    * Basic client-side validation for A/B test configuration inputs.
* **Enhanced Performance Metrics Dashboard:**
    * Visualize key performance indicators (KPIs) through interactive charts (Line, Bar, Pie charts).
    * Charts display dynamically generated data for:
        * Engagement Lift over Time (Personalized vs. Control Group)
        * Conversion Rate Comparison (Personalized vs. Non-Personalized)
        * Simulated A/B Test Results (Conversion Rate, Click-Through Rate)
        * Audience Segmentation
    * Slightly varying data on refresh to simulate real-world data fluctuations.
    * Skeleton loaders provide an improved user experience during simulated data loading.
* **Dark/Light Mode Toggle:**
    * Switch between elegant light and dark themes across the entire dashboard.
    * Theme preference is persisted in the browser's Local Storage.
* **Local Storage Persistence:**
    * All created personalization rules are saved directly in the browser's Local Storage, ensuring they persist even after page refreshes or browser closures.
* **Responsive Design:**
    * Adapts gracefully to various screen sizes using Material-UI's responsive Grid system.
* **Engaging User Feedback:**
    * Uses Material-UI's `Snackbar` component for non-intrusive notifications (e.g., rule saved, validation errors).

## Technologies Used

* **Frontend Framework:** React.js (with JSX)
* **Build Tool/Dev Server:** Vite
* **UI Component Library:** Material-UI (MUI)
    * Includes `@mui/material` for core components and `@mui/icons-material` for icons.
* **Charting Library:** Recharts
* **Styling:** Material-UI's `sx` prop for inline styles, `CssBaseline` for resets, and minor custom CSS.
* **Font:** Inter (via Google Fonts)

## Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager, comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/haripatel07/ai-personalization-dashboard.git](https://github.com/haripatel07/ai-personalization-dashboard.git)
    ```
    *(Ensure you use the correct URL for your repository if it's different)*

2.  **Navigate into the project directory:**
    ```bash
    cd ai-personalization-dashboard
    ```

3.  **Install frontend dependencies:**
    ```bash
    npm install
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material recharts
    ```

### Running the Project

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, and your application will be available at `http://localhost:5173/` (or a similar port).

## Project Structure
ai-personalization-dashboard/
├── public/                 # Static assets 
├── src/
│   ├── components/         # Reusable React components 
│   ├── data/               # Mock data for users and content variants 
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── App.css             # Component-specific styles
│   ├── main.jsx            # Entry point of the React application
│   └── index.css           # Global styles
├── .gitignore              # Specifies intentionally untracked files to ignore
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # README file

## Future Improvements & UI Enhancements

This dashboard is a work in progress, and the UI will be continuously improved. Potential future enhancements include:

* **More Advanced UI/UX:** Exploring more complex animations, custom transitions, and unique component designs beyond Material-UI defaults.
* **Dashboard Layout Customization:** Implementing drag-and-drop functionality for chart widgets.
* **Filtering & Sorting:** Adding options to filter and sort rules or simulated data.
* **Accessibility (A11y):** A deeper dive into ensuring the application is fully accessible for users with disabilities.
* **Performance Optimizations:** Further optimizing rendering performance for very large datasets (though not a primary concern with current simulated data).
* **Export Options:** Allowing users to export chart data or reports.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find issues, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.