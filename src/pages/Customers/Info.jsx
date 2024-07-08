import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CustomerNav from "../../components/Navigations/CustomerNav";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import SearchableTable from "../../components/Tables/SearchableTable";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import { CustomerColumns } from "../../utils/ColumnsData/CustomerColumns";
import EditCustomerModal from "../../components/Modals/EditCustomerModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteCustomerApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import SearchBox from "../../components/SearhBox/SearchBox";
import { Popover, Typography } from "@mui/material";

const Info = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [SearchTextPop, setSearchTextPop] = useState("");
  const [Loading, setLoading] = useState(false);
  const [SelectedCity, setSelectedCity] = useState("");

  const CustomerState = useSelector((state) => state.CustomerState);
  const AuthState = useSelector((state) => state.AuthState);
  const [Cities, setCities] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchCustomers({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, []);
  useEffect(() => {
    if (CustomerState.data.length !== 0) GetCities();
  }, [CustomerState.data]);

  const GetCities = () => {
    const SCities = CustomerState.data.map((dt) => {
      return dt.address;
    });
    const uniqueCities = [...new Set(SCities)];
    setCities(uniqueCities);
    console.log(uniqueCities);
    // setCities()
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className="relative">
      <Navbar />
      <CustomerNav />
      <div className="w-full my-2 flex justify-center items-center mb-5">
        <CustomPopOver
          label={"Select City"}
          placeholder={"Select City"}
          required={false}
          Value={SelectedCity || "Select City"}
          onClick={handleClick}
        />

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: "25px", // Add rounded corners
              backgroundColor: "white", // Set background color to white
              width: "400px", // Set the width as needed
              overflow: "hidden", // Hide overflowing content
              //   marginTop: "6px",
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Typography
            sx={{
              p: 2,
              borderColor: "#000",
              backgroundColor: "#000",
              width: "100%",
              overflow: "hidden",
              borderRadius: "25px",
              overflowY: "auto",
              height: "60vh",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                <SearchBox
                  Value={SearchTextPop}
                  SetValue={setSearchTextPop}
                  Placeholder={"Search City"}
                />
                {Cities.filter((dt) => {
                  const lowerCaseSearch = SearchText.toLowerCase();
                  const lowerCaseStation = dt.toLowerCase();
                  if (SearchText !== "") {
                    return lowerCaseStation.includes(lowerCaseSearch);
                  } else {
                    return dt;
                  }
                }).map((dt) => (
                  <div
                    key={dt}
                    className="flex gap-x-3 items-center cursor-pointer"
                    onClick={() => {
                      handleClose();
                      setSelectedCity(dt);
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                      checked={SelectedCity === dt}
                      readOnly
                    />
                    <span>{dt}</span>
                  </div>
                ))}
              </div>
            </div>
          </Typography>
        </Popover>
      </div>
      <div className="w-full mt-2 flex justify-center items-center">
        <SearchableTable
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelected={setSelected}
          SearchPlaceholder={"Search Customer..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={CustomerState.data.filter(
            (dt) =>
              (SelectedCity === "" || dt.address === SelectedCity) &&
              (SearchText === "" ||
                dt.name.toLowerCase().startsWith(SearchText.toLowerCase()))
          )}
          Columns={CustomerColumns}
        />
        {OpenEditModal && (
          <EditCustomerModal
            OpenModal={OpenEditModal}
            setOpenModal={setOpenEditModal}
            customer={CustomerState.data.find((dt) => dt._id === Selected._id)}
          />
        )}

        {OpenDeleteModal && (
          <DeleteModal
            Open={OpenDeleteModal}
            setOpen={setOpenDeleteModal}
            onSubmit={async () => {
              setLoading(true);
              try {
                const response = await DeleteCustomerApi(Selected._id);
                if (response.data.success) {
                  SuccessToast(response.data.data.msg);
                  setOpenDeleteModal(false);
                  dispatch(
                    fetchCustomers({
                      branch: 1,
                    })
                  );
                }
              } catch (err) {
                console.log(err);
              }
              setLoading(false);
            }}
            Loading={Loading}
          />
        )}
      </div>
    </div>
  );
};

export default Info;
