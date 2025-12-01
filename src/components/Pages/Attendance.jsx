import React, { useState, useEffect } from 'react';
import { Download, Eye, AlertCircle } from 'lucide-react';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drivers, setDrivers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDriverProfile, setShowDriverProfile] = useState(false);
  const [selectedDriverProfile, setSelectedDriverProfile] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch drivers
  useEffect(() => {
    fetchDrivers();
    fetchAttendance();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (err) {
      setError('Failed to fetch drivers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  const markAttendance = async (driverId, driverName, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: driverId,
          driver_name: driverName,
          status: status,
          date: todayDate,
          timestamp: new Date().toLocaleTimeString(),
        }),
      });

      if (response.ok) {
        await fetchAttendance();
        alert(`Attendance marked as ${status} for ${driverName}`);
      } else {
        alert('Failed to mark attendance');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/attendance/export`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `all_drivers_attendance_${todayDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDriverList = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const todayAttendance = attendance.filter((record) => record.date === todayDate);
  const getTotalDrivers = () => drivers.length;
  const getTodayPresent = () => todayAttendance.filter((a) => a.status === 'Present').length;
  const getTodayPWC = () => todayAttendance.filter((a) => a.status === 'PWC').length;
  const getTodayLeave = () => todayAttendance.filter((a) => a.status === 'Leave').length;
  const getTodayNotMarked = () => drivers.length - todayAttendance.length;

  const getTodayStatus = (driverName) => {
    const record = todayAttendance.find((a) => a.driver_name === driverName);
    return record?.status || 'Not Marked';
  };

  const getAttendanceStats = (driverId) => {
    const driverRecords = attendance.filter((a) => a.driver_id === driverId);
    return {
      present: driverRecords.filter((a) => a.status === 'Present').length,
      leave: driverRecords.filter((a) => a.status === 'Leave').length,
      pwc: driverRecords.filter((a) => a.status === 'PWC').length,
      total: driverRecords.length,
    };
  };

  if (loading && !drivers.length) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-gray-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-gray-800 text-white bg-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'list'
                ? 'border-b-2 border-gray-800 text-white bg-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Driver List
          </button>
          <button
            onClick={() => setActiveTab('mark')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'mark'
                ? 'border-b-2 border-gray-800 text-white bg-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mark Attendance
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Drivers</p>
                <p className="text-3xl font-bold text-gray-800">{getTotalDrivers()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Present</p>
                <p className="text-3xl font-bold text-green-600">{getTodayPresent()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">PWC</p>
                <p className="text-3xl font-bold text-yellow-600">{getTodayPWC()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Leave</p>
                <p className="text-3xl font-bold text-red-600">{getTodayLeave()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Not Marked</p>
                <p className="text-3xl font-bold text-gray-600">{getTodayNotMarked()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance for {todayDate}</h3>
              <div className="space-y-3">
                {drivers.length > 0 ? (
                  drivers.map((driver) => {
                    const status = getTodayStatus(driver.name);
                    let statusColor = 'bg-gray-100 text-gray-700';
                    if (status === 'Present') statusColor = 'bg-green-100 text-green-700';
                    else if (status === 'Leave') statusColor = 'bg-red-100 text-red-700';
                    else if (status === 'PWC') statusColor = 'bg-yellow-100 text-yellow-700';

                    return (
                      <div key={driver.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-bold text-gray-800">{driver.name}</p>
                          <p className="text-sm text-gray-500">ID: {driver.id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">No drivers available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Driver List Tab */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver List</h2>
            <input
              type="text"
              placeholder="Search drivers..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-6"
            />

            <div className="hidden md:grid grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-gray-300">
              <div className="font-bold text-gray-700">Name</div>
              <div className="font-bold text-gray-700">ID</div>
              <div className="font-bold text-gray-700">Total Records</div>
              <div className="font-bold text-gray-700">Action</div>
            </div>

            <div className="space-y-4">
              {filteredDriverList.length > 0 ? (
                filteredDriverList.map((driver) => {
                  const stats = getAttendanceStats(driver.id);
                  return (
                    <div key={driver.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-bold text-gray-800">{driver.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">ID: {driver.id}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-gray-600">{driver.id}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-gray-600">{stats.total}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDriverProfile(driver);
                            setShowDriverProfile(true);
                          }}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 justify-center md:justify-start"
                        >
                          <Eye size={16} />
                          Profile
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">No drivers found</div>
              )}
            </div>
          </div>
        )}

        {/* Mark Attendance Tab */}
        {activeTab === 'mark' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
              <button
                onClick={exportToExcel}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition whitespace-nowrap disabled:opacity-50"
              >
                <Download size={18} />
                {loading ? 'Exporting...' : 'Export All Excel'}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search drivers..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-6"
            />

            <div className="space-y-4">
              {filteredDriverList.length > 0 ? (
                filteredDriverList.map((driver) => {
                  const stats = getAttendanceStats(driver.id);
                  const status = getTodayStatus(driver.name);

                  return (
                    <div key={driver.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                        <div>
                          <p className="font-bold text-lg text-gray-800">{driver.name}</p>
                          <p className="text-sm text-gray-500">ID: {driver.id}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">Present</p>
                            <p className="text-lg font-bold text-green-600">{stats.present}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">Leave</p>
                            <p className="text-lg font-bold text-red-600">{stats.leave}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">PWC</p>
                            <p className="text-lg font-bold text-yellow-600">{stats.pwc}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800">Today Status: <span className="text-blue-600">{status}</span></p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <button
                          onClick={() => markAttendance(driver.id, driver.name, 'Present')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-bold text-sm"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(driver.id, driver.name, 'PWC')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-bold text-sm"
                        >
                          PWC
                        </button>
                        <button
                          onClick={() => markAttendance(driver.id, driver.name, 'Leave')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold text-sm"
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">No drivers found</div>
              )}
            </div>
          </div>
        )}

        {/* Driver Profile Modal */}
        {showDriverProfile && selectedDriverProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Driver Profile</h2>
                <button
                  onClick={() => setShowDriverProfile(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">Driver Name</p>
                  <p className="text-xl font-bold text-gray-800">{selectedDriverProfile.name}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">Driver ID</p>
                  <p className="text-xl font-bold text-gray-800">{selectedDriverProfile.id}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {getAttendanceStats(selectedDriverProfile.id).present}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Leave</p>
                    <p className="text-2xl font-bold text-red-600">
                      {getAttendanceStats(selectedDriverProfile.id).leave}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">PWC</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {getAttendanceStats(selectedDriverProfile.id).pwc}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {getAttendanceStats(selectedDriverProfile.id).total}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDriverProfile(false)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;