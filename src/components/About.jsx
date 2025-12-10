export default function About() {
  try {
    return (
      <div data-name="about-page" data-file="components/About.jsx">
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">About</h1>
        
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Smart Energy Meter with AI-Driven Tiered Billing Analysis</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              This project is a sophisticated IoT solution designed to bridge the gap between raw electricity usage and actionable financial insights. Unlike standard energy meters that simply count units, this system provides a granular, second-by-second breakdown of energy consumption across specific household loads—Lighting (Bulb), Workstations (Laptop), and Heavy Appliances (AC).
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              At its core, the system utilizes an ESP32 microcontroller to fetch real-time voltage and current data from ZMPT101B and ACS712 sensors. This data is streamed to a Supabase Cloud Database, where millions of data points are logged and aggregated using server-side SQL functions to ensure millisecond-latency performance on the dashboard.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)] mt-6">Key Technical Capabilities:</h3>
            
            <div className="space-y-4 mb-4">
              <div className="pl-4 border-l-2 border-[var(--primary-color)]">
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">Precision Billing Engine</h4>
                <p className="text-[var(--text-secondary)] text-sm">
                  The system doesn't just track kWh; it applies a complex Tiered Pricing Model (e.g., ₹3 for the first 200 units, ₹8 for units above 1200) to calculate an exact, real-time bill estimate.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-blue-500">
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">Generative AI Integration</h4>
                <p className="text-[var(--text-secondary)] text-sm">
                  By leveraging the Gemini API, the dashboard offers an "On-Demand Energy Auditor." It analyzes historical consumption patterns to predict month-end usage and provides context-aware tips to reduce costs (e.g., "Your AC usage peaked at 2 AM; increasing the temperature by 2°C could save ₹150 this month").
                </p>
              </div>

              <div className="pl-4 border-l-2 border-purple-500">
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">High-Frequency Telemetry</h4>
                <p className="text-[var(--text-secondary)] text-sm">
                  Capable of handling minute-by-minute logging intervals, providing high-resolution charts without compromising browser performance through optimized server-side data aggregation.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-sm">
                IoT Integration
              </span>
              <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                AI Analytics
              </span>
              <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-400 rounded-full text-sm">
                Real-time Monitoring
              </span>
              <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full text-sm">
                Tiered Billing
              </span>
              <span className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-full text-sm">
                Cloud Database
              </span>
            </div>
          </div>

          <div className="card">
            <section className="pt-8 border-t border-gray-700">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Meet the Creators</h2>
                <p className="text-[var(--text-secondary)] text-sm">
                  Electrical Engineering Department, <span className="text-blue-400 font-medium">Delhi Technological University</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Creator 1: Shobhit */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center hover:border-blue-500/50 transition-colors shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl mb-4 ring-4 ring-slate-800">
                    S
                  </div>
                  <h3 className="text-white font-bold text-lg">Shobhit</h3>
                  <div className="mt-2 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
                    <p className="text-blue-400 text-sm font-mono">2K22/EE/256</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 uppercase tracking-wider font-semibold">Electrical Engineering</p>
                </div>

                {/* Creator 2: Shivam Verma */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500/50 transition-colors shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl mb-4 ring-4 ring-slate-800">
                    SV
                  </div>
                  <h3 className="text-white font-bold text-lg">Shivam Verma</h3>
                  <div className="mt-2 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
                    <p className="text-emerald-400 text-sm font-mono">2K22/EE/252</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 uppercase tracking-wider font-semibold">Electrical Engineering</p>
                </div>

                {/* Creator 3: Shubham */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center hover:border-purple-500/50 transition-colors shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl mb-4 ring-4 ring-slate-800">
                    Sh
                  </div>
                  <h3 className="text-white font-bold text-lg">Shubham</h3>
                  <div className="mt-2 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
                    <p className="text-purple-400 text-sm font-mono">2K22/EE/259</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 uppercase tracking-wider font-semibold">Electrical Engineering</p>
                </div>

              </div>
            </section>
            <div className="mt-8 pt-4 border-t border-gray-700">
              <p className="text-sm text-[var(--text-secondary)]">© 2025 Smart Energy Meter Dashboard. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}
