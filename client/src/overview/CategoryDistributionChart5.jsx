import React, { useEffect, useState } from "react";
import { useGetMonthProfitsQuery } from "../store/api/MonthProfitApi";
import Chart from "react-apexcharts"; // Importing ApexCharts
import { useNavigate } from "react-router-dom";

const CategoryDistributionChart5 = () => {
  const {
    data: profits = [],
    error,
    isLoading,
    refetch,
  } = useGetMonthProfitsQuery();
  const [groupTotals, setGroupTotals] = useState({});
  console.log("groupTotals", groupTotals);
  const navigate = useNavigate();

  // Fetch new data when loading is false
  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [refetch, isLoading]);

  // Calculate totals and store them in state
  useEffect(() => {
    if (profits.length > 0) {
      const groupedProfits = profits.reduce((acc, profit) => {
        const ownerName = profit.owner.name;
        if (!acc[ownerName]) {
          acc[ownerName] = [];
        }
        acc[ownerName].push(profit);
        return acc;
      }, {});

      const newGroupTotals = {
        totalIncome: 0,
        totalGst: 0,
        totalTds: 0,
        totalEsi: 0,
        totalPf: 0,
        totalExpense: 0,
        totalProfit: 0,
        ownerAmount: 0,
        openingBalance: 0,
        closingBalance: 0,
      };

      Object.keys(groupedProfits).forEach((ownerName) => {
        const ownerProfits = groupedProfits[ownerName];

        ownerProfits.forEach((profit) => {
          const gstValue = (profit.amount * profit.gst) / 100;
          const tdsValue = (profit.amount * profit.tds) / 100;

          // Accumulate totals for each owner
          newGroupTotals.totalIncome += profit.amount;
          newGroupTotals.totalGst += gstValue;
          newGroupTotals.totalTds += tdsValue;
          newGroupTotals.totalEsi += profit.esi || 0;
          newGroupTotals.totalPf += profit.pf || 0;
          newGroupTotals.openingBalance += profit.openingBalance;
          newGroupTotals.closingBalance +=
            profit.closingBalance ||
            profit.openingBalance +
              profit.amount +
              newGroupTotals.totalGst -
              newGroupTotals.totalTds;
          Number(profit.ownerAmount) - profit.expense;

          newGroupTotals.totalExpense += profit.expense || 0;
          newGroupTotals.totalProfit +=
            profit.amount - tdsValue - Number(profit.ownerAmount);
          newGroupTotals.ownerAmount += Number(profit.ownerAmount);
        });
      });

      // Now `newGroupTotals` contains all the accumulated values
      setGroupTotals(newGroupTotals);
    }
  }, [profits]);

  const colors = [
    "#1E90FF",
    "#32CD32",
    "#FFD700",
    "#FF4500",
    "#8A2BE2",
    "#FF69B4",
    "#DC143C",
    "#00FA9A",
    "#FF6347",
    "#7B68EE",
  ];

  // Handle clicking on pie chart segments
  const handlePieClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };
  console.log("");
  // Prepare the data for mani calculation
  const specificFields = [
    "totalIncome",
    "totalGst",
    "totalTds",
    "totalEsi",
    "totalPf",
    "totalExpense",
    "totalProfit",
    "ownerAmount",
    "openingBalance",
    "closingBalance",
  ];
  // Prepare data for the pie chart
  const pieChartData = specificFields.map((field) => ({
    name: field, // The field name
    value: groupTotals[field] || 0, // The corresponding value or default to 0 if undefined
  }));
  console.log("pieChartData", pieChartData);
  // Chart options configuration
  const chartOptions = {
    chart: {
      type: "pie",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedGroup = pieChartData[config.dataPointIndex].name;
          handlePieClick(selectedGroup); // Handle click on pie chart slice
        },
      },
    },
    labels: pieChartData.map((item) => item.name), // Labels for pie chart sections
    colors, // Color configuration for the pie chart sections
    tooltip: {
      y: {
        formatter: (val) => `${val}`, // Format tooltip to show value
      },
    },
    legend: {
      show: true,
      position: "bottom",
      formatter: (seriesName, opts) => {
        const legendColor = colors[opts.seriesIndex]; // Get the color for the legend
        const modeClass = document.documentElement.classList.contains("dark")
          ? "text-gray-100"
          : "text-gray-900";
        return `<span class="${modeClass}" style="color: ${legendColor};">${seriesName}</span>`;
      },
    },
  };

  // Prepare series data for the pie chart
  const series = pieChartData.map((item) => Math.abs(item.value));

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="bg-[#87CEFA] bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
        Income Distribution
      </h2>
      <div className="h-80">
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CategoryDistributionChart5;
