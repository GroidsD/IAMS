import React, { useState, useEffect } from "react";
import CheckListService from "../services/CheckListService";
import LocationService from "../services/LocationService";
import AreaService from "../services/AreaService";
import TypeService from "../services/TypeService";
import {
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaFileExcel,
} from "react-icons/fa";

const CheckListManagement = () => {
  const [checklists, setChecklists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newLocationId, setNewLocationId] = useState("");
  const [newAreaId, setNewAreaId] = useState("");
  const [newTypeId, setNewTypeId] = useState("");
  const [newChecklistFile, setNewChecklistFile] = useState(null);

  const [existingChecklistFile, setExistingChecklistFile] = useState(null);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState("");
  const [editingAreaId, setEditingAreaId] = useState("");
  const [editingTypeId, setEditingTypeId] = useState("");
  const [editingChecklistFile, setEditingChecklistFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        checklistsResponse,
        locationsResponse,
        areasResponse,
        typesResponse,
      ] = await Promise.all([
        CheckListService.getAllCheckLists(),
        LocationService.getAllLocations(),
        AreaService.getAllAreas(),
        TypeService.getAllTypes(),
      ]);

      if (checklistsResponse.errCode === 0) {
        setChecklists(checklistsResponse.data);
      } else {
        setError(checklistsResponse.message);
      }

      if (locationsResponse.errCode === 0) {
        setLocations(locationsResponse.data);
      }
      if (areasResponse.errCode === 0) {
        setAreas(areasResponse.data);
      }
      if (typesResponse.errCode === 0) {
        setTypes(typesResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateChecklist = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!newLocationId || !newAreaId || !newTypeId || !newChecklistFile) {
        setError("Please fill in all information.");
        return;
      }

      const formData = new FormData();
      formData.append("locationId", newLocationId);
      formData.append("areaId", newAreaId);
      formData.append("typeId", newTypeId);
      formData.append("checkListFile", newChecklistFile);

      const response = await CheckListService.createCheckList(formData);
      if (response.errCode === 0) {
        await fetchData();
        setNewLocationId("");
        setNewAreaId("");
        setNewTypeId("");
        setNewChecklistFile(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to create Checklist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChecklist = async (checkListId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CheckListService.deleteCheckList(checkListId);
      if (response.errCode === 0) {
        await fetchData();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to delete Checklist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (checklist) => {
    setEditingChecklistId(checklist.checkListId);
    setEditingLocationId(checklist.locationId);
    setEditingAreaId(checklist.areaId);
    setEditingTypeId(checklist.typeId);
    setEditingChecklistFile(null);
    setExistingChecklistFile(checklist.checkListFile);
  };

  const handleUpdateChecklist = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("checkListId", editingChecklistId);
      formData.append("locationId", editingLocationId);
      formData.append("areaId", editingAreaId);
      formData.append("typeId", editingTypeId);

      if (editingChecklistFile) {
        formData.append("checkListFile", editingChecklistFile);
      } else if (existingChecklistFile === null) {
        formData.append("deleteOldFile", "true");
      }

      const response = await CheckListService.updateCheckList(formData);
      if (response.errCode === 0) {
        setEditingChecklistId(null);
        setEditingLocationId("");
        setEditingAreaId("");
        setEditingTypeId("");
        setEditingChecklistFile(null);
        setExistingChecklistFile(null);
        await fetchData();
      } else {
        setError(response.message || "Failed to update Checklist.");
      }
    } catch (err) {
      setError("Failed to update Checklist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingChecklistId(null);
    setEditingLocationId("");
    setEditingAreaId("");
    setEditingTypeId("");
    setEditingChecklistFile(null);
    setExistingChecklistFile(null);
  };

  if (loading)
    return <div className="text-center text-xl my-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-xl my-8 text-red-500">Lỗi: {error}</div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl bg-white rounded-xl shadow-2xl mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Management Checklist
      </h1>
      <div className="overflow-x-auto rounded-xl shadow-md mb-5">
        <table className="min-w-full bg-white border border-gray-300 rounded-xl divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Title
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Location
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Area
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Type
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                File
              </th>
              <th className="py-4 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {checklists.map((checklist, index) => (
              <tr
                key={checklist.checkListId}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition duration-150`}
              >
                <td className="py-4 px-6">
                  {editingChecklistId === checklist.checkListId ? (
                    <span className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100 flex-grow truncate">
                      {/* Sửa lại ở đây, thêm flex-grow và truncate */}
                      {checklist.checkListTitle}
                    </span>
                  ) : (
                    checklist.checkListTitle
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingChecklistId === checklist.checkListId ? (
                    <select
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editingLocationId}
                      onChange={(e) => setEditingLocationId(e.target.value)}
                    >
                      {locations.map((loc) => (
                        <option key={loc.locationId} value={loc.locationId}>
                          {loc.locationName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    locations.find((l) => l.locationId === checklist.locationId)
                      ?.locationName || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingChecklistId === checklist.checkListId ? (
                    <select
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editingAreaId}
                      onChange={(e) => setEditingAreaId(e.target.value)}
                    >
                      {areas.map((area) => (
                        <option key={area.areaId} value={area.areaId}>
                          {area.areaName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    areas.find((a) => a.areaId === checklist.areaId)
                      ?.areaName || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingChecklistId === checklist.checkListId ? (
                    <select
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editingTypeId}
                      onChange={(e) => setEditingTypeId(e.target.value)}
                    >
                      {types.map((type) => (
                        <option key={type.typeId} value={type.typeId}>
                          {type.typeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    types.find((t) => t.typeId === checklist.typeId)
                      ?.typeName || "N/A"
                  )}
                </td>

                <td className="py-4 px-6">
                  {editingChecklistId === checklist.checkListId ? (
                    // --- EDIT MODE
                    <div>
                      {existingChecklistFile && !editingChecklistFile ? (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center flex-grow truncate">
                            <FaFileExcel className="mr-2 text-green-600 flex-shrink-0" />
                            <a
                              href={`${process.env.REACT_APP_API_URL}/uploadsExcel/${existingChecklistFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition duration-300 truncate"
                            >
                              {existingChecklistFile}
                            </a>
                          </div>
                          <button
                            onClick={() => setExistingChecklistFile(null)}
                            className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                            title="Clear current file"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-gray-700 text-sm mb-1">
                            {existingChecklistFile
                              ? "Replace File:"
                              : "Upload File:"}
                          </label>
                          <input
                            type="file"
                            onChange={(e) =>
                              setEditingChecklistFile(e.target.files[0])
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      )}
                    </div>
                  ) : // --- VIEW MODE
                  checklist.checkListFile ? (
                    <a
                      href={`${process.env.REACT_APP_API_URL}/uploadsExcel/${checklist.checkListFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      <FaFileExcel className="mr-2 text-green-600" />
                      {checklist.checkListFile}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-4 px-6 space-x-3 text-center">
                  {editingChecklistId === checklist.checkListId ? (
                    <>
                      <button
                        onClick={handleUpdateChecklist}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-gray-800 transition-colors"
                      >
                        <FaTimes size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(checklist)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteChecklist(checklist.checkListId)
                        }
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8 p-6 border border-gray-300 rounded-xl shadow-md bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Locations:
            </label>
            <select
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newLocationId}
              onChange={(e) => setNewLocationId(e.target.value)}
            >
              <option value="">Select Locations</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.locationName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Area:
            </label>
            <select
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newAreaId}
              onChange={(e) => setNewAreaId(e.target.value)}
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area.areaId} value={area.areaId}>
                  {area.areaName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Type:
            </label>
            <select
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTypeId}
              onChange={(e) => setNewTypeId(e.target.value)}
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.typeId} value={type.typeId}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload File Excel:
            </label>
            <input
              id="newChecklistFileInput"
              type="file"
              onChange={(e) => setNewChecklistFile(e.target.files[0])}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
        <button
          onClick={handleCreateChecklist}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Checklist
        </button>
      </div>
    </div>
  );
};

export default CheckListManagement;
