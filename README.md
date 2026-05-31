# Smart Energy Meter Dashboard

## Overview

**Smart Energy Meter with AI-Driven Tiered Billing Analysis** is a sophisticated IoT solution designed to bridge the gap between raw electricity usage and actionable financial insights. Unlike standard energy meters, this system provides a granular, second-by-second breakdown of energy consumption across specific household loads—Lighting (Bulb), Workstations (Laptop), and Heavy Appliances (AC).

## Features

### Core Features
- **Real-Time Monitoring:** Track energy usage for individual devices with second-by-second precision
- **Tiered Billing Engine:** Calculates your electricity bill using a complex tiered pricing model:
  - 0-200 units: ₹3/unit
  - 201-400 units: ₹4.50/unit
  - 401-800 units: ₹6.50/unit
  - 801-1200 units: ₹7/unit
  - Above 1200 units: ₹8/unit
- **High-Frequency Telemetry:** Handles minute-by-minute logging intervals with high-resolution charts
- **Cloud Database:** Uses Supabase for secure, scalable, real-time data storage and aggregation
- **Modern Dashboard UI:** Built with React and Vite, featuring a dark theme and responsive design

### Analytics & AI Features
- **AI-Powered Insights:** Integrates with Gemini API for predictive analytics and recommendations
- **Budget-Aware Analysis:** AI suggestions consider your monthly budget limit
- **Month-End Projections:** Projects total kWh and estimated bill based on current usage
- **Cost Optimization Tips:** Provides 3+ actionable energy-saving recommendations with estimated savings
- **Energy Consumption Charts:** Visualizes daily/monthly trends using Recharts

### Budget Management Features
- **Budget Settings Page:** Set your desired monthly electricity bill limit
- **Budget Bar Component:** Visual comparison of:
  - Monthly budget limit
  - Current bill (today)
  - AI-predicted bill (end of month)
- **Budget Status Tracking:** Color-coded alerts showing if you're within budget or exceeding limits
- **Smart Alerts:** Warnings when projected spending exceeds budget
- **Budget Database:** Persistent storage of budget preferences in Supabase

### Device Management
- **Device List:** View all connected devices (Bulb/Lighting, Laptop/Workstations, AC/Heavy Appliances)
- **Individual Device Tracking:** Monitor consumption per device
- **Real-Time Status:** See live status of each device
- **Device Analytics:** Device-specific consumption patterns

### Dashboard & Navigation
- **Dashboard Page:** Overview of today's consumption and system status
- **Analytics Page:** Detailed analysis with AI insights and budget comparison
- **Devices Page:** Complete device list and individual monitoring
- **Budget Settings Page:** Configure monthly budget limit
- **About Page:** Project information and credits
- **Responsive Design:** Fully mobile-optimized sidebar navigation

## Technical Architecture

- **ESP32 Microcontroller:** Fetches real-time voltage and current data from ZMPT101B and ACS712 sensors.
- **Supabase Cloud Database:** Streams millions of data points for aggregation and analysis.
- **Server-Side SQL Functions:** Ensures millisecond-latency performance for dashboard queries.
- **Gemini API Integration:** Delivers AI-driven insights and recommendations.

## Creators

**Electrical Engineering Department, Delhi Technological University**

- **Shobhit** (2K22/EE/256)
- **Shivam Verma** (2K22/EE/252)
- **Shubham** (2K22/EE/259)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- Git

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Shobhit-2204/Smart-Energy-Meter.git
   cd Smart-Energy-Meter/Dashboard/smartmeterdashboard
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the `smartmeterdashboard` directory with the following content:

   ```dotenv
   VITE_SUPABASE_URL=Supabase project URL
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=Supabase public API key
   VITE_GEMINI_API_KEY=Gemini API key for AI insights
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the dashboard.

## Usage

### Dashboard
- **Overview:** View today's cumulative energy consumption and cost breakdown by device
- **Real-time Updates:** Live data feed from sensors with second-by-second precision
- **Quick Stats:** See current day bill and kWh consumption at a glance

### Analytics
- **Monthly Analysis:** Select any month to analyze energy consumption patterns
- **AI Insights:** Generate predictions and recommendations with a single click
- **Budget Comparison:** View budget vs. actual vs. projected bills side-by-side
- **Cost Optimization:** Get device-specific recommendations to reduce energy costs
- **Smart Tips:** Budget-aware suggestions prioritized by savings potential

### Devices
- **Device Monitoring:** View all connected devices in real-time
- **Consumption Breakdown:** See which devices consume the most energy
- **Device Details:** Individual consumption metrics for each appliance

### Budget Settings
- **Set Budget:** Define your monthly electricity bill limit
- **Real-time Tracking:** Monitor spending against your budget
- **Historical Data:** Track budget performance over time
- **Alert System:** Automatic notifications when approaching or exceeding limits

### About
- **Project Information:** Learn about the Smart Energy Meter system
- **Technical Details:** Understand the IoT and cloud architecture
- **Team Credits:** Meet the developers behind the project

## Project Structure

```
Dashboard/
  smartmeterdashboard/
    public/              # Static assets
    src/
      assets/            # Images, icons, and media files
      components/        # React components
        About.jsx              # Project information page
        Analytics.jsx          # AI analysis and insights page
        BudgetBar.jsx          # Budget visualization component
        BudgetSettings.jsx     # Budget management page
        DashboardStats.jsx     # Dashboard statistics display
        DeviceCard.jsx         # Individual device card component
        DeviceList.jsx         # Device list page
        EnergyConsumptionChart.jsx  # Recharts visualization
        ErrorBoundary.jsx      # Error handling wrapper
        Sidebar.jsx            # Navigation sidebar
      pages/
        Dashboard.jsx     # Main dashboard page
      styles/
        BudgetBar.css          # Budget bar styling
        BudgetSettings.css     # Budget settings styling
      utils/
        energyData.js          # Data processing utilities
        sensorCorrection.js    # Sensor calibration functions
        supabaseClient.js      # Supabase configuration
        supabaseHooks.js       # Custom React hooks for data
      App.jsx            # Main app component with routing
      App.css            # Global app styling
      index.css          # Global styles
      main.jsx           # React entry point
    .env                 # Environment variables (not in repo)
    index.html           # HTML template
    package.json         # Dependencies and scripts
    vite.config.js       # Vite configuration
    eslint.config.js     # ESLint configuration
```

## Component Architecture

### Pages
- **Dashboard.jsx:** Landing page with today's consumption overview
- **Analytics.jsx:** AI-powered analysis with Gemini integration

### Components
- **Sidebar.jsx:** Main navigation with mobile responsiveness
- **DashboardStats.jsx:** Key metrics display (kWh, bill amount)
- **DeviceList.jsx & DeviceCard.jsx:** Device monitoring interface
- **EnergyConsumptionChart.jsx:** Recharts-based visualization
- **BudgetBar.jsx:** Budget vs. actual vs. projected visualization
- **BudgetSettings.jsx:** User budget configuration form
- **About.jsx:** Project and team information
- **ErrorBoundary.jsx:** Error handling and fallback UI

### Utilities
- **supabaseHooks.js:** Custom hooks for data fetching
  - `useDevices()` - Fetch connected devices
  - `useBudget()` - Fetch/manage user budget
  - And more utility hooks
- **supabaseClient.js:** Supabase SDK configuration
- **energyData.js:** Energy calculations and data processing
- **sensorCorrection.js:** Sensor calibration utilities

## Database Schema (Supabase)

### Tables

#### `devices`
- `id` (UUID): Primary key
- `device_id` (String): Unique device identifier
- `name` (String): Device name (e.g., "Bulb", "Laptop", "AC")
- `type` (String): Device category
- `status` (String): Current device status
- `created_at` (Timestamp): Creation timestamp

#### `energy_data`
- `id` (UUID): Primary key
- `device_id` (UUID): Foreign key to devices table
- `timestamp` (Timestamp): Data collection timestamp (second-level precision)
- `voltage` (Float): Voltage reading from sensor
- `current` (Float): Current reading from sensor
- `power` (Float): Calculated power consumption (W)
- `energy` (Float): Energy consumption (kWh)
- `created_at` (Timestamp): Database insertion timestamp

#### `monthly_aggregates` (Optional)
- `id` (UUID): Primary key
- `device_id` (UUID): Foreign key to devices
- `month` (String): Month in YYYY-MM format
- `total_kwh` (Float): Total kWh for the month
- `total_cost` (Float): Calculated bill for the month
- `created_at` (Timestamp): Timestamp

#### `user_budget` (New for Budget Feature)
- `id` (UUID): Primary key
- `user_id` (UUID): User identifier
- `monthly_budget_limit` (Float): User's monthly budget in ₹
- `created_at` (Timestamp): When budget was first set
- `updated_at` (Timestamp): Last update timestamp

### Database Functions

#### `get_monthly_stats(target_month)`
- **Purpose:** Fetch aggregated monthly energy data by device
- **Parameters:** `target_month` (YYYY-MM format)
- **Returns:** Array of {device_id, total_kwh} objects
- **Performance:** Optimized for dashboard queries with millisecond latency

#### `calculate_monthly_bill(kwh_total)`
- **Purpose:** Calculate tiered billing based on total kWh
- **Parameters:** `kwh_total` (Float)
- **Returns:** Total bill amount in ₹
- **Pricing Logic:** Applies predefined tiered structure

## Environment Variables

Create a `.env` file in the `smartmeterdashboard` directory with the following variables:

```dotenv
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-public-api-key

# Gemini API Configuration (for AI Insights)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### How to Get These Values

1. **Supabase URL & API Key:**
   - Go to https://supabase.com
   - Create a new project
   - Find API keys in Settings > API
   - Copy the Project URL and anon/public key

2. **Gemini API Key:**
   - Go to https://ai.google.dev
   - Click on "Get API Key"
   - Create a new API key for this project

## AI Integration (Gemini API)

### AI Capabilities
- **Smart Projections:** Predicts month-end consumption based on current usage trends
- **Tiered Bill Calculation:** Accurately calculates bills using the system's pricing tiers
- **Budget Analysis:** Compares projected spending against user's budget limit
- **Cost Optimization:** Generates device-specific recommendations to reduce consumption
- **Weather Consideration:** Takes into account seasonal factors and Delhi weather patterns
- **Savings Estimation:** Provides estimated rupees that can be saved with each recommendation

### Prompt Integration
The AI receives:
- Current month's energy usage by device
- Total kWh consumed to date
- Days into the month and day of week
- User's monthly budget limit (if set)
- Complete pricing tier structure
- Device consumption breakdown

### Output Format
The AI returns structured JSON containing:
```json
{
  "projected_kwh": 123.45,
  "estimated_bill": 456.78,
  "budget_status": {
    "has_budget": true,
    "budget_limit": 500.00,
    "within_budget": false,
    "excess_amount": -43.22,
    "message": "Projected spending exceeds budget by ₹43.22"
  },
  "tips": [
    "Tip with estimated savings...",
    "Tip with estimated savings...",
    "Tip with estimated savings..."
  ]
}
```

## Tech Stack

### Frontend
- **React 19.2:** Modern UI library with hooks
- **Vite 7.2:** Ultra-fast build tool
- **Tailwind CSS:** Utility-first CSS framework
- **Recharts 3.5:** React charting library
- **ESLint 9.39:** Code linting and standards

### Backend & Database
- **Supabase:** Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security
  - SQL functions and RPC endpoints
- **Gemini API:** Google's generative AI model

### Hardware Integration
- **ESP32:** Microcontroller with WiFi
- **ZMPT101B:** AC voltage sensor
- **ACS712:** AC current sensor
- **Precision calibration:** Sensor correction utilities

### Development
- **Node.js:** Runtime environment
- **npm:** Package management
- **Git:** Version control

## Hardware Requirements

### Sensors
- ZMPT101B AC voltage sensor
- ACS712-5A current sensor (or appropriate range)
- Burden resistor and filtering components

### Microcontroller
- ESP32 development board
- WiFi connectivity (2.4GHz)
- Power supply (5V USB or equivalent)

### Installation
For complete hardware setup instructions, refer to the main project README at the repository root.

## API Endpoints & Functions

### Supabase RPC Functions
- `get_monthly_stats(target_month)` - Fetch monthly aggregated data
- `calculate_monthly_bill(kwh_total)` - Calculate tiered billing

### Supabase Queries
- `devices` - Device list and status
- `energy_data` - Raw sensor readings
- `user_budget` - User budget preferences

### Gemini API
- Model: `gemini-2.5-flash`
- Endpoint: Google AI API
- Rate limiting: Standard API quotas apply

## Performance Optimization

### Database
- **Indexed queries:** Fast lookups on device_id, timestamp
- **Aggregation:** Server-side calculations reduce data transfer
- **Pagination:** Efficient data streaming for large datasets
- **Caching:** Supabase real-time subscriptions reduce polling

### Frontend
- **Code splitting:** Vite automatically optimizes bundles
- **Lazy loading:** Components loaded on demand
- **Chart optimization:** Recharts with performance tuning
- **Dark theme:** Reduces eye strain and improves battery life

## Troubleshooting

### Common Issues

1. **"VITE_GEMINI_API_KEY not found"**
   - Ensure `.env` file is created in smartmeterdashboard directory
   - Restart dev server after adding `.env` file

2. **Supabase Connection Error**
   - Check internet connectivity
   - Verify API URL and keys are correct
   - Check Supabase project is active

3. **No Data Displayed**
   - Ensure ESP32 is sending data to Supabase
   - Check device table has entries
   - Verify energy_data table is receiving readings

4. **Budget not appearing in Analytics**
   - Set a budget in Budget Settings page first
   - Check user_budget table in Supabase
   - Refresh the Analytics page

## Future Enhancements

- Mobile app (React Native)
- Historical trend analysis
- Custom alert thresholds
- Export reports (PDF/CSV)
- Multi-user support
- Advanced forecasting models
- Integration with smart grid APIs

## License

© 2025 Smart Energy Meter Dashboard. All rights reserved.
