import {
  FaInfo,
  FaBook,
  FaClipboardList,
  FaPlus,
  FaWarehouse,
  FaChartLine,
} from "react-icons/fa";

const CompanyNavData = [
  {
    title: "Create Supplier",
    type: "modal",
    link: "/",
    icon: FaPlus,
  },
  {
    title: "Info",
    type: "link",
    link: "/supplier",
    icon: FaInfo,
  },
  {
    title: "Accounts",
    type: "link",
    link: "/supplier/accounts",
    icon: FaBook,
  },
  {
    title: "Ledger",
    type: "link",
    link: "/supplier/ledger",
    icon: FaClipboardList,
  },
  {
    title: "Add Raw Material",
    type: "modal",
    link: "/",
    icon: FaWarehouse,
  },
  {
    title: "Raw Material Stats",
    type: "link",
    link: "/supplier/stock-stat",
    icon: FaChartLine,
  },
];

export default CompanyNavData;
