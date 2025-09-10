import Area from "../maintaince/Area";
import Location from "../maintaince/Location";
import Type from "../maintaince/Type";
import Shift from "../maintaince/Shift";
import CheckList from "../maintaince/CheckList";
const ManagmentMaintenance = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Area":
        return <Area />;
      case "Location":
        return <Location />;
      case "Type":
        return <Type />;
      case "Shift":
        return <Shift />;
      case "CheckList":
        return <CheckList />;
      default:
        return <Area />;
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-2xl rounded-xl p-1 transition-all duration-300">
      {renderContent()}
    </div>
  );
};
export default ManagmentMaintenance;
