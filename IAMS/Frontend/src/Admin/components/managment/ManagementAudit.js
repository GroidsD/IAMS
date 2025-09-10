// src/Admin/components/managment/ManagementAudit.js
import AddAudit from "../audit/AddAudit";
import OutstandingAudits from "../audit/OutstandingAudits";
import AuditReport from "../audit/AuditReport";
const ManagementAudit = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "AddAudit":
        return <AddAudit />;
      case "OutstandingAudits":
        return <OutstandingAudits />;
      case "AuditReport":
        return <AuditReport />;
      default:
        return <OutstandingAudits />;
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-2xl rounded-xl p-1 transition-all duration-300">
      {renderContent()}
    </div>
  );
};

export default ManagementAudit;
