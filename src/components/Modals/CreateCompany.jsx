import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import Joi from "joi";
import { useDispatch, useSelector } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { CreateCompanyApi } from "../../Https";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";

const CreateCompany = ({ Open, setOpen }) => {
  const [Name, setName] = useState("");
  const [Contact, setContact] = useState("");
  const [Email, setEmail] = useState("");
  const [Cnic, setCnic] = useState("");
  const [Desc, setDesc] = useState("");
  const [Address, setAddress] = useState("");
  const [Loading, setLoading] = useState(false);
  const [CurrentBranch, setCurrentBranch] = useState("");
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);
  // console.log(AuthState.data.branchId.branch_number);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const schema = Joi.object({
      Name: Joi.string().required(),
      Contact: Joi.string().required(),
      Email: Joi.string().required(),
      Cnic: Joi.string().required(),
      Desc: Joi.string().required(),
      Address: Joi.string().required(),
    });

    // Validate input values
    const { error } = schema.validate({
      Name,
      Contact: Contact.toString(),
      Email,
      Cnic: Cnic.toString(),
      Desc,
      Address,
    });

    if (error) {
      alert(error.message);
      setLoading(false); // Set loading to false if validation fails
    } else {
      try {
        const response = await CreateCompanyApi({
          name: Name,
          contact: Contact.toString(),
          email: Email,
          cnic: Cnic.toString(),
          description: Desc,
          address: Address,
          branch:
            AuthState.data.role === 2
              ? AuthState.data.branchId.branch_number
              : -1,
        });
        if (response.data.success) {
          SuccessToast(response.data.data.msg);
          dispatch(fetchCompanies());
          setOpen(false);
        }
      } catch (err) {
        ErrorToast(err.response.data.error.msg);
        console.log(err);
      }
      setLoading(false);
    }
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
    <ModalWrapper open={Open} setOpen={setOpen} title={"Create Supplier"}>
      <div className="flex justify-center flex-col py-5 gap-y-4">
        <CustomInput
          id="name"
          label="Name"
          placeholder="Enter Name"
          Value={Name}
          setValue={setName}
        />

        <CustomInput
          id="contact"
          label="Contact"
          placeholder="Enter Contact"
          type="number"
          Value={Contact}
          setValue={setContact}
        />

        <CustomInput
          id="email"
          label="Email"
          placeholder="Enter Email"
          type="email"
          Value={Email}
          setValue={setEmail}
        />

        <CustomInput
          id="cnic"
          label="CNIC"
          placeholder="Enter CNIC"
          type="number"
          Value={Cnic}
          setValue={setCnic}
        />

        <CustomInput
          id="desc"
          label="Description"
          placeholder="Enter Description"
          type="text"
          Value={Desc}
          setValue={setDesc}
        />

        <CustomInput
          id="address"
          label="Address"
          placeholder="Enter Address"
          type="text"
          Value={Address}
          setValue={setAddress}
        />

        {/* <CustomPopOver
          label={"Select Branch"}
          placeholder={"Select Branch"}
          required={false}
          Value={CurrentBranch || "Select Branch"}
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
              width: "300px", // Set the width as needed
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
              borderColor: "#465462",
              backgroundColor: "#465462",
              width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                {[1, 2, 3].map((dt) => (
                  <div
                    key={dt}
                    className="flex gap-x-3 items-center cursor-pointer"
                    onClick={() => {
                      handleClose();
                      setCurrentBranch(dt);
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                      checked={CurrentBranch === dt}
                      readOnly
                    />
                    <span>{dt}</span>
                  </div>
                ))}
              </div>
            </div>
          </Typography>
        </Popover> */}
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Create Company
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateCompany;
