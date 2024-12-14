import { BiSolidReport } from "react-icons/bi";
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
    title: "Complete Ledger",
    type: "link",
    link: "/supplier/complete-ledger",
    icon: BiSolidReport,
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
  {
    title: "Add Opening Balance",
    type: "modal",
    link: "/",
    icon: BiSolidReport,
  },
];

export default CompanyNavData;
