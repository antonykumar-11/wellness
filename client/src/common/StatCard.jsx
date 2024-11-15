import { motion } from "framer-motion";
import useTheme from "../context/Theme"; // Import the ThemeContext

const StaffStatCard = ({ name, icon: Icon, value, color, onClick }) => {
  const { themeMode } = useTheme(); // Get the current theme mode
  console.log("Current theme mode:", themeMode);

  return (
    <motion.div
      className={` 
                  ${
                    themeMode === "dark"
                      ? "bg-gray-700 border-gray-600 text-white shadow-md"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white bg-opacity-50"
                  } 
                  rounded-xl border cursor-pointer overflow-hidden shadow-lg transition-all duration-300 transform`}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StaffStatCard;
