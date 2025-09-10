// import React, { useState, useEffect } from "react";
// import LocationService from "../services/LocationService";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";

// function LocationManagement() {
//   const [Locations, setLocations] = useState([]);
//   const [newLocationName, setNewLocationName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // State để quản lý việc chỉnh sửa
//   const [editingLocationId, setEditingLocationId] = useState(null);
//   const [editingLocationName, setEditingLocationName] = useState("");

//   const fetchLocations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await LocationService.getAllLocations();
//       if (response.errCode === 0) {
//         setLocations(response.data);
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to fetch Locations. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLocation = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await LocationService.createLocation(newLocationName);
//       if (response.errCode === 0) {
//         await fetchLocations();
//         setNewLocationName("");
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to create Location.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteLocation = async (locationId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await LocationService.deleteLocation(locationId);
//       if (response.errCode === 0) {
//         await fetchLocations();
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to delete Location.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm để bắt đầu chỉnh sửa
//   const handleEditClick = (location) => {
//     setEditingLocationId(location.locationId);
//     setEditingLocationName(location.locationName);
//   };

//   // Hàm để lưu thay đổi
//   const handleUpdateLocation = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await LocationService.updateLocation(
//         editingLocationId,
//         editingLocationName
//       );
//       if (response.errCode === 0) {
//         await fetchLocations();
//         setEditingLocationId(null);
//         setEditingLocationName("");
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to update Location.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm để hủy chỉnh sửa
//   const handleCancelEdit = () => {
//     setEditingLocationId(null);
//     setEditingLocationName("");
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   if (loading)
//     return <div className="text-center text-xl my-8">Loading...</div>;
//   if (error)
//     return (
//       <div className="text-center text-xl my-8 text-red-500">
//         Error: {error}
//       </div>
//     );

//   return (
//     <div className="container mx-auto p-8 max-w-4xl bg-white rounded-lg shadow-lg mt-10">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Location Management
//       </h1>
//       <div className="flex space-x-4 mb-8">
//         <input
//           type="text"
//           value={newLocationName}
//           onChange={(e) => setNewLocationName(e.target.value)}
//           placeholder="Enter new Location name"
//           className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleCreateLocation}
//           className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//         >
//           Create Location
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
//               {/* <th className="py-3 px-4 border-b">ID</th> */}
//               <th className="py-3 px-4 border-b">Location Name</th>
//               <th className="py-3 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Locations.map((location) => (
//               <tr
//                 key={location.locationId}
//                 className="hover:bg-gray-50 border-t"
//               >
//                 {/* <td className="py-3 px-4">{location.locationId}</td> */}
//                 <td className="py-3 px-4">
//                   {editingLocationId === location.locationId ? (
//                     <input
//                       type="text"
//                       value={editingLocationName}
//                       onChange={(e) => setEditingLocationName(e.target.value)}
//                       className="p-2 border border-gray-300 rounded-lg w-full"
//                     />
//                   ) : (
//                     location.locationName
//                   )}
//                 </td>
//                 <td className="py-3 px-4 space-x-2">
//                   {editingLocationId === location.locationId ? (
//                     <>
//                       <button
//                         onClick={handleUpdateLocation}
//                         className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="bg-gray-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => handleEditClick(location)}
//                         className="text-blue-500 hover:text-blue-700 transition-colors"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleDeleteLocation(location.locationId)
//                         }
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <FaTrashAlt />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default LocationManagement;
import React, { useState, useEffect } from "react";
import LocationService from "../services/LocationService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

function LocationManagement() {
  const [Locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editingLocationName, setEditingLocationName] = useState("");

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await LocationService.getAllLocations();
      if (response.errCode === 0) {
        setLocations(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch Locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async () => {
    // setLoading(true);
    // setError(null);
    if (!newLocationName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a Location name!",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const response = await LocationService.createLocation(newLocationName);
      if (response.errCode === 0) {
        await fetchLocations();
        setNewLocationName("");
        Swal.fire({
          icon: "success",
          title: "Location Created",
          text: "Location has been created successfully!",
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (err) {
      setError("Failed to create Location.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create Location.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LocationService.deleteLocation(locationId);
      if (response.errCode === 0) {
        await fetchLocations();
        Swal.fire({
          icon: "success",
          title: "Location Deleted",
          text: "Location has been deleted successfully!",
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (err) {
      setError("Failed to delete Location.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete Location.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (location) => {
    setEditingLocationId(location.locationId);
    setEditingLocationName(location.locationName);
  };

  const handleUpdateLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await LocationService.updateLocation(
        editingLocationId,
        editingLocationName
      );
      if (response.errCode === 0) {
        await fetchLocations();
        setEditingLocationId(null);
        setEditingLocationName("");
        Swal.fire({
          icon: "success",
          title: "Location Updated",
          text: "Location has been updated successfully!",
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (err) {
      setError("Failed to update Location.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update Location.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingLocationId(null);
    setEditingLocationName("");
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  if (loading)
    return <div className="text-center text-xl my-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-xl my-8 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Location Management
      </h1>
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          placeholder="Enter new Location name"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateLocation}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Create Location
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-left text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 border-b text-center s">
                Location Name
              </th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Locations.map((location) => (
              <tr
                key={location.locationId}
                className="hover:bg-gray-50 border-t"
              >
                <td className="py-3 px-4 text-center">
                  {editingLocationId === location.locationId ? (
                    <input
                      type="text"
                      value={editingLocationName}
                      onChange={(e) => setEditingLocationName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    location.locationName
                  )}
                </td>
                <td className="py-3 px-4 space-x-2 text-center">
                  {editingLocationId === location.locationId ? (
                    <>
                      <button
                        onClick={handleUpdateLocation}
                        className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(location)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteLocation(location.locationId)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationManagement;
