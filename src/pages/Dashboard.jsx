
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

function Dashboard() {
 
  const pieData = {
    labels: ["Valid Records", "Invalid Records"],
    datasets: [
      {
        data: [300, 50],
        backgroundColor: ["#22c55e", "#ef4444"],
        hoverOffset: 10,
      },
    ],
  };


  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Records Processed",
        data: [100, 200, 150, 300, 250],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const doughnutData = {
    labels: ["Category A", "Category B", "Category C"],
    datasets: [
      {
        data: [120, 80, 150],
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
        hoverOffset: 10,
      },
    ],
  };
  const bubbleData = {
    datasets: [
      {
        label: "Records Analysis",
        data: [
          { x: 10, y: 20, r: 15 },
          { x: 15, y: 10, r: 10 },
          { x: 7, y: 25, r: 12 },
          { x: 20, y: 15, r: 18 },
        ],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Errors Detected",
        data: [5, 10, 7, 12, 9],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
          <span className="text-3xl font-bold text-green-500">350</span>
          <span className="text-gray-300">Total Records</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
          <span className="text-3xl font-bold text-green-500">300</span>
          <span className="text-gray-300">Valid Records</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
          <span className="text-3xl font-bold text-red-500">50</span>
          <span className="text-gray-300">Invalid Records</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-500">85%</span>
          <span className="text-gray-300">Success Rate</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
            <div className="bg-gray-800 p-6 rounded-xl shadow-md h-80">
              <h3 className="font-semibold mb-4 text-center text-gray-300">Record Status</h3>
              <div className="w-full h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>


  
        <div className="bg-gray-800 p-6 rounded-xl shadow-md h-80">
          <h3 className="font-semibold mb-4 text-center text-gray-300">Records by Category</h3>
           <div className="w-full h-64">
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>  
        </div>

       
        <div className="bg-gray-800 p-6 rounded-xl shadow-md h-80">
          <h3 className="font-semibold mb-4 text-center text-gray-300">Records Processed Over Time</h3>
          <Bar
            data={barData}
            options={{
              plugins: { legend: { labels: { color: "#e5e7eb" } } },
              scales: { x: { ticks: { color: "#e5e7eb" } }, y: { ticks: { color: "#e5e7eb" } } },
            }}
          />
        </div>
            
    
        <div className="bg-gray-800 p-6 rounded-xl shadow-md h-80">
          <h3 className="font-semibold mb-4 text-center text-gray-300">Errors Detected Over Time</h3>
          <Line
            data={lineData}
            options={{
              plugins: { legend: { labels: { color: "#e5e7eb" } } },
              scales: { x: { ticks: { color: "#e5e7eb" } }, y: { ticks: { color: "#e5e7eb" } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
