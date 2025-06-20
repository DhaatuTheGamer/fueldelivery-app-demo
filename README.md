
# FuelDelivery App DEMO

FuelDelivery App DEMO is a React-based application designed for users to conveniently order fuel delivery to their doorstep. It emphasizes speed, simplicity, trust, and transparency in the ordering process. The application is built with a modern frontend stack and aims to provide a seamless user experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Running](#setup-and-running)
  - [File Placement](#file-placement)
  - [Environment Variables (Gemini API)](#environment-variables-gemini-api)
  - [Launch](#launch)
- [Key User Flows](#key-user-flows)
- [Simulated Features](#simulated-features)
- [API Key Handling](#api-key-handling)

## Features

-   Splash Screen
-   Mobile Number Login with OTP Verification (Simulated)
-   Minimal User Profile Setup & Editing
-   Vehicle Management (Add/Edit/List/Delete)
-   Location-based Service (Simulated, with placeholder map)
-   Fuel Ordering by Litres or Rupees
-   Real-time Price Calculation & Breakdown
-   Checkout Process (Simulated Payment)
-   Order Placement Confirmation
-   Live Order Tracking (Simulated Captain Assignment, Movement & ETA)
-   Rate and Tip Delivery Experience (Simulated)
-   Order History (Ongoing and Past Orders)
-   Help & Support Section (FAQs, Contact Stubs)
-   User Profile & Settings Management (Logout, links to privacy/terms)
-   Responsive Design using Tailwind CSS
-   Client-side routing with React Router
-   State management using React Context API

## Tech Stack

-   **React 19:** (Loaded via `importmap` from `esm.sh`)
-   **TypeScript:** For type safety and improved developer experience.
-   **React Router v7:** For client-side navigation (using `HashRouter`).
-   **Tailwind CSS:** For utility-first styling (loaded via CDN).
-   **Lucide React:** For icons (loaded via `importmap` from `esm.sh`).
-   **React Context API:** For global state management (Authentication, Vehicles, Orders).
-   **ES6 Modules:** Application structured with ES6 modules.

## Project Structure

The project follows a standard structure for React applications:

```
/
├── components/       # Reusable UI components (Button, Input, etc.)
├── contexts/         # React Context for global state (AuthContext, VehicleContext, OrderContext)
├── hooks/            # Custom React Hooks (useLocation)
├── screens/          # Top-level page/view components (HomeScreen, LoginScreen, etc.)
├── App.tsx           # Main application component with routing setup
├── index.tsx         # Entry point of the React application, mounts App
├── constants.ts      # Application-wide constants (API keys, URLs, default values)
├── types.ts          # TypeScript type definitions and enums
├── index.html        # Main HTML file, includes Tailwind CSS and importmap
├── metadata.json     # Application metadata (name, description, permissions)
├── README.md         # This file
└── .env              # (To be created by user) For environment variables like API_KEY (MUST be gitignored)
```

## Prerequisites

-   A development environment configured to serve `index.html` and automatically handle the ES6 module import and transpilation of `index.tsx` (and its subsequent `.tsx` imports). This is characteristic of modern JavaScript tooling like Vite.
-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).

## Setup and Running

### File Placement

Ensure all project files (`index.html`, `index.tsx`, `App.tsx`, and all files within `components/`, `contexts/`, `hooks/`, `screens/`, `constants.ts`, `types.ts`, `metadata.json`) are placed in their correct directory structure as outlined above.

### Environment Variables (Gemini API)

This application is designed to potentially integrate with Google's Gemini API. While core fuel delivery logic might not use it extensively at this stage, the setup accommodates it.

1.  Create a file named `.env` in the root directory of your project.
2.  Add your Google Gemini API key to this file:
    ```env
    API_KEY=YOUR_GEMINI_API_KEY
    ```
3.  **Important Notes:**
    *   Replace `YOUR_GEMINI_API_KEY` with your actual API key obtained from Google AI Studio.
    *   The API key is accessed within the application code via `process.env.API_KEY`.
    *   The application **will not** provide any UI elements (input fields, forms, etc.) for entering or managing the API key. Its availability as an environment variable is a prerequisite.
    *   **Crucially, add the `.env` file to your `.gitignore` file** to prevent accidentally committing your API key to version control.

### Launch

1.  Start your development server, ensuring it serves the project root directory (where `index.html` is located). The server must be capable of handling the direct import of `.tsx` files as ES6 modules, as specified in `index.html`.
2.  Open the local URL provided by your development server (e.g., `http://localhost:3000`, `http://localhost:5173` for Vite, or other ports depending on your setup) in your web browser.

The application should now be running.

## Key User Flows

The application implements several key user flows:

1.  **First-Time User Onboarding:**
    *   Splash Screen -> Welcome/Login Gateway (Mobile Number) -> OTP Verification -> Minimal Profile Setup.
2.  **Core Ordering Process:**
    *   Home/Map Dashboard (Select/Add Vehicle, Set Location) -> Order Configuration (Quantity, Price) -> Checkout & Payment (Simulated).
3.  **Post-Order Experience:**
    *   Order Placed & Searching for Captain -> Live Tracking Screen (Captain Info, ETA, OTP) -> Rate Your Experience.
4.  **Auxiliary Screens (via Bottom Navigation/Profile):**
    *   My Orders (Ongoing, Past)
    *   Help & Support (FAQs, Contact options)
    *   Profile & Settings (Manage Profile, Logout).

## Simulated Features

Please be aware that several features are currently **simulated** for demonstration and development purposes. They do not connect to live backend services or perform real-world actions:

-   **User Authentication:** OTP verification is mocked (e.g., accepts "1234"). User data is stored in `localStorage`.
-   **Backend Operations:** All data (vehicles, orders) is stored and managed in `localStorage`. There are no actual API calls to a remote backend.
-   **Payment Processing:** Payment steps are UI-only simulations. No real payment gateways are integrated.
-   **Location Services & Maps:** Location detection uses browser geolocation (if permitted) or defaults. The map display is a placeholder (`MapPlaceholder.tsx`) and does not show real-time GPS data or dynamic routing.
-   **Delivery Captain Logic:** Assignment, ETA calculation, and movement are simulated using `setTimeout` and predefined logic.
-   **Push Notifications:** Described in flows but not implemented as actual system notifications.

## API Key Handling

As per the @google/genai coding guidelines:
- The Gemini API key **must** be obtained **exclusively** from the environment variable `process.env.API_KEY`.
- The application code will use `new GoogleGenAI({ apiKey: process.env.API_KEY })` for initializing the Gemini client if and when Gemini features are implemented.
- The application **must not** include any UI elements or code snippets for users to enter, manage, or configure the API key. The availability of `process.env.API_KEY` is assumed to be handled externally in the deployment/development environment.
