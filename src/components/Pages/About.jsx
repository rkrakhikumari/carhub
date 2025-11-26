import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Car Hub Management System is a comprehensive solution designed to
              streamline vehicle fleet management operations.
            </p>
            <p>
              Our platform provides real-time tracking, maintenance management,
              and driver coordination in one unified interface.
            </p>
            <p>
              It is built to simplify daily operations and improve visibility
              across your fleet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
