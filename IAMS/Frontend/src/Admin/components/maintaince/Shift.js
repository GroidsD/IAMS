// import React, { useState, useEffect } from "react";
// import ShiftService from "../services/ShiftService";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import Swal from "sweetalert2";
// function ShiftManagement() {
//   const [Shifts, setShifts] = useState([]);
//   const [newShiftName, setNewShiftName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // State để quản lý việc chỉnh sửa
//   const [editingShiftId, setEditingShiftId] = useState(null);
//   const [editingShiftName, setEditingShiftName] = useState("");

//   const fetchShifts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await ShiftService.getAllShifts();
//       if (response.errCode === 0) {
//         setShifts(response.data);
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to fetch Shifts. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateShift = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await ShiftService.createShift(newShiftName);
//       if (response.errCode === 0) {
//         await fetchShifts();
//         setNewShiftName("");
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to create Shift.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteShift = async (shiftId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await ShiftService.deleteShift(shiftId);
//       if (response.errCode === 0) {
//         await fetchShifts();
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to delete Shift.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm để bắt đầu chỉnh sửa
//   const handleEditClick = (shift) => {
//     setEditingShiftId(shift.shiftId);
//     setEditingShiftName(shift.shiftName);
//   };

//   // Hàm để lưu thay đổi
//   const handleUpdateShift = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await ShiftService.updateShift(
//         editingShiftId,
//         editingShiftName
//       );
//       if (response.errCode === 0) {
//         await fetchShifts();
//         setEditingShiftId(null);
//         setEditingShiftName("");
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError("Failed to update Shift.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm để hủy chỉnh sửa
//   const handleCancelEdit = () => {
//     setEditingShiftId(null);
//     setEditingShiftName("");
//   };

//   useEffect(() => {
//     fetchShifts();
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
//         Shift Management
//       </h1>
//       <div className="flex space-x-4 mb-8">
//         <input
//           type="text"
//           value={newShiftName}
//           onChange={(e) => setNewShiftName(e.target.value)}
//           placeholder="Enter new Shift name"
//           className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleCreateShift}
//           className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//         >
//           Create Shift
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
//               {/* <th className="py-3 px-4 border-b">ID</th> */}
//               <th className="py-3 px-4 border-b">Shift Name</th>
//               <th className="py-3 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Shifts.map((shift) => (
//               <tr key={shift.shiftId} className="hover:bg-gray-50 border-t">
//                 {/* <td className="py-3 px-4">{shift.shiftId}</td> */}
//                 <td className="py-3 px-4">
//                   {editingShiftId === shift.shiftId ? (
//                     <input
//                       type="text"
//                       value={editingShiftName}
//                       onChange={(e) => setEditingShiftName(e.target.value)}
//                       className="p-2 border border-gray-300 rounded-lg w-full"
//                     />
//                   ) : (
//                     shift.shiftName
//                   )}
//                 </td>
//                 <td className="py-3 px-4 space-x-2">
//                   {editingShiftId === shift.shiftId ? (
//                     <>
//                       <button
//                         onClick={handleUpdateShift}
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
//                         onClick={() => handleEditClick(shift)}
//                         className="text-blue-500 hover:text-blue-700 transition-colors"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteShift(shift.shiftId)}
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

// export default ShiftManagement;
import React, { useState, useEffect } from "react";
import ShiftService from "../services/ShiftService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

function ShiftManagement() {
  const [Shifts, setShifts] = useState([]);
  const [newShiftName, setNewShiftName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [editingShiftName, setEditingShiftName] = useState("");

  const fetchShifts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ShiftService.getAllShifts();
      if (response.errCode === 0) {
        setShifts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch Shifts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShift = async () => {
    // setLoading(true);
    // setError(null);
    if (!newShiftName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a Shift name!",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const response = await ShiftService.createShift(newShiftName);
      if (response.errCode === 0) {
        await fetchShifts();
        setNewShiftName("");
        Swal.fire({
          icon: "success",
          title: "Shift Created",
          text: "Shift has been created successfully!",
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
      setError("Failed to create Shift.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create Shift.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ShiftService.deleteShift(shiftId);
      if (response.errCode === 0) {
        await fetchShifts();
        Swal.fire({
          icon: "success",
          title: "Shift Deleted",
          text: "Shift has been deleted successfully!",
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
      setError("Failed to delete Shift.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete Shift.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (shift) => {
    setEditingShiftId(shift.shiftId);
    setEditingShiftName(shift.shiftName);
  };

  const handleUpdateShift = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ShiftService.updateShift(
        editingShiftId,
        editingShiftName
      );
      if (response.errCode === 0) {
        await fetchShifts();
        setEditingShiftId(null);
        setEditingShiftName("");
        Swal.fire({
          icon: "success",
          title: "Shift Updated",
          text: "Shift has been updated successfully!",
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
      setError("Failed to update Shift.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update Shift.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setEditingShiftName("");
  };

  useEffect(() => {
    fetchShifts();
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
        Shift Management
      </h1>
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          value={newShiftName}
          onChange={(e) => setNewShiftName(e.target.value)}
          placeholder="Enter new Shift name"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateShift}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Create Shift
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-sm font-semibold  uppercase tracking-wider">
              <th className="py-3 px-4 border-b left-0">Shift Name</th>
              <th className="py-3 px-4 border-b right-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Shifts.map((shift) => (
              <tr key={shift.shiftId} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-4 text-center">
                  {editingShiftId === shift.shiftId ? (
                    <input
                      type="text"
                      value={editingShiftName}
                      onChange={(e) => setEditingShiftName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    shift.shiftName
                  )}
                </td>
                <td className="py-3 px-4 space-x-2 text-center">
                  {editingShiftId === shift.shiftId ? (
                    <>
                      <button
                        onClick={handleUpdateShift}
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
                        onClick={() => handleEditClick(shift)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteShift(shift.shiftId)}
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

export default ShiftManagement;
