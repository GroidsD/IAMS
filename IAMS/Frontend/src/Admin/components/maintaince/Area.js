import React, { useState, useEffect } from "react";
import AreaService from "../services/AreaService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

function AreaManagement() {
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingAreaId, setEditingAreaId] = useState(null);
  const [editingAreaName, setEditingAreaName] = useState("");

  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AreaService.getAllAreas();
      if (response.errCode === 0) {
        setAreas(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch areas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArea = async () => {
    // setLoading(true);
    // setError(null);
    if (!newAreaName.trim()) {
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
      const response = await AreaService.createArea(newAreaName);
      if (response.errCode === 0) {
        await fetchAreas();
        setNewAreaName("");
        Swal.fire({
          icon: "success",
          title: "Area Created",
          text: "Area has been created successfully!",
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
      setError("Failed to create area.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create area.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArea = async (areaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AreaService.deleteArea(areaId);
      if (response.errCode === 0) {
        await fetchAreas();
        Swal.fire({
          icon: "success",
          title: "Area Deleted",
          text: "Area has been deleted successfully!",
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
      setError("Failed to delete area.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete area.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (area) => {
    setEditingAreaId(area.areaId);
    setEditingAreaName(area.areaName);
  };

  const handleUpdateArea = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AreaService.updateArea(
        editingAreaId,
        editingAreaName
      );
      if (response.errCode === 0) {
        await fetchAreas();
        setEditingAreaId(null);
        setEditingAreaName("");
        Swal.fire({
          icon: "success",
          title: "Area Updated",
          text: "Area has been updated successfully!",
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
      setError("Failed to update area.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update area.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAreaId(null);
    setEditingAreaName("");
  };

  useEffect(() => {
    fetchAreas();
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
        Area Management
      </h1>
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          placeholder="Enter new area name"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateArea}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Create Area
        </button>
      </div>

      <div className="overflow-x-auto ">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-left text-sm font-semibolduppercase tracking-wider">
              <th className="py-3 px-4 border-b text-center ">Area Name</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.areaId} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-4 text-center">
                  {editingAreaId === area.areaId ? (
                    <input
                      type="text"
                      value={editingAreaName}
                      onChange={(e) => setEditingAreaName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    area.areaName
                  )}
                </td>
                <td className="py-3 px-4 space-x-2 text-center">
                  {editingAreaId === area.areaId ? (
                    <>
                      <button
                        onClick={handleUpdateArea}
                        className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(area)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.areaId)}
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

export default AreaManagement;
