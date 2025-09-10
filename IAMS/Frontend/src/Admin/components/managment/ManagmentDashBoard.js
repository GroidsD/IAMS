// import React, { useEffect, useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// // import axios from "axios";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// // import { useQuery } from "@tanstack/react-query";
// import api from "../../../API/axios";
// ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// const ManagmentDashBoard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchStats = async () => {
//     try {
//       const res = await api.get("/api/equipment-status-distribution");
//       setStats(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch dashboard stats", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (!stats)
//     return <div className="text-center text-red-600">Error loading data</div>;

//   const { totalEquipments, calibrationStats, rejectionStats } = stats;

//   const calData = {
//     labels: ["Pending Approval", "Calibration Due", "Need Calibration"],
//     datasets: [
//       {
//         data: [
//           calibrationStats.pendingApproval,
//           calibrationStats.calDue,
//           calibrationStats.needCalibration,
//         ],
//         backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
//         borderColor: "#fff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   const rejectData = {
//     labels: ["Rejected", "Calibrated"],
//     datasets: [
//       {
//         data: [rejectionStats.reject, rejectionStats.calibrated],
//         backgroundColor: ["#FF6384", "#36A2EB"],
//         borderColor: "#fff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   const doughnutOptions = {
//     plugins: {
//       datalabels: {
//         display: true,
//         color: "#fff",
//         font: {
//           weight: "bold",
//         },
//         formatter: (value, context) => {
//           const total = context.chart.data.datasets[0].data.reduce(
//             (a, b) => a + b,
//             0
//           );
//           const percentage = ((value / total) * 100).toFixed(1);
//           return `${percentage}%`;
//         },
//       },
//       legend: {
//         position: "bottom",
//         labels: {
//           color: "#333",
//           font: {
//             size: 12,
//           },
//         },
//       },
//     },
//     maintainAspectRatio: false,
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="p-6 bg-white rounded-2xl shadow-xl max-w-7xl mx-auto my-8">
//         <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
//           Management Dashboard
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
//             <div className="text-5xl font-extrabold text-blue-700">
//               {totalEquipments}
//             </div>
//             <div className="uppercase text-sm font-semibold text-blue-800 mt-2 tracking-wide">
//               Total Equipments
//             </div>
//           </div>
//           <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
//             <div className="text-5xl font-extrabold text-yellow-600">
//               {calibrationStats.calDue}
//             </div>
//             <div className="uppercase text-sm font-semibold text-yellow-800 mt-2 tracking-wide">
//               Calibration Due
//             </div>
//           </div>
//           <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
//             <div className="text-5xl font-extrabold text-purple-700">
//               {calibrationStats.pendingApproval}
//             </div>
//             <div className="uppercase text-sm font-semibold text-purple-800 mt-2 tracking-wide">
//               Pending Approval
//             </div>
//           </div>
//           <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
//             <div className="text-5xl font-extrabold text-red-600">
//               {rejectionStats.reject}
//             </div>
//             <div className="uppercase text-sm font-semibold text-red-800 mt-2 tracking-wide">
//               Rejected
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//           <div className="bg-white shadow-xl rounded-xl p-6 relative h-96 flex flex-col justify-between">
//             <h4 className="text-center font-bold mb-4 text-xl uppercase text-gray-800">
//               Total Equipment CAL
//             </h4>
//             <div className="flex-grow flex items-center justify-center">
//               <Doughnut
//                 data={calData}
//                 options={doughnutOptions}
//                 canvasprops={{
//                   "aria-label":
//                     "Doughnut chart showing equipment calibration status",
//                   role: "img",
//                 }}
//               />
//             </div>

//             <div className="flex justify-around items-center text-sm mt-6 flex-wrap">
//               <div className="flex items-center mx-2 my-1">
//                 <span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
//                 <span className="font-medium text-gray-700">
//                   Pending Approval:
//                 </span>
//                 <span className="font-bold text-indigo-600 ml-1">
//                   {calibrationStats.pendingApproval}
//                 </span>
//               </div>
//               <div className="flex items-center mx-2 my-1">
//                 <span className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></span>
//                 <span className="font-medium text-gray-700">
//                   Calibration Due:
//                 </span>
//                 <span className="font-bold text-yellow-600 ml-1">
//                   {calibrationStats.calDue}
//                 </span>
//               </div>
//               <div className="flex items-center mx-2 my-1">
//                 <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
//                 <span className="font-medium text-gray-700">
//                   Need Calibration:
//                 </span>
//                 <span className="font-bold text-red-600 ml-1">
//                   {calibrationStats.needCalibration}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white shadow-xl rounded-xl p-6 relative h-96 flex flex-col justify-between">
//             <h4 className="text-center font-bold mb-4 text-xl uppercase text-gray-800">
//               Total Equipment REJECT & CALIBRATED
//             </h4>
//             <div className="flex-grow flex items-center justify-center">
//               <Doughnut
//                 data={rejectData}
//                 options={doughnutOptions}
//                 canvasprops={{
//                   "aria-label":
//                     "Doughnut chart showing rejected and calibrated equipment",
//                   role: "img",
//                 }}
//               />
//             </div>
//             <div className="flex justify-around items-center text-sm mt-6 flex-wrap">
//               <div className="flex items-center mx-2 my-1">
//                 <span className="w-3 h-3 rounded-full bg-rose-600 mr-2"></span>
//                 <span className="font-medium text-gray-700">Rejected:</span>
//                 <span className="font-bold text-rose-600 ml-1">
//                   {rejectionStats.reject}
//                 </span>
//               </div>
//               <div className="flex items-center mx-2 my-1">
//                 <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
//                 <span className="font-medium text-gray-700">Calibrated:</span>
//                 <span className="font-bold text-green-600 ml-1">
//                   {rejectionStats.calibrated}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagmentDashBoard;
