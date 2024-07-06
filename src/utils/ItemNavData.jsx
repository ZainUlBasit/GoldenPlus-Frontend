import {
  FaInfo,
  FaPlusCircle,
  FaEdit,
  FaWarehouse,
  FaChartLine,
  FaBox,
} from "react-icons/fa";

const ItemNavData = [
  {
    title: "Info",
    type: "link",
    link: "/items",
    icon: FaInfo,
  },
  {
    title: "Add Article",
    type: "modal",
    link: "/",
    icon: FaPlusCircle,
  },
  {
    title: "Edit Article",
    type: "modal",
    link: "/",
    icon: FaEdit,
  },
  {
    title: "Add Stock",
    type: "modal",
    link: "/",
    icon: FaWarehouse,
  },
  {
    title: "Stock Statistics",
    type: "link",
    link: "/stock-stat",
    icon: FaChartLine,
  },
  {
    title: "Create Item",
    type: "modal",
    link: "/",
    icon: FaBox,
  },
];

export default ItemNavData;
