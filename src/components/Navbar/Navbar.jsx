import React, { useState } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import {
  FaHome,
  FaBuilding,
  FaBox,
  FaUserFriends,
  FaChartBar,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import Logo from "./logo.png";
import Logo1 from "./logo1.png";
import Logout from "../Modals/Logout";
import { MdFactory } from "react-icons/md";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [OpenModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const toggleModal = () => {
    setOpenModal(true);
  };

  const AuthState = useSelector((state) => state.AuthState);
  // console.log(AuthState.data.role);

  const navItems = [
    { text: "Home", icon: FaHome, path: "/home" },
    { text: "Supplier", icon: FaBuilding, path: "/supplier" },
    { text: "Items", icon: FaBox, path: "/items" },
    { text: "Customer", icon: FaUserFriends, path: "/customer" },
    { text: "Reports", icon: FaChartBar, path: "/reports" },
    { text: "Cash Payments", icon: FaMoneyBillWave, path: "/cash-payments" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false); // Close the drawer after navigation
  };

  return (
    <div>
      <AppBar position="fixed" className="">
        <Toolbar className="flex justify-between items-center bg-[black] py-4">
          <div className="flex">
            <div className="flex mr-1">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <BsFillMenuButtonWideFill className="hover:text-gray-300 text-white transition-all ease-in-out duration-700" />
              </IconButton>
            </div>
            <div className="flex items-center">
              <div className="font-bold text-2xl font-mono ml-2 border-2 border-white border-x-0 rounded-lg py-2 px-2">
                {AuthState.data.role === 2
                  ? AuthState.data.branchId.name
                  : "Admin Panel"}
              </div>
              {/* <img
                src={Logo}
                alt="Logo"
                className="h-12 ml-2 cursor-pointer"
                onClick={() => navigate("/home")}
              /> */}
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-3">
            {AuthState.data.role === 1 && (
              <MdFactory
                className="hover:text-gray-400 text-white transition-all ease-in-out duration-700 cursor-pointer text-3xl"
                onClick={() => {
                  navigate("/branches");
                }}
              />
            )}
            <IoExit
              className="hover:text-gray-400 text-white transition-all ease-in-out duration-700 cursor-pointer text-3xl"
              onClick={toggleModal}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: "fade-in" }}
      >
        <div className="w-auto min-w-[300px] bg-[black] h-full">
          <div className="flex justify-center py-6 px-4">
            <img
              src={Logo1}
              alt="Logo"
              className="w-[200px] cursor-pointer"
              onClick={() => navigate("/home")}
            />
          </div>
          <div className="w-[100%]">
            <List>
              {navItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemText>
                    <div className="text-white flex items-center justify-start cursor-pointer bg-[#464F51] px-4 py-3 text-xl font-bold hover:rounded-lg hover:bg-[white] hover:text-[#464F51] transition-all ease-in-out duration-700">
                      <item.icon className="text-xl mr-2" />
                      {item.text}
                    </div>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </Drawer>
      {OpenModal && <Logout Open={OpenModal} setOpen={setOpenModal} />}
    </div>
  );
};

export default Navbar;
