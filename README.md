# Smart Energy Meter Dashboard

## Overview

**Smart Energy Meter with AI-Driven Tiered Billing Analysis** is a sophisticated IoT solution designed to bridge the gap between raw electricity usage and actionable financial insights. Unlike standard energy meters, this system provides a granular, second-by-second breakdown of energy consumption across specific household loads—Lighting (Bulb), Workstations (Laptop), and Heavy Appliances (AC).

## Features

- **Real-Time Monitoring:** Track energy usage for individual devices with second-by-second precision.
- **Tiered Billing Engine:** Calculates your electricity bill using a complex tiered pricing model (e.g., ₹3 for the first 200 units, ₹8 for units above 1200).
- **AI-Powered Insights:** Integrates with Gemini API to provide predictive analytics, month-end usage projections, and actionable energy-saving tips.
- **High-Frequency Telemetry:** Handles minute-by-minute logging intervals, providing high-resolution charts without compromising browser performance.
- **Cloud Database:** Uses Supabase for secure, scalable, and real-time data storage and aggregation.
- **Modern Dashboard UI:** Built with React and Vite, featuring a dark theme and responsive design.

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

- **Analytics Tab:** View cumulative energy usage for each device, with daily breakdowns and AI-powered insights.
- **About Tab:** Learn more about the project, its technical capabilities, and the creators.
- **Device Control:** Monitor and manage individual devices in real time.

## Project Structure

```
Dashboard/
  smartmeterdashboard/
    public/
    src/
      components/
      pages/
      utils/
    .env
    index.html
    package.json
    vite.config.js
    ...
```

## Environment Variables

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: Supabase public API key
- `VITE_GEMINI_API_KEY`: Gemini API key for AI insights

## License

© 2025 Smart Energy Meter Dashboard. All rights reserved.
