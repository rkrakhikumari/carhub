import React, { useState } from 'react';
import { Download, Plus, Eye } from 'lucide-react';

const Attendance = ({ cars = [], drivers = [], attendance = [], setAttendance, userRole, setCars }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterName, setFilterName] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('Present');
  const [showDriverProfile, setShowDriverProfile] = useState(false);
  const [selectedDriverProfile, setSelectedDriverProfile] = useState(null);
  const [dateFromFilter, setDateFromFilter] = useState(new Date().toISOString().split('T')[0]);
  const [dateToFilter, setDateToFilter] = useState(new Date().toISOString().split('T')[0]);

  const todayDate = new Date().toISOString().split('T')[0];

  const handleMarkAttendance = () => {
    if (!selectedDriver || !selectedVehicle || !selectedStatus) {
      alert('Please fill all fields');
      return;
    }

    const record = {
      id: Date.now(),
      driverName: selectedDriver,
      vehicle: selectedVehicle,
      date: selectedDate,
      status: selectedStatus,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAttendance((prev) => [...prev, record]);
    alert('Attendance marked successfully');
    setSelectedDriver('');
    setSelectedVehicle('');
    setSelectedStatus('Present');
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const filteredDriverList = drivers.length > 0
    ? drivers.filter((driver) => {
        const matchName = driver.name.toLowerCase().includes(filterName.toLowerCase());
        const matchVehicle = filterVehicle === '' || (driver.vehicle && driver.vehicle.includes(filterVehicle));
        return matchName && matchVehicle;
      })
    : [];

  const filteredTodayAttendance = attendance && attendance.length > 0
    ? attendance.filter((record) => record.date === todayDate)
    : [];

  const getDriverStatus = (driverName) => {
    if (!cars || cars.length === 0) return 'Off Duty';
    const car = cars.find((c) => c.driver === driverName);
    if (car && car.status === 'Handover to Driver') {
      return 'On Duty';
    }
    return 'Off Duty';
  };

  const getDriverVehicle = (driverName) => {
    if (!cars || cars.length === 0) return '-';
    const car = cars.find((c) => c.driver === driverName);
    return car ? car.number : '-';
  };

  const getPresentDays = (driverName) => {
    if (!attendance || attendance.length === 0) return 0;
    return attendance.filter(
      (a) => a.driverName === driverName && a.status === 'Present'
    ).length;
  };

  const getLeaveDays = (driverName) => {
    if (!attendance || attendance.length === 0) return 0;
    return attendance.filter(
      (a) => a.driverName === driverName && a.status === 'Leave'
    ).length;
  };

  const getPWCDays = (driverName) => {
    if (!attendance || attendance.length === 0) return 0;
    return attendance.filter(
      (a) => a.driverName === driverName && a.status === 'PWC'
    ).length;
  };

  const getNotMarkedDays = (driverName) => {
    if (!attendance || attendance.length === 0) return 0;
    return attendance.filter(
      (a) => a.driverName === driverName && a.status === 'Not Marked'
    ).length;
  };

  const exportToExcel = (driverName) => {
    const driverRecords = attendance.filter((a) => a.driverName === driverName);
    let csvContent = 'Date,Status,Time,Vehicle\n';
    driverRecords.forEach((record) => {
      csvContent += `${record.date},${record.status},${record.timestamp},${record.vehicle}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `${driverName}_attendance.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAllDriversToExcel = () => {
    if (filteredDriverList.length === 0) {
      alert('No drivers to export');
      return;
    }

    let csvContent = 'Driver Name,UUID,Vehicle,Date,Status,Time\n';
    
    filteredDriverList.forEach((driver) => {
      const dateRangeRecords = getFilteredAttendanceByDateRange(driver.name);
      
      if (dateRangeRecords.length > 0) {
        dateRangeRecords.forEach((record) => {
          csvContent += `${driver.name},${driver.uid},${record.vehicle},${record.date},${record.status},${record.timestamp}\n`;
        });
      } else {
        csvContent += `${driver.name},${driver.uid},${getDriverVehicle(driver.name)},No Records,-,-\n`;
      }
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `all_drivers_attendance_${dateFromFilter}_to_${dateToFilter}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getTotalDrivers = () => drivers.length;
  const getTodayPresent = () => filteredTodayAttendance.filter((a) => a.status === 'Present').length;
  const getTodayPWC = () => filteredTodayAttendance.filter((a) => a.status === 'PWC').length;
  const getTodayLeave = () => filteredTodayAttendance.filter((a) => a.status === 'Leave').length;
  const getTodayNotMarked = () => drivers.length - filteredTodayAttendance.length;

  const getFilteredAttendanceByDateRange = (driverName) => {
    if (!attendance || attendance.length === 0) return [];
    return attendance.filter(
      (a) => a.driverName === driverName && a.date >= dateFromFilter && a.date <= dateToFilter
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6 border-b border-gray-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-gray-800 text-gray-800 bg-gray-800 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'list'
                ? 'border-b-2 border-gray-800 text-gray-800 bg-gray-800 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Driver List
          </button>
          <button
            onClick={() => setActiveTab('mark')}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === 'mark'
                ? 'border-b-2 border-gray-800 text-gray-800 bg-gray-800 text-white'
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
                <p className="text-gray-600 text-sm font-medium mb-2">Total drivers</p>
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
                <p className="text-gray-600 text-sm font-medium mb-2">Not marked</p>
                <p className="text-3xl font-bold text-gray-600">{getTodayNotMarked()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Attendance for {todayDate}
              </h3>

              <div className="space-y-3">
                {drivers.length > 0 ? (
                  drivers.map((driver) => {
                    const todayRecord = filteredTodayAttendance.find(
                      (a) => a.driverName === driver.name
                    );
                    const status = todayRecord?.status || 'Not Marked';

                    let statusColor = 'bg-gray-100 text-gray-700';
                    if (status === 'Present') statusColor = 'bg-green-100 text-green-700';
                    else if (status === 'Leave') statusColor = 'bg-red-100 text-red-700';
                    else if (status === 'PWC') statusColor = 'bg-yellow-100 text-yellow-700';

                    return (
                      <div
                        key={driver.uid}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-bold text-gray-800">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.uid}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No drivers available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Driver List Tab */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Driver List</h2>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="hidden md:grid grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-gray-300">
              <div className="font-bold text-gray-700">Name</div>
              <div className="font-bold text-gray-700">UUID</div>
              <div className="font-bold text-gray-700">Vehicle</div>
              <div className="font-bold text-gray-700">Action</div>
            </div>

            <div className="space-y-4">
              {filteredDriverList.length > 0 ? (
                filteredDriverList.map((driver) => (
                  <div key={driver.uid} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-bold text-gray-800">{driver.name}</p>
                        <p className="text-xs text-gray-500 md:hidden">Vehicle: {getDriverVehicle(driver.name)}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm text-gray-600">UUID:</p>
                        <p className="text-xs text-gray-500">{driver.uid}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-gray-600">{getDriverVehicle(driver.name)}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDriverProfile(driver);
                          setShowDriverProfile(true);
                        }}
                        className="bg-[#364153] text-white px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 justify-center md:justify-start"
                      >
                        <Eye size={16} />
                        Profile
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No drivers found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mark Attendance Tab */}
        {activeTab === 'mark' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
              <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Filter by name/vehicle"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 flex-1 md:w-64"
                />
                <button
                  onClick={exportAllDriversToExcel}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition whitespace-nowrap"
                >
                  <Download size={18} />
                  Export All
                </button>
              </div>
            </div>

            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Date Range Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Showing attendance records from {dateFromFilter} to {dateToFilter}
              </p>
            </div>

            <div className="space-y-4">
              {filteredDriverList.length > 0 ? (
                filteredDriverList.map((driver) => {
                  const dateRangeRecords = getFilteredAttendanceByDateRange(driver.name);
                  const presentCount = dateRangeRecords.filter((a) => a.status === 'Present').length;
                  const leaveCount = dateRangeRecords.filter((a) => a.status === 'Leave').length;
                  const pwcCount = dateRangeRecords.filter((a) => a.status === 'PWC').length;

                  return (
                    <div
                      key={driver.uid}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                        <div>
                          <p className="font-bold text-lg text-gray-800">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.uid}</p>
                          <p className="text-sm text-gray-600 mt-1">Vehicle: {getDriverVehicle(driver.name)}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">Present</p>
                            <p className="text-lg font-bold text-green-600">{presentCount}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">Leave</p>
                            <p className="text-lg font-bold text-red-600">{leaveCount}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-600">PWC</p>
                            <p className="text-lg font-bold text-yellow-600">{pwcCount}</p>
                          </div>
                        </div>
                      </div>

                      {dateRangeRecords.length > 0 && (
                        <div className="mb-4 bg-white p-4 rounded-lg border border-gray-300">
                          <p className="text-sm font-bold text-gray-700 mb-3">Attendance Records:</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {dateRangeRecords.map((record) => {
                              let statusColor = 'bg-gray-100 text-gray-700';
                              if (record.status === 'Present') statusColor = 'bg-green-100 text-green-700';
                              else if (record.status === 'Leave') statusColor = 'bg-red-100 text-red-700';
                              else if (record.status === 'PWC') statusColor = 'bg-yellow-100 text-yellow-700';

                              return (
                                <div key={record.id} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">{record.date}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor}`}>
                                    {record.status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <button
                          onClick={() => {
                            const record = {
                              id: Date.now(),
                              driverName: driver.name,
                              vehicle: getDriverVehicle(driver.name),
                              date: new Date().toISOString().split('T')[0],
                              status: 'Present',
                              timestamp: new Date().toLocaleTimeString(),
                            };
                            setAttendance((prev) => [...prev, record]);
                            alert(`Attendance marked as Present for ${driver.name}`);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-bold uppercase text-sm"
                        >
                          P
                        </button>
                        <button
                          onClick={() => {
                            const record = {
                              id: Date.now(),
                              driverName: driver.name,
                              vehicle: getDriverVehicle(driver.name),
                              date: new Date().toISOString().split('T')[0],
                              status: 'Leave',
                              timestamp: new Date().toLocaleTimeString(),
                            };
                            setAttendance((prev) => [...prev, record]);
                            alert(`Attendance marked as Leave for ${driver.name}`);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold uppercase text-sm"
                        >
                          LEAVE
                        </button>
                        <button
                          onClick={() => {
                            const record = {
                              id: Date.now(),
                              driverName: driver.name,
                              vehicle: getDriverVehicle(driver.name),
                              date: new Date().toISOString().split('T')[0],
                              status: 'PWC',
                              timestamp: new Date().toLocaleTimeString(),
                            };
                            setAttendance((prev) => [...prev, record]);
                            alert(`Attendance marked as PWC for ${driver.name}`);
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-bold uppercase text-sm"
                        >
                          PWC
                        </button>
                        <button
                          onClick={() => exportToExcel(driver.name)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                        >
                          <Download size={16} />
                          Export Excel
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No drivers found matching your filter
                </div>
              )}
            </div>
          </div>
        )}

        {/* Driver Profile Modal */}
        {showDriverProfile && selectedDriverProfile && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Driver Profile</h2>
                <button
                  onClick={() => setShowDriverProfile(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">Name</p>
                  <p className="text-xl font-bold text-gray-800">{selectedDriverProfile.name}</p>
                </div>

                <div className="bg-gray-200 p-3 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">UID</p>
                  <p className="text-xl font-bold text-gray-800">{selectedDriverProfile.uid}</p>
                </div>

                <div className="bg-gray-200 p-3 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">Current Vehicle</p>
                  <p className="text-xl font-bold text-gray-800">{getDriverVehicle(selectedDriverProfile.name)}</p>
                </div>

                <div className="bg-gray-200 p-3 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      getDriverStatus(selectedDriverProfile.name) === 'On Duty'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {getDriverStatus(selectedDriverProfile.name)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {getPresentDays(selectedDriverProfile.name)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Leave</p>
                    <p className="text-2xl font-bold text-red-600">
                      {getLeaveDays(selectedDriverProfile.name)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">PWC</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {getPWCDays(selectedDriverProfile.name)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-xs font-medium">Not Marked</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {getNotMarkedDays(selectedDriverProfile.name)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => exportToExcel(selectedDriverProfile.name)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 justify-center"
                  >
                    <Download size={18} />
                    Export Excel
                  </button>
                  <button
                    onClick={() => setShowDriverProfile(false)}
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;