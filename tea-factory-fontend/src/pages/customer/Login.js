import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:3001";
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter your email");
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Login failed");
      localStorage.setItem("customerEmail", data.customer.email);
      localStorage.setItem("customerName", data.customer.name || "");
      toast.success("Logged in");
      navigate("/customer/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    if (!email.trim()) return toast.error("Enter your email");
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Registration failed");
      toast.success("Registered successfully. You can log in now.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <h3 className="text-green-600 text-2xl font-bold mb-4">Customer Login</h3>
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onRegister}
              className={`flex-1 border border-blue-500 text-blue-500 font-medium py-2 rounded-md hover:bg-blue-50 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Register Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
