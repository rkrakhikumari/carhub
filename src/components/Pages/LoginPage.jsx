import React, { useState } from "react";
import { Lock } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    if (email && password) {
      onLogin(role);
    } else {
      alert("Please enter email and password");
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Car Hub</h1>
            <p className="text-gray-400 text-lg">Management System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Admin */}
            <div
              onClick={() => setSelectedRole("admin")}
              className="bg-gray-800 rounded-lg shadow-2xl p-8 cursor-pointer hover:bg-gray-700 hover:scale-105 transition duration-300"
            >
              <div className="text-center">
                <Lock size={48} className="mx-auto text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">Admin</h2>
                <p className="text-gray-300 mb-6">Full access to all features</p>

                <button className="w-full bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                  Login as Admin
                </button>
              </div>
            </div>

            {/* CRM */}
            <div
              onClick={() => setSelectedRole("crm")}
              className="bg-gray-800 rounded-lg shadow-2xl p-8 cursor-pointer hover:bg-gray-700 hover:scale-105 transition duration-300"
            >
              <div className="text-center">
                <Lock size={48} className="mx-auto text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">CRM</h2>
                <p className="text-gray-300 mb-6">Manage drivers & attendance</p>

                <button className="w-full bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                  Login as CRM
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">
            Select your role to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">

          <button
            onClick={() => {
              setSelectedRole(null);
              setEmail("");
              setPassword("");
            }}
            className="mb-6 text-gray-600 hover:text-black text-sm"
          >
            ← Back to Role Selection
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
              <Lock className="text-black" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedRole === "admin" ? "Admin Login" : "CRM Login"}
            </h1>
            <p className="text-gray-500 mt-2">Car Hub Management System</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={() => handleLogin(selectedRole)}
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition duration-200"
            >
              Login
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Demo: Use any email & password
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
