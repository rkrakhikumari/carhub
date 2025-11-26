import React, { useState } from 'react';

const AttendanceModal = ({ visible, onClose, driver }) => {
  const [uidInput, setUidInput] = useState('');

  if (!visible || !driver) return null;

  const generateReport = () => {
    if (uidInput === driver.uid) {
      alert(`Attendance report generated for ${driver.name}`);
    } else {
      alert('Invalid UID!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Generate Monthly Attendance</h3>

        <p className="mb-2 text-gray-600">Driver: {driver.name}</p>

        <input
          type="text"
          placeholder="Enter Driver UID"
          value={uidInput}
          onChange={(e) => setUidInput(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>

          <button
            onClick={generateReport}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
