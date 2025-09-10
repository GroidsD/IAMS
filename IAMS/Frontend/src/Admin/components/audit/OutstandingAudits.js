// import React, { useState, useEffect } from "react";
// import AuditService from "../services/AuditService";
// import RequirementService from "../services/RequirementService";
// import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
// import ReactPaginate from "react-paginate";
// import AuditChecklist from "./AuditCheckList";
// import { useUser } from "../../../User/components/context/UserContext";
// const OutstandingAudits = () => {
//   const [audits, setAudits] = useState([]);
//   const [requirements, setRequirements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [activeAuditId, setActiveAuditId] = useState(null);
//   const { user } = useUser();

//   useEffect(() => {
//     const fetchAudits = async () => {
//       try {
//         setLoading(true);
//         const response = await AuditService.getAuditsByPage(page, limit);
//         if (response && response.errCode === 0 && response.data) {
//           setAudits(response.data);
//           setTotalItems(response.totalItems);
//         } else {
//           setError("Failed to fetch data from the API.");
//         }
//       } catch (err) {
//         setError("Error fetching audits. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAudits();
//   }, [page, limit]);

//   const handleLaunch = async (auditId) => {
//     try {
//       setLoading(true);
//       const res = await RequirementService.launchRequirements(auditId); // gọi API lấy question
//       if (res && res.data) {
//         setRequirements(res.data);
//         setActiveAuditId(auditId); // đánh dấu audit đang active
//       } else {
//         setError("Failed to load requirements.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error loading requirements.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToAudits = () => {
//     setActiveAuditId(null);
//     setRequirements([]);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <div className="text-xl font-semibold text-gray-700 animate-pulse">
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center  text-red-600 font-semibold p-4 bg-red-100 rounded-lg shadow-md">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-2xl rounded-xl p-8 max-w-full mx-auto my-4 overflow-hidden">
//       {!activeAuditId && (
//         <>
//           <h2 className="text-3xl font-extrabold text-center  mb-8 text-gray-800 tracking-wide">
//             Outstanding Audits
//           </h2>
//           <div className="overflow-x-auto rounded-lg shadow-md">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600">
//                 <tr>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Audit Title
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Location
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Area
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Auditee
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Auditors
//                   </th>
//                   <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
//                     Launch Audit
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {audits.length > 0 ? (
//                   audits.map((audit, index) => (
//                     <tr
//                       key={audit.auditId}
//                       className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
//                     >
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium text-gray-900">
//                         {audit.auditTitle}
//                       </td>
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
//                         {audit.auditLocation.locationName}
//                       </td>
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
//                         {audit.auditArea.areaName}
//                       </td>
//                       <td className="px-4 py-3  text-center whitespace-nowrap text-sm text-gray-500">
//                         {audit.auditType.typeName}
//                       </td>
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
//                         {formatDateToDDMMYYYY(audit.dateAudit)}
//                       </td>
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
//                         <div className="font-medium text-gray-900">
//                           {audit.auditee.name}
//                         </div>
//                         <div className="text-xs text-center text-gray-400">
//                           {audit.auditee.email}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
//                         {audit.auditors.map((auditor, idx) => (
//                           <div key={idx} className="mb-1 last:mb-0">
//                             <div className="font-medium text-gray-900">
//                               {auditor.name}
//                             </div>
//                             <div className="text-xs text-gray-400">
//                               {auditor.email}
//                             </div>
//                           </div>
//                         ))}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-center  text-sm font-medium">
//                         <button
//                           onClick={() => handleLaunch(audit.auditId)}
//                           className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//                         >
//                           Launch
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="8"
//                       className="px-4 py-3 whitespace-nowrap text-sm text-center  text-gray-500"
//                     >
//                       No outstanding audits found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <ReactPaginate
//               previousLabel={"Prev"}
//               nextLabel={"Next"}
//               breakLabel={"..."}
//               pageCount={Math.ceil(totalItems / limit)}
//               marginPagesDisplayed={2}
//               pageRangeDisplayed={3}
//               onPageChange={(data) => setPage(data.selected + 1)}
//               containerClassName={"flex justify-center mt-6 space-x-2"}
//               pageClassName={
//                 "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//               }
//               activeClassName={"bg-blue-600 text-white border-blue-600"}
//               previousClassName={
//                 "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//               }
//               nextClassName={
//                 "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//               }
//               breakClassName={"px-3 py-1"}
//             />
//           </div>
//         </>
//       )}
//       {activeAuditId && (
//         <AuditChecklist
//           requirements={requirements}
//           setRequirements={setRequirements}
//           handleBackToAudits={handleBackToAudits}
//           userRole={user.role}
//         />
//       )}
//     </div>
//   );
// };

// export default OutstandingAudits;
import React, { useState, useEffect } from "react";
import AuditService from "../services/AuditService";
import RequirementService from "../services/RequirementService";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import ReactPaginate from "react-paginate";
import AuditChecklist from "./AuditCheckList";
import { useUser } from "../../../User/components/context/UserContext";

const OutstandingAudits = () => {
  const [audits, setAudits] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAuditId, setActiveAuditId] = useState(null);
  const { user } = useUser();

  // Thêm state cho phân trang
  const [pageNumber, setPageNumber] = useState(0);
  const auditsPerPage = 10;

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        const response = await AuditService.getAllAudits();
        if (response && response.errCode === 0 && response.data) {
          setAudits(response.data);
        } else {
          setError("Failed to fetch data from the API.");
        }
      } catch (err) {
        setError("Error fetching audits. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const handleLaunch = async (auditId) => {
    try {
      setLoading(true);
      const res = await RequirementService.launchRequirements(auditId);
      if (res && res.data) {
        setRequirements(res.data);
        setActiveAuditId(auditId);
      } else {
        setError("Failed to load requirements.");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading requirements.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAudits = () => {
    setActiveAuditId(null);
    setRequirements([]);
  };

  // Logic phân trang phía client
  const pagesVisited = pageNumber * auditsPerPage;
  const displayAudits = audits.slice(
    pagesVisited,
    pagesVisited + auditsPerPage
  );
  const pageCount = Math.ceil(audits.length / auditsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center  text-red-600 font-semibold p-4 bg-red-100 rounded-lg shadow-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-full mx-auto my-4 overflow-hidden">
      {!activeAuditId && (
        <>
          <h2 className="text-3xl font-extrabold text-center  mb-8 text-gray-800 tracking-wide">
            Outstanding Audits
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Audit Title
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Auditee
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Auditors
                  </th>
                  <th className="px-4 py-3 text-center  text-xs font-bold text-white uppercase tracking-wider">
                    Launch Audit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayAudits.length > 0 ? (
                  displayAudits.map((audit, index) => (
                    <tr
                      key={audit.auditId}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                        {audit.auditTitle}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditLocation.locationName}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditArea.areaName}
                      </td>
                      <td className="px-4 py-3  text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditType.typeName}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {formatDateToDDMMYYYY(audit.dateAudit)}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium text-gray-900">
                          {audit.auditee.name}
                        </div>
                        <div className="text-xs text-center text-gray-400">
                          {audit.auditee.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">
                        {audit.auditors.map((auditor, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            <div className="font-medium text-gray-900">
                              {auditor.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {auditor.email}
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center  text-sm font-medium">
                        <button
                          onClick={() => handleLaunch(audit.auditId)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                          Launch
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-3 whitespace-nowrap text-sm text-center  text-gray-500"
                    >
                      No outstanding audits found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {audits.length > auditsPerPage && (
              <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"flex justify-center mt-6 space-x-2"}
                pageClassName={
                  "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                }
                activeClassName={"bg-blue-600 text-white border-blue-600"}
                previousClassName={
                  "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                }
                nextClassName={
                  "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                }
                breakClassName={"px-3 py-1"}
              />
            )}
          </div>
        </>
      )}
      {activeAuditId && (
        <AuditChecklist
          requirements={requirements}
          setRequirements={setRequirements}
          handleBackToAudits={handleBackToAudits}
          userRole={user.role}
        />
      )}
    </div>
  );
};

export default OutstandingAudits;
