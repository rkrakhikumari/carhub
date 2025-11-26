import React from 'react';
import AttendanceModal from '../AttendanceModal';

const Drivers = ({
  drivers,
  showAttendanceModal,
  setShowAttendanceModal,
  selectedDriver,
  setSelectedDriver,
}) => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Drivers</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  UID
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Driver Name
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((d) => (
                <tr key={d.uid} className="border-b border-gray-200">
                  <td className="py-3 px-4">{d.uid}</td>
                  <td className="py-3 px-4">{d.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        d.status === 'On Duty'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedDriver(d);
                        setShowAttendanceModal(true);
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      Monthly Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AttendanceModal
        visible={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        driver={selectedDriver}
      />
    </div>
  );
};

export default Drivers;
