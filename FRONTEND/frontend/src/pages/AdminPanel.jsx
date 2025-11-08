import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";

function AdminPanel() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
    pending_count: 0,
  });

  const fetchExpenses = async (filter = "PENDING") => {
    try {
      const res = await api.get(`/api/expenses/status/${filter.toLowerCase()}/`);
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/expenses/summary/");
      const pending = await api.get("/api/expenses/status/pending/");
      setSummary({
        total_income: res.data.total_income,
        total_expense: res.data.total_expense,
        balance: res.data.balance,
        pending_count: pending.data.length,
      });
    } catch (error) {
      toast.error("Failed to load summary");
    }
  };

  useEffect(() => {
    fetchExpenses(statusFilter);
    fetchSummary();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/expenses/${id}/`, { status: newStatus });
      toast.success(`Expense ${newStatus.toLowerCase()}!`);
      fetchExpenses(statusFilter);
      fetchSummary();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Income</p>
          <h2 className="text-xl font-semibold text-blue-700">₹{summary.total_income}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Total Expense</p>
          <h2 className="text-xl font-semibold text-red-700">₹{summary.total_expense}</h2>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Net Balance</p>
          <h2 className="text-xl font-semibold text-green-700">₹{summary.balance}</h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Pending Requests</p>
          <h2 className="text-xl font-semibold text-yellow-700">{summary.pending_count}</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mt-6">
        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setLoading(true);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              statusFilter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Expense Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto mt-4">
        {loading ? (
          <p className="text-center p-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center p-6 text-gray-500">No {statusFilter.toLowerCase()} expenses found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{exp.user}</td>
                  <td className="p-3">{exp.title}</td>
                  <td className="p-3">₹{exp.amount}</td>
                  <td className="p-3">{exp.category}</td>
                  <td className="p-3">{exp.expense_type}</td>
                  <td className="p-3">{exp.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        exp.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : exp.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {exp.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(exp.id, "APPROVED")}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(exp.id, "REJECTED")}
                          className="text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
