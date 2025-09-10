// import React, { useEffect, useState } from "react";
// import AuditService from "../services/AuditService";
// import AuditReportDetail from "./AuditReportDetail";
// import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
// import ReactPaginate from "react-paginate";

// const AuditReport = () => {
//   const [audits, setAudits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAuditId, setSelectedAuditId] = useState(null);

//   // Thêm state cho phân trang
//   const [pageNumber, setPageNumber] = useState(0);
//   const auditsPerPage = 10;

//   const getComplianceCounts = (requirements) => {
//     if (!requirements) return { noCount: 0, naCount: 0 };
//     const noCount = requirements.filter(
//       (req) => req.compliancy === "NO"
//     ).length;
//     const naCount = requirements.filter(
//       (req) => req.compliancy === "Not Applicable"
//     ).length;
//     return { noCount, naCount };
//   };

//   useEffect(() => {
//     const fetchAudits = async () => {
//       try {
//         const data = await AuditService.getAllAudits();
//         setAudits(data.data);
//       } catch (err) {
//         setError("Can't get report data of audit.");
//         console.error("Failed to fetch audits:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAudits();
//   }, []);

//   const handleBack = () => {
//     setSelectedAuditId(null);
//   };

//   // Tính toán dữ liệu hiển thị trên trang hiện tại
//   const pagesVisited = pageNumber * auditsPerPage;
//   const displayAudits = audits.slice(
//     pagesVisited,
//     pagesVisited + auditsPerPage
//   );

//   // Tính tổng số trang
//   const pageCount = Math.ceil(audits.length / auditsPerPage);

//   // Xử lý khi chuyển trang
//   const handlePageChange = ({ selected }) => {
//     setPageNumber(selected);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//         <div className="text-center">
//           <svg
//             className="animate-spin h-10 w-10 text-white mx-auto mb-4"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             ></path>
//           </svg>
//           <p>Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (selectedAuditId) {
//     return <AuditReportDetail auditId={selectedAuditId} onBack={handleBack} />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
//       <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
//         Audit Report
//       </h1>
//       <div className="overflow-x-auto rounded-lg shadow-lg">
//         <table className="min-w-full text-sm text-left text-white">
//           <thead className="text-xs uppercase bg-blue-600 text-white">
//             <tr>
//               <th scope="col" className="px-6 py-3">
//                 Audit Title
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Audit Type
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Audit Location
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Audit Date
//               </th>
//               <th scope="col" className="px-6 py-3 text-center">
//                 Compliancy (NO | N/A)
//               </th>
//               <th scope="col" className="px-6 py-3 text-right">
//                 Detailed Report
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayAudits.length > 0 ? (
//               displayAudits.map((audit) => {
//                 const { noCount, naCount } = getComplianceCounts(
//                   audit.requirements
//                 );

//                 return (
//                   <tr
//                     key={audit.auditId}
//                     className="border-b bg-white border-gray-200 hover:bg-gray-200 transition-colors duration-200"
//                   >
//                     <td className="px-6 py-4 font-medium text-black">
//                       {audit.auditTitle || "N/A"}
//                     </td>
//                     <td className="px-6 py-4  text-gray-500">
//                       {audit.auditType?.typeName || "N/A"}
//                     </td>
//                     <td className="px-6 py-4  text-gray-500">
//                       {audit.auditLocation?.locationName || "N/A"}
//                     </td>
//                     <td className="px-6 py-4  text-gray-500">
//                       {formatDateToDDMMYYYY(audit.dateAudit) || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
//                         {noCount} NO
//                       </span>
//                       <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                         {naCount} N/A
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-colors duration-200"
//                         onClick={() => setSelectedAuditId(audit.auditId)}
//                       >
//                         Detailed
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                   Không tìm thấy bản ghi audit nào.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {audits.length > auditsPerPage && (
//         <div className="flex justify-center mt-8">
//           <ReactPaginate
//             previousLabel={"Prev"}
//             nextLabel={"Next"}
//             pageCount={pageCount}
//             onPageChange={handlePageChange}
//             containerClassName={"flex justify-center mt-6 space-x-2"}
//             pageClassName={
//               "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//             }
//             activeClassName={"bg-blue-600 text-white border-blue-600"}
//             previousClassName={
//               "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//             }
//             nextClassName={
//               "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
//             }
//             breakClassName={"px-3 py-1"}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuditReport;
import React, { useEffect, useState } from "react";
import AuditService from "../services/AuditService";
import AuditReportDetail from "./AuditReportDetail";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import ReactPaginate from "react-paginate";

const AuditReport = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuditId, setSelectedAuditId] = useState(null);

  // Thêm state cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const auditsPerPage = 10;

  const getComplianceCounts = (requirements) => {
    if (!requirements) return { noCount: 0, naCount: 0 };
    const noCount = requirements.filter(
      (req) => req.compliancy === "NO"
    ).length;
    const naCount = requirements.filter(
      (req) => req.compliancy === "Not Applicable"
    ).length;
    return { noCount, naCount };
  };

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const data = await AuditService.getAllAudits();
        setAudits(data.data);
      } catch (err) {
        setError("Can't get report data of audit.");
        console.error("Failed to fetch audits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const handleBack = () => {
    setSelectedAuditId(null);
  };

  // Lọc dữ liệu dựa trên searchTerm
  const filteredAudits = audits.filter(
    (audit) =>
      audit.auditTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (audit.auditType?.typeName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (audit.auditLocation?.locationName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const pagesVisited = pageNumber * auditsPerPage;
  const displayAudits = filteredAudits.slice(
    pagesVisited,
    pagesVisited + auditsPerPage
  );

  // Tính tổng số trang
  const pageCount = Math.ceil(filteredAudits.length / auditsPerPage);

  // Xử lý khi chuyển trang
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-white mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (selectedAuditId) {
    return <AuditReportDetail auditId={selectedAuditId} onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
        Audit Report
      </h1>

      {/* Ô tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Audit Title, Type, or Location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPageNumber(0); // Reset trang về 0 khi tìm kiếm
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="text-xs uppercase bg-blue-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Audit Title
              </th>
              <th scope="col" className="px-6 py-3">
                Audit Type
              </th>
              <th scope="col" className="px-6 py-3">
                Audit Location
              </th>
              <th scope="col" className="px-6 py-3">
                Audit Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Compliancy (NO | N/A)
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Detailed Report
              </th>
            </tr>
          </thead>
          <tbody>
            {displayAudits.length > 0 ? (
              displayAudits.map((audit) => {
                const { noCount, naCount } = getComplianceCounts(
                  audit.requirements
                );

                return (
                  <tr
                    key={audit.auditId}
                    className="border-b bg-white border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-black">
                      {audit.auditTitle || "N/A"}
                    </td>
                    <td className="px-6 py-4  text-gray-500">
                      {audit.auditType?.typeName || "N/A"}
                    </td>
                    <td className="px-6 py-4  text-gray-500">
                      {audit.auditLocation?.locationName || "N/A"}
                    </td>
                    <td className="px-6 py-4  text-gray-500">
                      {formatDateToDDMMYYYY(audit.dateAudit) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                        {noCount} NO
                      </span>
                      <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {naCount} N/A
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-colors duration-200"
                        onClick={() => setSelectedAuditId(audit.auditId)}
                      >
                        Detailed
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy bản ghi audit nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredAudits.length > auditsPerPage && (
        <div className="flex justify-center mt-8">
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
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
        </div>
      )}
    </div>
  );
};

export default AuditReport;
