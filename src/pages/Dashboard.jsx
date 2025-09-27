import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, TrendingUp, Users, FileText, Activity } from "lucide-react";

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // State
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [hourlyTrend, setHourlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1", "#ec4899", "#14b8a6"];

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        transactionsRes,
        customersRes,
        filesRes,
        topRes,
        statusRes,
        paymentRes,
        trendRes,
      ] = await Promise.all([
        axios.get(`${backendUrl}/api/transaction`),
        axios.get(`${backendUrl}/api/customers`),
        axios.get(`${backendUrl}/api/files`),
        axios.get(`${backendUrl}/api/top`),
        axios.get(`${backendUrl}/api/status`),
        axios.get(`${backendUrl}/api/payment-methods`),
        axios.get(`${backendUrl}/api/trend`),
      ]);

      setTotalTransactions(transactionsRes.data.total || 0);
      setTotalCustomers(customersRes.data.total || 0);
      setTotalFiles(filesRes.data.total || 0);
      setTopCustomers(Array.isArray(topRes.data) ? topRes.data : []);
      setTransactionStatus(Array.isArray(statusRes.data) ? statusRes.data : []);
      setPaymentMethods(Array.isArray(paymentRes.data) ? paymentRes.data : []);
      setHourlyTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const TopCustomersPieChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={topCustomers}
          dataKey="value"
          nameKey="name"
          outerRadius="80%"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {topCustomers.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Spend"]} />
      </PieChart>
    </ResponsiveContainer>
  ), [topCustomers]);

  const PaymentMethodsChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={paymentMethods}
          dataKey="value"
          nameKey="method"
          outerRadius="75%"
          innerRadius="45%"
          label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
        >
          {paymentMethods.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value.toLocaleString(), "Transactions"]} />
      </PieChart>
    </ResponsiveContainer>
  ), [paymentMethods]);

  if (loading && !totalTransactions) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white bg-gray-900">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md">
          <p className="text-red-300 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        {lastUpdated && <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">

  {/* Total Transactions */}
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4">
    <div className="p-3 bg-green-500/20 rounded-full">
      <TrendingUp className="w-8 h-8 text-green-400" />
    </div>
    <div className="text-center w-full">
      <p className="text-gray-400 text-sm">Total Transactions</p>
      <p className="text-2xl font-bold text-green-400">{totalTransactions.toLocaleString()}</p>
    </div>
  </div>

  {/* Total Customers */}
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4">
    <div className="p-3 bg-blue-500/20 rounded-full">
      <Users className="w-8 h-8 text-blue-400" />
    </div>
    <div className="text-center w-full">
      <p className="text-gray-400 text-sm">Total Customers</p>
      <p className="text-2xl font-bold text-blue-400">{totalCustomers.toLocaleString()}</p>
    </div>
  </div>

  {/* Total Files */}
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-4">
    <div className="p-3 bg-yellow-500/20 rounded-full">
      <FileText className="w-8 h-8 text-yellow-400" />
    </div>
    <div className="text-center w-full">
      <p className="text-gray-400 text-sm">Total Files</p>
      <p className="text-2xl font-bold text-yellow-400">{totalFiles.toLocaleString()}</p>
    </div>
  </div>

</div>


      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Transaction Status */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center">Transaction Status</h3>
          <div className="h-64">
            {transactionStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionStatus} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="status" stroke="#e5e7eb" angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#e5e7eb" />
                  <Tooltip formatter={(value) => [value.toLocaleString(), "Count"]} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center mt-16">No data available</p>
            )}
          </div>
        </div>
        {/* Top Customers */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center flex items-center justify-center gap-2">
            <Activity className="w-5 h-5" /> Top Customers by Spend
          </h3>
          <div className="h-64">{topCustomers.length > 0 ? TopCustomersPieChart : <p className="text-gray-400 text-center mt-16">No data available</p>}</div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center">Payment Methods</h3>
          <div className="h-64">{paymentMethods.length > 0 ? PaymentMethodsChart : <p className="text-gray-400 text-center mt-16">No data available</p>}</div>
        </div>

      

        {/* Hourly Trend */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center">Hourly Transaction Trend</h3>
          <div className="h-64">
            {hourlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#e5e7eb" />
                  <YAxis stroke="#e5e7eb" />
                  <Tooltip formatter={(value) => [value.toLocaleString(), "Transactions"]} />
                  <Line type="monotone" dataKey="transactions" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center mt-16">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
