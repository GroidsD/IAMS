import React, { useState, useEffect } from "react";
import AuditService from "../../../Admin/components/services/AuditService";
import UserService from "../../../Admin/components/services/UserService";
import LocationService from "../../../Admin/components/services/LocationService";
import AreaService from "../../../Admin/components/services/AreaService";
import TypeService from "../../../Admin/components/services/TypeService";
import ShiftService from "../../../Admin/components/services/ShiftService";
import CheckListService from "../../../Admin/components/services/CheckListService";
import Swal from "sweetalert2";
import Select from "react-select";

const AddAudit = () => {
  const [formData, setFormData] = useState({
    locationId: "",
    auditTitle: "",
    areaId: "",
    typeId: "",
    shiftId: "",
    dateAudit: "",
    auditeeId: "",
    auditorIds: [],
    checkListId: "",
  });

  const [locations, setLocations] = useState([]);
  const [auditees, setAuditees] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [allChecklists, setAllChecklists] = useState([]);
  const [filteredChecklists, setFilteredChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { locationId, areaId, typeId } = formData;
  const [minDay, setMinDay] = useState("");
  // useEffect để lấy tất cả dữ liệu từ API

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          locationRes,
          areaRes,
          typeRes,
          shiftRes,
          auditeeRes,
          auditorRes,
          checklistRes,
        ] = await Promise.all([
          LocationService.getAllLocations(),
          AreaService.getAllAreas(),
          TypeService.getAllTypes(),
          ShiftService.getAllShifts(),
          UserService.getUsersByRole("auditee"),
          UserService.getUsersByRole("auditor"),
          CheckListService.getAllCheckLists(),
        ]);

        setLocations(locationRes?.data?.data || locationRes.data || []);
        setAreas(areaRes?.data?.data || areaRes.data || []);
        setTypes(typeRes?.data?.data || typeRes.data || []);
        setShifts(shiftRes?.data?.data || shiftRes.data || []);
        setAuditees(auditeeRes?.data?.users || auditeeRes?.users || []);
        setAuditors(auditorRes?.data?.users || auditorRes?.users || []);
        setAllChecklists(checklistRes?.data?.data || checklistRes.data || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    const formattedDate = today.toISOString().split("T")[0];
    setMinDay(formattedDate);
  }, []);
  // Lọc checklist khi location/area/type thay đổi
  useEffect(() => {
    if (locationId && areaId && typeId) {
      const filtered = allChecklists.filter(
        (checklist) =>
          checklist.locationId === Number(locationId) &&
          checklist.areaId === Number(areaId) &&
          checklist.typeId === Number(typeId)
      );
      setFilteredChecklists(filtered);
    } else {
      setFilteredChecklists([]);
    }
  }, [locationId, areaId, typeId, allChecklists]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleAuditorChange = (e) => {
  //   const selectedOptions = Array.from(e.target.selectedOptions);
  //   const selectedAuditorIds = selectedOptions.map((option) => option.value);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     auditorIds: selectedAuditorIds,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuditService.createNewAudit(formData);
      // console.log("Audit created successfully:", response.data);

      Swal.fire({
        icon: "success",
        title: "Audit Created Successfully!",
        text: "The audit information has been saved.",
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset formData về giá trị ban đầu sau khi submit thành công
      setFormData({
        locationId: "",
        auditTitle: "",
        areaId: "",
        typeId: "",
        shiftId: "",
        dateAudit: "",
        auditeeId: "",
        auditorIds: [],
        checkListId: "",
      });
    } catch (err) {
      console.error("Failed to create audit:", err);

      Swal.fire({
        icon: "error",
        title: "An Error Occurred!",
        text: "Please try again.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const auditeeOptions = auditees.map((auditee) => ({
    value: auditee.userId,
    label: auditee.email,
  }));
  const auditorOptions = auditors.map((auditor) => ({
    value: auditor.userId,
    label: auditor.email,
  }));

  if (loading) {
    return (
      <div className="text-center mt-8 text-xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-8 text-red-500 font-semibold">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-5 p-8 bg-white rounded-xl shadow-2xl border border-gray-300">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
        Add New Audit
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label
              htmlFor="auditTitle"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Audit Title:
            </label>
            <input
              type="text"
              id="auditTitle"
              name="auditTitle"
              placeholder="Enter Audit Title"
              value={formData.auditTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          {/* Location Dropdown */}
          <div>
            <label
              htmlFor="locationId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Location:
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Choose location</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.locationName}
                </option>
              ))}
            </select>
          </div>
          {/* Area Dropdown */}
          <div>
            <label
              htmlFor="areaId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Area:
            </label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Choose area</option>
              {areas.map((area) => (
                <option key={area.areaId} value={area.areaId}>
                  {area.areaName}
                </option>
              ))}
            </select>
          </div>
          {/* Type Dropdown */}
          <div>
            <label
              htmlFor="typeId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Type:
            </label>
            <select
              id="typeId"
              name="typeId"
              value={formData.typeId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Choose type</option>
              {types.map((type) => (
                <option key={type.typeId} value={type.typeId}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>
          {/* Shift Dropdown */}
          <div>
            <label
              htmlFor="shiftId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Shift:
            </label>
            <select
              id="shiftId"
              name="shiftId"
              value={formData.shiftId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Choose shift</option>
              {shifts.map((shift) => (
                <option key={shift.shiftId} value={shift.shiftId}>
                  {shift.shiftName}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div>
            <label
              htmlFor="dateAudit"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Date:
            </label>
            <input
              type="date"
              id="dateAudit"
              name="dateAudit"
              value={formData.dateAudit}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              min={minDay}
            />
          </div>
          {/* Auditee Dropdown */}
          <div>
            <label
              htmlFor="auditeeId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Auditee:
            </label>

            <Select
              isMulti
              name="auditeeId"
              options={auditeeOptions}
              value={auditeeOptions.filter((opt) =>
                formData.auditeeId.includes(String(opt.value))
              )}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  auditeeId: selected
                    ? selected.map((s) => String(s.value))
                    : [],
                }));
              }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          {/* Auditor Multi-select */}
          <div>
            <label
              htmlFor="auditorIds"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Auditor:
            </label>
            <Select
              isMulti
              name="auditorIds"
              options={auditorOptions}
              value={auditorOptions.filter((opt) =>
                formData.auditorIds.includes(String(opt.value))
              )}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  auditorIds: selected
                    ? selected.map((s) => String(s.value))
                    : [],
                }));
              }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>
        {/* Checklist Dropdown (full width) */}
        <div className="mt-6">
          <label
            htmlFor="checkListId"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Checklist:
          </label>
          {/* Hiển thị dropdown checklist đã được lọc */}
          <select
            id="checkListId"
            name="checkListId"
            value={formData.checkListId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
            disabled={filteredChecklists.length === 0}
          >
            <option value="">
              {filteredChecklists.length > 0
                ? "Choose checklist"
                : "No matching checklist"}
            </option>
            {filteredChecklists.map((checklist) => (
              <option key={checklist.checkListId} value={checklist.checkListId}>
                {checklist.checkListTitle}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-8 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add Audit
        </button>
      </form>
    </div>
  );
};

export default AddAudit;
