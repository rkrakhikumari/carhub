import React from 'react';
import { Plus, Search, Filter, X, Eye } from 'lucide-react';

const Status = ({
  cars,
  setCars,
  searchCarNumber,
  setSearchCarNumber,
  showCarDetails,
  setShowCarDetails,
  selectedCar,
  setSelectedCar,
  filterNumber,
  setFilterNumber,
  filterStatus,
  setFilterStatus,
  showAddCar,
  setShowAddCar,
  newCar,
  setNewCar,
  handleSearchCar,
  handleFileUpload,
  handleFileUploadDetail,
  handleAddCar,
  getStatusColor,
}) => {
  const filteredCars = cars.filter((car) => {
    const matchNumber = car.number
      .toLowerCase()
      .includes(filterNumber.toLowerCase());
    const matchStatus = filterStatus === '' || car.status === filterStatus;
    return matchNumber && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {showCarDetails && selectedCar ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={() => setShowCarDetails(false)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to List
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Car Details: {selectedCar.number}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Number
                </label>
                <input
                  type="text"
                  value={selectedCar.number}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={selectedCar.driver}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <input
                  type="text"
                  value={selectedCar.status}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Location
                </label>
                <input
                  type="text"
                  value={selectedCar.workLocation}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Car Photos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCar.frontView ? (
                  <img
                    src={selectedCar.frontView}
                    alt="Front"
                    className="h-40 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">
                    Front View
                  </div>
                )}
                {selectedCar.leftView ? (
                  <img
                    src={selectedCar.leftView}
                    alt="Left"
                    className="h-40 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">
                    Left View
                  </div>
                )}
                {selectedCar.rightView ? (
                  <img
                    src={selectedCar.rightView}
                    alt="Right"
                    className="h-40 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">
                    Right View
                  </div>
                )}
                {selectedCar.backView ? (
                  <img
                    src={selectedCar.backView}
                    alt="Back"
                    className="h-40 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">
                    Back View
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Driver Photo with Car
              </h3>
              {selectedCar.driverPhoto ? (
                <img
                  src={selectedCar.driverPhoto}
                  alt="Driver"
                  className="h-48 rounded-lg object-cover w-full"
                />
              ) : (
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-500">
                  Driver Photo with Car
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Search Car Status
              </h3>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={searchCarNumber}
                  onChange={(e) => setSearchCarNumber(e.target.value)}
                  placeholder="Enter Car Number (e.g., DL-01-AB-1234)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={handleSearchCar}
                  className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>

            {/* Cars in Hub Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-xl font-bold text-gray-800">Cars in Hub</h3>
                <button
                  onClick={() => setShowAddCar(true)}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                  Add Car
                </button>
              </div>

              {/* Filter Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-700">Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={filterNumber}
                    onChange={(e) => setFilterNumber(e.target.value)}
                    placeholder="Filter by number plate"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="">All Status</option>
                    <option value="In Hub">In Hub</option>
                    <option value="Handover to Driver">Handover to Driver</option>
                    <option value="Out for Maintenance">
                      Out for Maintenance
                    </option>
                    <option value="Driver operating from Home">
                      Driver operating from Home
                    </option>
                  </select>
                </div>
              </div>

              {/* Cars Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Car Number
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Driver Name
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Work Location
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr
                        key={car.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          {car.number}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              car.status
                            )}`}
                          >
                            {car.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {car.driver}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {car.workLocation}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              setSelectedCar(car);
                              setShowCarDetails(true);
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                          >
                            <Eye size={18} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCars.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No cars found matching your filters
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Car Modal */}
        {showAddCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Add New Car</h3>
                <button
                  onClick={() => setShowAddCar(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* 2 Column Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Number
                    </label>
                    <input
                      type="text"
                      value={newCar.number}
                      onChange={(e) =>
                        setNewCar((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      placeholder="DL-01-AB-1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={newCar.status}
                      onChange={(e) =>
                        setNewCar((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                    >
                      <option value="In Hub">In Hub</option>
                      <option value="Handover to Driver">
                        Handover to Driver
                      </option>
                      <option value="Out for Maintenance">
                        Out for Maintenance
                      </option>
                      <option value="Driver operating from Home">
                        Driver operating from Home
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      value={newCar.driver}
                      onChange={(e) =>
                        setNewCar((prev) => ({
                          ...prev,
                          driver: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Location
                    </label>
                    <select
                      value={newCar.workLocation}
                      onChange={(e) =>
                        setNewCar((prev) => ({
                          ...prev,
                          workLocation: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                    >
                      <option value="Hub">Hub</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>
                </div>

                {/* Column 2 (Photos) */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 mb-2">Car Photos</h4>

                  {[
                    { label: 'Front View', key: 'frontView' },
                    { label: 'Left View', key: 'leftView' },
                    { label: 'Right View', key: 'rightView' },
                    { label: 'Back View', key: 'backView' },
                    {
                      label: 'Driver Photo with Car',
                      key: 'driverPhoto',
                    },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {item.label}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, item.key)}
                        className="w-full text-sm"
                      />
                      {newCar[item.key] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image uploaded
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddCar(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCar}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Add Car
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
