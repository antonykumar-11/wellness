// import { useState, useEffect, useMemo } from "react";
// import {
//   useGetAttendancesQuery,
//   useCreateAttendanceMutation,
//   useDeleteAttendanceMutation,
// } from "../store/api/AttendenceApi";
// import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

// const AttendanceList = () => {
//   const {
//     data: allEntities,
//     refetch: refetchEntities,
//     isLoading: isEntitiesLoading,
//     error: entitiesError,
//   } = useGetAllEmployeesQuery();

//   const {
//     data: attendances,
//     refetch: refetchAttendances,
//     isLoading: isAttendancesLoading,
//     error: attendancesError,
//   } = useGetAttendancesQuery();

//   const [createAttendance] = useCreateAttendanceMutation();
//   const [deleteAttendance] = useDeleteAttendanceMutation();

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const startOfSelectedMonth = useMemo(
//     () => startOfMonth(new Date(selectedYear, selectedMonth)),
//     [selectedYear, selectedMonth]
//   );

//   const endOfSelectedMonth = useMemo(
//     () => endOfMonth(new Date(selectedYear, selectedMonth)),
//     [selectedYear, selectedMonth]
//   );

//   const selectedMonthYear = useMemo(
//     () => `${selectedMonth + 1}/${selectedYear}`,
//     [selectedMonth, selectedYear]
//   );

//   const [selectedDays, setSelectedDays] = useState({});
//   const [totalPresentDays, setTotalPresentDays] = useState({});
//   const [dutyHours, setDutyHours] = useState({});
//   const [overtime, setOvertime] = useState({});

//   useEffect(() => {
//     if (allEntities && attendances) {
//       const initialSelectedDays = {};
//       const initialTotalPresentDays = {};
//       const initialDutyHours = {};
//       const initialOvertime = {};

//       allEntities.forEach((entity) => {
//         const entityId = entity?._id;
//         if (!entityId) return;

//         initialSelectedDays[entityId] = {};
//         initialTotalPresentDays[entityId] = {};
//         initialDutyHours[entityId] = {};
//         initialOvertime[entityId] = {};

//         initialSelectedDays[entityId][selectedMonthYear] = Array(
//           endOfSelectedMonth.getDate()
//         ).fill(false);
//         initialTotalPresentDays[entityId][selectedMonthYear] = 0;
//         initialDutyHours[entityId][selectedMonthYear] = Array(
//           endOfSelectedMonth.getDate()
//         ).fill(0);
//         initialOvertime[entityId][selectedMonthYear] = Array(
//           endOfSelectedMonth.getDate()
//         ).fill(0);

//         attendances
//           .filter(
//             (attendance) =>
//               attendance.employeeId === entityId &&
//               new Date(attendance.date) >= startOfSelectedMonth &&
//               new Date(attendance.date) <= endOfSelectedMonth
//           )
//           .forEach((attendance) => {
//             const date = new Date(attendance.date);
//             const recordMonthYear = `${
//               date.getMonth() + 1
//             }/${date.getFullYear()}`;
//             const day = date.getDate() - 1;

//             if (!initialSelectedDays[entityId][recordMonthYear]) {
//               initialSelectedDays[entityId][recordMonthYear] = Array(
//                 endOfSelectedMonth.getDate()
//               ).fill(false);
//               initialTotalPresentDays[entityId][recordMonthYear] = 0;
//               initialDutyHours[entityId][recordMonthYear] = Array(
//                 endOfSelectedMonth.getDate()
//               ).fill(0);
//               initialOvertime[entityId][recordMonthYear] = Array(
//                 endOfSelectedMonth.getDate()
//               ).fill(0);
//             }

//             if (attendance.status === "Present") {
//               initialSelectedDays[entityId][recordMonthYear][day] = true;
//               initialTotalPresentDays[entityId][recordMonthYear]++;
//             }

//             initialDutyHours[entityId][recordMonthYear][day] =
//               attendance.dutyHours || 0;

//             initialOvertime[entityId][recordMonthYear][day] =
//               attendance.overtime || 0;
//           });
//       });

//       setSelectedDays(initialSelectedDays);
//       setTotalPresentDays(initialTotalPresentDays);
//       setDutyHours(initialDutyHours);
//       setOvertime(initialOvertime);
//     }
//   }, [allEntities, attendances, selectedMonthYear]);

//   const handleMonthChange = (e) => {
//     setSelectedMonth(Number(e.target.value));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(Number(e.target.value));
//   };
//   useEffect(() => {
//     refetchEntities();
//   }, []); // Empty dependency array ensures it runs only once on mount
//   const handleCheckboxChange = async (entityId, day, checked) => {
//     const dateStr = `${selectedYear}-${(selectedMonth + 1)
//       .toString()
//       .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
//     const date = new Date(dateStr).toISOString();

//     const dutyHour = parseFloat(prompt("Enter duty hours:")) || 0;
//     const overtimeHours = parseFloat(prompt("Enter overtime hours:")) || 0;

//     const attendanceData = {
//       employeeId: entityId,
//       date,
//       dutyHours: dutyHour,
//       overtime: overtimeHours,
//       status: checked ? "Present" : "Absent",
//     };

//     const entity = allEntities.find((ent) => ent._id === entityId);
//     const entityName = entity
//       ? entity.name || entity.vehicleDetails.ownerName
//       : "Unknown";
//     const formattedDate = format(parseISO(date), "MMMM d, yyyy");

//     try {
//       if (checked) {
//         await createAttendance(attendanceData).unwrap();
//         toast.success(`Marked ${entityName} as Present on ${formattedDate}`, {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       } else {
//         await deleteAttendance({ id: entityId, date }).unwrap();
//         toast.info(`Marked ${entityName} as Absent on ${formattedDate}`, {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       }

//       // Refetch data after mutation
//       await Promise.all([refetchAttendances(), refetchEntities()]);
//     } catch (error) {
//       toast.error(
//         `Failed to ${
//           checked ? "mark present" : "mark absent"
//         } for ${entityName} on ${formattedDate}`,
//         {
//           position: "bottom-right",
//           autoClose: 3000,
//         }
//       );
//     }
//   };

//   if (isAttendancesLoading || isEntitiesLoading) {
//     return <div>Loading...</div>;
//   }

//   if (attendancesError || entitiesError) {
//     return <div>Error fetching data</div>;
//   }

//   const daysInMonth = new Array(endOfSelectedMonth.getDate())
//     .fill(null)
//     .map((_, i) => i + 1);

//   const renderTable = (entity) => {
//     const entityId = entity?._id;
//     if (!entityId) return null;
//     console.log("entity", entity);
//     // Define entityName based on registrationType
//     const entityName =
//       entity.registrationType === "vehicle"
//         ? entity?.name || "Unknown Vehicle Owner"
//         : entity.name || "Unknown Employee";

//     // Calculate totals for the current month
//     const totalPresent = totalPresentDays[entityId]?.[selectedMonthYear] || 0;
//     const totalDutyHours = (
//       dutyHours[entityId]?.[selectedMonthYear] || []
//     ).reduce((acc, curr) => acc + curr, 0);
//     const totalOvertime = (
//       overtime[entityId]?.[selectedMonthYear] || []
//     ).reduce((acc, curr) => acc + curr, 0);

//     return (
//       <div key={entityId} className="p-4 dark:bg-gray-700">
//         <h3 className="text-lg font-semibold mb-2 dark:bg-gray-700">
//           {entityName} - {format(startOfSelectedMonth, "MMMM yyyy")}
//         </h3>
//         <table className="min-w-full border border-gray-300 dark:bg-gray-700">
//           <thead>
//             <tr>
//               <th className="border-b border-gray-300 p-2 dark:bg-gray-700">
//                 Date
//               </th>
//               {daysInMonth.map((day) => (
//                 <th
//                   key={day}
//                   className="border-b border-gray-300 p-2 text-center dark:bg-gray-700"
//                 >
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="border-b border-gray-300 p-2 text-center dark:bg-gray-700"></td>
//               {daysInMonth.map((day) => (
//                 <td
//                   key={day}
//                   className="border-b border-gray-300 p-2 text-center dark:bg-gray-700"
//                 >
//                   <input
//                     className="dark:bg-gray-700"
//                     type="checkbox"
//                     checked={
//                       selectedDays[entityId]?.[selectedMonthYear]?.[day - 1] ||
//                       false
//                     }
//                     onChange={(e) =>
//                       handleCheckboxChange(entityId, day - 1, e.target.checked)
//                     }
//                   />
//                 </td>
//               ))}
//             </tr>
//             <tr>
//               <td className="border-b border-gray-300 p-2 dark:bg-gray-700">
//                 Duty Hours
//               </td>
//               {daysInMonth.map((day) => (
//                 <td
//                   key={day}
//                   className="border-b border-gray-300 p-2 text-center dark:bg-gray-700"
//                 >
//                   {dutyHours[entityId]?.[selectedMonthYear]?.[day - 1] || 0}
//                 </td>
//               ))}
//             </tr>
//             <tr>
//               <td className="border-b border-gray-300 p-2 dark:bg-gray-700">
//                 Overtime
//               </td>
//               {daysInMonth.map((day) => (
//                 <td
//                   key={day}
//                   className="border-b border-gray-300 p-2 text-center dark:bg-gray-700"
//                 >
//                   {overtime[entityId]?.[selectedMonthYear]?.[day - 1] || 0}
//                 </td>
//               ))}
//             </tr>
//             <tr>
//               <td className="border-b border-gray-300 p-2 font-bold dark:bg-gray-700">
//                 Total
//               </td>
//               <td
//                 colSpan={daysInMonth.length}
//                 className="border-b border-gray-300 p-2 dark:bg-gray-700"
//               >
//                 <div>Total Present Days: {totalPresent}</div>
//                 <div>Total Duty Hours: {totalDutyHours}</div>
//                 <div>Total Overtime: {totalOvertime}</div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4 dark:bg-gray-700">
//         Attendance List
//       </h1>
//       <div className="mb-4 dark:bg-gray-700">
//         <label className="mr-2 dark:bg-gray-700">Month:</label>
//         <select
//           value={selectedMonth}
//           onChange={handleMonthChange}
//           className="dark:bg-gray-700"
//         >
//           {Array.from({ length: 12 }, (_, i) => (
//             <option key={i} value={i}>
//               {format(new Date(0, i), "MMMM")}
//             </option>
//           ))}
//         </select>
//         <label className="ml-4 mr-2 dark:bg-gray-700 dark:text-white">
//           Year:
//         </label>
//         <input
//           type="number"
//           value={selectedYear}
//           onChange={handleYearChange}
//           className="border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
//         />
//       </div>
//       {allEntities && allEntities.map((entity) => renderTable(entity))}
//       <ToastContainer />
//     </div>
//   );
// };

// export default AttendanceList;
import { useState, useEffect, useMemo } from "react";
import {
  useGetAttendancesQuery,
  useCreateAttendanceMutation,
  useDeleteAttendanceMutation,
} from "../store/api/AttendenceApi";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

const AttendanceList = () => {
  const {
    data: allEntities,
    refetch: refetchEntities,
    isLoading: isEntitiesLoading,
    error: entitiesError,
  } = useGetAllEmployeesQuery();

  const {
    data: attendances,
    refetch: refetchAttendances,
    isLoading: isAttendancesLoading,
    error: attendancesError,
  } = useGetAttendancesQuery();

  const [createAttendance] = useCreateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const [inputValue, setInputValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [totalDaysWorked, setTotalDaysWorked] = useState({});

  const startOfSelectedMonth = useMemo(
    () => startOfMonth(new Date(selectedYear, selectedMonth)),
    [selectedYear, selectedMonth]
  );

  const endOfSelectedMonth = useMemo(
    () => endOfMonth(new Date(selectedYear, selectedMonth)),
    [selectedYear, selectedMonth]
  );

  const selectedMonthYear = useMemo(
    () => `${selectedMonth + 1}/${selectedYear}`,
    [selectedMonth, selectedYear]
  );

  const [selectedDays, setSelectedDays] = useState({});
  const [totalPresentDays, setTotalPresentDays] = useState({});
  const [dutyHours, setDutyHours] = useState({});
  const [overtime, setOvertime] = useState({});

  useEffect(() => {
    if (allEntities && attendances) {
      const initialSelectedDays = {};
      const initialTotalPresentDays = {};
      const initialDutyHours = {};
      const initialOvertime = {};
      const initialTotalDaysWorked = {};

      allEntities.forEach((entity) => {
        const entityId = entity?._id;
        if (!entityId) return;

        initialSelectedDays[entityId] = {};
        initialTotalPresentDays[entityId] = {};
        initialDutyHours[entityId] = {};
        initialOvertime[entityId] = {};
        initialTotalDaysWorked[entityId] = {};

        initialSelectedDays[entityId][selectedMonthYear] = Array(
          endOfSelectedMonth.getDate()
        ).fill(false);
        initialTotalPresentDays[entityId][selectedMonthYear] = 0;
        initialDutyHours[entityId][selectedMonthYear] = Array(
          endOfSelectedMonth.getDate()
        ).fill(0);
        initialOvertime[entityId][selectedMonthYear] = Array(
          endOfSelectedMonth.getDate()
        ).fill(0);
        initialTotalDaysWorked[entityId][selectedMonthYear] = Array(
          endOfSelectedMonth.getDate()
        ).fill(0); // Initialize as an array

        attendances
          .filter(
            (attendance) =>
              attendance.employeeId === entityId &&
              new Date(attendance.date) >= startOfSelectedMonth &&
              new Date(attendance.date) <= endOfSelectedMonth
          )
          .forEach((attendance) => {
            const date = new Date(attendance.date);
            const recordMonthYear = `${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
            const day = date.getDate() - 1;

            if (!initialSelectedDays[entityId][recordMonthYear]) {
              initialSelectedDays[entityId][recordMonthYear] = Array(
                endOfSelectedMonth.getDate()
              ).fill(false);
              initialTotalPresentDays[entityId][recordMonthYear] = 0;
              initialDutyHours[entityId][recordMonthYear] = Array(
                endOfSelectedMonth.getDate()
              ).fill(0);
              initialOvertime[entityId][recordMonthYear] = Array(
                endOfSelectedMonth.getDate()
              ).fill(0);
              initialTotalDaysWorked[entityId][recordMonthYear] = Array(
                endOfSelectedMonth.getDate()
              ).fill(0); // Initialize as array for new month
            }

            if (attendance.status === "Present") {
              initialSelectedDays[entityId][recordMonthYear][day] = true;
              initialTotalPresentDays[entityId][recordMonthYear]++;
            }

            initialDutyHours[entityId][recordMonthYear][day] =
              attendance.dutyHours || 0;
            initialTotalDaysWorked[entityId][recordMonthYear][day] =
              attendance.totalDaysWorked || 0; // Set value correctly
            initialOvertime[entityId][recordMonthYear][day] =
              attendance.overtime || 0;
          });
      });

      setSelectedDays(initialSelectedDays);
      setTotalPresentDays(initialTotalPresentDays);
      setDutyHours(initialDutyHours);
      setOvertime(initialOvertime);
      setTotalDaysWorked(initialTotalDaysWorked); // Set total days worked state
    }
  }, [allEntities, attendances, selectedMonthYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  useEffect(() => {
    refetchEntities();
  }, []); // Empty dependency array ensures it runs only once on mount

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCheckboxChange = async (entityId, day, checked) => {
    const dateStr = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`;
    const date = new Date(dateStr).toISOString();

    const dutyHour = parseFloat(prompt("Enter duty hours:")) || 0;
    const overtimeHours = parseFloat(prompt("Enter overtime hours:")) || 0;
    const totalDaysWorked = parseInt(prompt("Enter total days worked:")) || 0; // New input for total days worked

    const attendanceData = {
      employeeId: entityId,
      date,
      dutyHours: dutyHour,
      overtime: overtimeHours,
      totalDaysWorked, // Include the total days worked in the attendance data
      status: checked ? "Present" : "Absent",
    };

    const entity = allEntities.find((ent) => ent._id === entityId);
    const entityName = entity
      ? entity.name || entity.vehicleDetails.ownerName
      : "Unknown";
    const formattedDate = format(parseISO(date), "MMMM d, yyyy");

    try {
      if (checked) {
        await createAttendance(attendanceData).unwrap();
        toast.success(`Marked ${entityName} as Present on ${formattedDate}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        await deleteAttendance({ id: entityId, date }).unwrap();
        toast.info(`Marked ${entityName} as Absent on ${formattedDate}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }

      // Refetch data after mutation
      await Promise.all([refetchAttendances(), refetchEntities()]);
    } catch (error) {
      toast.error(
        `Failed to ${
          checked ? "mark present" : "mark absent"
        } for ${entityName} on ${formattedDate}`,
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
    }
  };

  if (isAttendancesLoading || isEntitiesLoading) {
    return <div>Loading...</div>;
  }

  if (attendancesError || entitiesError) {
    return <div>Error fetching data</div>;
  }

  const daysInMonth = new Array(endOfSelectedMonth.getDate())
    .fill(null)
    .map((_, i) => i + 1);

  const renderTable = (entity) => {
    const entityId = entity?._id;
    if (!entityId) return null;

    const entityName = entity.name || "Unknown Employee";
    const attendanceDays = selectedDays[entityId]?.[selectedMonthYear] || [];
    const dutyHoursArray = dutyHours[entityId]?.[selectedMonthYear] || [];
    const overtimeArray = overtime[entityId]?.[selectedMonthYear] || [];
    const daysWorkedArray =
      totalDaysWorked[entityId]?.[selectedMonthYear] || [];

    const totalPresent = attendanceDays.filter(Boolean).length;
    const totalDutyHours = dutyHoursArray.reduce((acc, curr) => acc + curr, 0);
    const totalOvertime = overtimeArray.reduce((acc, curr) => acc + curr, 0);
    const totalDaysWorkedCount = daysWorkedArray.reduce(
      (acc, curr) => acc + curr,
      0
    );
    console.log("totalDaysWorkedCount", totalDaysWorkedCount);
    return (
      <div key={entityId} className="p-4 dark:bg-gray-700">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {entityName} - {format(startOfSelectedMonth, "MMMM yyyy")}
        </h3>
        <table className="min-w-full border border-gray-300 dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border-b border-gray-300 p-2 dark:text-white">
                Date
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day}
                  className="border-b border-gray-300 p-2 text-center dark:text-white"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Checkbox Row */}
            <tr>
              <td className="border-b border-gray-300 p-2 dark:text-white"></td>
              {daysInMonth.map((day) => (
                <td
                  key={day}
                  className="border-b border-gray-300 p-2 text-center dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedDays[entityId]?.[selectedMonthYear]?.[day - 1] ||
                      false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(entityId, day - 1, e.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
            {/* Duty Hours Row */}
            <tr>
              <td className="border-b border-gray-300 p-2 dark:text-white">
                Duty Hours
              </td>
              {daysInMonth.map((day) => (
                <td
                  key={day}
                  className="border-b border-gray-300 p-2 text-center dark:text-white"
                >
                  {dutyHours[entityId]?.[selectedMonthYear]?.[day - 1] || 0}
                </td>
              ))}
            </tr>
            {/* Overtime Row */}
            <tr>
              <td className="border-b border-gray-300 p-2 dark:text-white">
                Overtime
              </td>
              {daysInMonth.map((day) => (
                <td
                  key={day}
                  className="border-b border-gray-300 p-2 text-center dark:text-white"
                >
                  {overtime[entityId]?.[selectedMonthYear]?.[day - 1] || 0}
                </td>
              ))}
            </tr>
            {/* Total Row */}
            <tr>
              <td className="border-b border-gray-300 p-2 font-bold dark:text-white">
                Total
              </td>
              <td
                colSpan={daysInMonth.length}
                className="border-b border-gray-300 p-2 dark:bg-gray-800"
              >
                <div className="flex gap-4 items-center">
                  <span className="font-semibold">
                    Total Present Days: {totalPresent}
                  </span>
                  <span className="font-semibold">
                    Total Duty Hours: {totalDutyHours}
                  </span>
                  <span className="font-semibold">
                    Total Overtime: {totalOvertime}
                  </span>
                  <span className="font-semibold">
                    Total Days Worked: {totalDaysWorkedCount}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const filteredEntities = allEntities?.filter((entity) => {
    const entityName = entity.name || entity.vehicleDetails?.ownerName || "";
    return entityName.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:bg-gray-700">
        Attendance List
      </h1>
      <div className="mb-4 dark:bg-gray-700">
        <label className="mr-2 dark:bg-gray-700">Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
        <label className="ml-4 mr-2 dark:bg-gray-700">Month:</label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="dark:bg-gray-700"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {format(new Date(0, i), "MMMM")}
            </option>
          ))}
        </select>
        <label className="ml-4 mr-2 dark:bg-gray-700 dark:text-white">
          Year:
        </label>
        <input
          type="number"
          value={selectedYear}
          onChange={handleYearChange}
          className="border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
      </div>
      {filteredEntities &&
        filteredEntities.map((entity) => renderTable(entity))}
      <ToastContainer />
    </div>
  );
};

export default AttendanceList;
