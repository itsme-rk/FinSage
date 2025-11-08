import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-hot-toast";
import AnalyticsChart from "../components/AnalyticsChart";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "OTHER",
    expense_type: "EXPENSE",
    date: "",
    description: "",
  });

  // Summary Data
  const [summaryData, setSummaryData] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [categoryData, setCategoryData] = useState([]);

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/expenses/");
      setExpenses(res.data.results || res.data);
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary data for analytics
  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/expenses/summary/");
      setSummaryData({
        total_income: res.data.total_income,
        total_expense: res.data.total_expense,
        balance: res.data.balance,
      });
      setCategoryData(res.data.category_breakdown);
    } catch (error) {
      console.error("Summary fetch error:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/expenses/", formData);
      toast.success("Expense added!");
      setShowForm(false);
      setFormData({
        title: "",
        amount: "",
        category: "OTHER",
        expense_type: "EXPENSE",
        date: "",
        description: "",
      });
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      toast.error("Error adding expense");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/api/expenses/${id}/`);
      toast.success("Expense deleted");
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">My Expenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <form
          onSubmit={handleAddExpense}
          className="bg-white shadow-md rounded-lg p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
              required
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="FOOD">Food</option>
              <option value="TRAVEL">Travel</option>
              <option value="BILLS">Bills</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              name="expense_type"
              value={formData.expense_type}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full mt-3"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Add Expense
          </button>
        </form>
      )}

      {/* Expense Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <p className="text-center p-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center p-6 text-gray-500">No expenses found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
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
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Analytics Section */}
      <AnalyticsChart
        categoryData={categoryData}
        summaryData={summaryData}
      />
    </div>
  );
}

export default Expenses;
