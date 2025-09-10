import React, { useState, useEffect } from "react";
import TypeService from "../services/TypeService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

function TypeManagement() {
  const [Types, setTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState("");

  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TypeService.getAllTypes();
      if (response.errCode === 0) {
        setTypes(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch Types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a Type name!",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await TypeService.createType(newTypeName);
      if (response.errCode === 0) {
        // OPTIMIZATION: Update state directly
        setTypes((prevTypes) => [...prevTypes, response.data]);
        setNewTypeName("");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "New Type created successfully!",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            response.message || "An error occurred while creating the Type.",
        });
      }
    } catch (err) {
      setError("Failed to create Type.");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (typeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TypeService.deleteType(typeId);
      if (response.errCode === 0) {
        // OPTIMIZATION: Update state directly by filtering out the deleted item
        setTypes((prevTypes) =>
          prevTypes.filter((type) => type.typeId !== typeId)
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Type deleted successfully!",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to delete Type.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (type) => {
    setEditingTypeId(type.typeId);
    setEditingTypeName(type.typeName);
  };

  const handleUpdateType = async () => {
    if (!editingTypeName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a Type name!",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await TypeService.updateType(
        editingTypeId,
        editingTypeName
      );
      if (response.errCode === 0) {
        // OPTIMIZATION: Update state directly
        setTypes((prevTypes) =>
          prevTypes.map((type) =>
            type.typeId === editingTypeId
              ? { ...type, typeName: editingTypeName }
              : type
          )
        );
        setEditingTypeId(null);
        setEditingTypeName("");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Type updated successfully!",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update Type.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
  };

  useEffect(() => {
    fetchTypes();
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
        Type Management
      </h1>
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="Enter new Type name"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateType}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Create Type
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-sm font-semibold  uppercase tracking-wider">
              <th className="py-3 px-4 border-b left-0">Type Name</th>
              <th className="py-3 px-4 border-b right-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Types.map((type) => (
              <tr key={type.typeId} className="hover:bg-gray-50 border-t">
                {/* <td className="py-3 px-4">{type.typeId}</td> */}
                <td className="py-3 px-4 text-center   ">
                  {editingTypeId === type.typeId ? (
                    <input
                      type="text"
                      value={editingTypeName}
                      onChange={(e) => setEditingTypeName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    type.typeName
                  )}
                </td>
                <td className="py-3 px-4 space-x-2 align-middle text-center">
                  {editingTypeId === type.typeId ? (
                    <>
                      <button
                        onClick={handleUpdateType}
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
                        onClick={() => handleEditClick(type)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.typeId)}
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

export default TypeManagement;
