import { BiSolidReport } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { VscGitPullRequestCreate } from "react-icons/vsc"; // Import the remaining icon

// Array of objects representing the navigation buttons
const CustomerNavData = [
  {
    title: "Create New",
    type: "modal",
    link: "/",
    icon: FaUserPlus,
  },
  {
    title: "Create Bill",
    type: "link",
    link: "/customer/create-bill",
    icon: MdOutlineCreateNewFolder,
  },
  {
    title: "Info",
    type: "link",
    link: "/customer",
    icon: IoInformationCircle,
  },
  {
    title: "Item Return",
    type: "link",
    link: "/customer/create-bill-return",
    icon: VscGitPullRequestCreate,
  },
  {
    title: "Ledger",
    type: "link",
    link: "/customer/ledger",
    icon: BiSolidReport,
  },
  {
    title: "Invoice Edit",
    type: "link",
    link: "/customer/edit-invoice",
    icon: BiSolidReport,
  },
];

export default CustomerNavData;
