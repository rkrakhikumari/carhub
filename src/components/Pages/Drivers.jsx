import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Drivers = ({ drivers = [], userRole, setDrivers, cars = [], setCars }) => {
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [newDriver, setNewDriver] = useState({
    uid: '',
    name: '',
    status: 'Off Duty',
    vehicle: '-',
  });

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleAddDriver = () => {
    if (!newDriver.uid || !newDriver.name) {
      alert('Please fill UID and Name');
      return;
    }

    if (drivers.some((d) => d.uid === newDriver.uid)) {
      alert('UID already exists');
      return;
    }

    setDrivers((prev) => [...prev, newDriver]);
    setNewDriver({
      uid: '',
      name: '',
      status: 'Off Duty',
      vehicle: '-',
    });
    setShowAddDriver(false);
    alert('Driver added successfully');
  };

  const handleDeleteDriver = (uid) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers((prev) => prev.filter((d) => d.uid !== uid));
      alert('Driver deleted successfully');
    }
  };

  const assignCarToDriver = (driverName, vehicleNumber) => {
    setCars((prevCars) =>
      prevCars.map((car) => {
        if (car.number === vehicleNumber) {
          return {
            ...car,
            driver: driverName,
            status: 'Handover to Driver',
          };
        }
        return car;
      })
    );

    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => {
        if (driver.name === driverName) {
          return {
            ...driver,
            status: 'On Duty',
            vehicle: vehicleNumber,
          };
        }
        return driver;
      })
    );

    alert(`Car ${vehicleNumber} assigned to ${driverName}`);
  };

  const unassignCarFromDriver = (driverName, vehicleNumber) => {
    setCars((prevCars) =>
      prevCars.map((car) => {
        if (car.number === vehicleNumber) {
          return {
            ...car,
            driver: '-',
            status: 'In Hub',
          };
        }
        return car;
      })
    );

    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => {
        if (driver.name === driverName) {
          return {
            ...driver,
            status: 'Off Duty',
            vehicle: '-',
          };
        }
        return driver;
      })
    );

    alert(`Car ${vehicleNumber} unassigned from ${driverName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Drivers</h2>
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAddDriver(true)}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <Plus size={18} />
                Add Driver
              </button>
            )}
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter by driver name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">UID</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                  {(userRole === 'admin' || userRole === 'crm') && (
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.uid} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{driver.uid}</td>
                      <td className="py-4 px-4 font-medium">{driver.name}</td>
                      <td className="py-4 px-4">{driver.vehicle}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            driver.status === 'On Duty'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      {(userRole === 'admin' || userRole === 'crm') && (
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignCarToDriver(driver.name, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="px-2 py-1 border border-gray-300 rounded text-sm bg-green-50 text-green-700"
                              defaultValue=""
                            >
                              <option value="">Assign Car</option>
                              {cars
                                .filter((c) => c.status === 'In Hub')
                                .map((car) => (
                                  <option key={car.id} value={car.number}>
                                    {car.number}
                                  </option>
                                ))}
                            </select>

                            {driver.vehicle !== '-' && (
                              <button
                                onClick={() =>
                                  unassignCarFromDriver(driver.name, driver.vehicle)
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                              >
                                Unassign
                              </button>
                            )}

                            {userRole === 'admin' && (
                              <button
                                onClick={() => handleDeleteDriver(driver.uid)}
                                className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No drivers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddDriver && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Driver</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver UID
                </label>
                <input
                  type="text"
                  value={newDriver.uid}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, uid: e.target.value }))
                  }
                  placeholder="e.g., DR001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) =>
                    setNewDriver((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddDriver(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;