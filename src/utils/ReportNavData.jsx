import { FaInfo, FaPlusCircle, FaChartLine } from "react-icons/fa";

const ReportNavData = [
  {
    title: "Expense Info",
    type: "link",
    link: "/reports",
    icon: FaInfo,
  },
  {
    title: "Add Expense",
    type: "modal",
    link: "/",
    icon: FaPlusCircle,
  },
  {
    title: "Company Stats",
    type: "link",
    link: "/reports/company-stats",
    icon: FaChartLine,
  },
];

export default ReportNavData;
