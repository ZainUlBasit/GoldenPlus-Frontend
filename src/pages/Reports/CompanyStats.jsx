import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ReportNav from "../../components/Navigations/ReportNav";
import ReportCard from "../../components/Cards/ReportCard";

const CompanyStats = () => {
  const [OpenStatsReport, setOpenStatsReport] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  return (
    <div className="relative">
      <Navbar />
      <ReportNav />
      <div className="h-[100vh] my-2">
        <ReportCard
          title={"Company Stats"}
          setOpenReport={setOpenStatsReport}
          fromDate={fromDate}
          toDate={toDate}
          setToDate={setToDate}
          setFromDate={setFromDate}
        />
      </div>
    </div>
  );
};

export default CompanyStats;
