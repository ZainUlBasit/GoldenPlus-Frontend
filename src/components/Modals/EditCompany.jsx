import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import Joi from "joi";
import { useDispatch, useSelector } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import { UpdateCompanyApi } from "../../Https";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";

const EditCompany = ({ open, setOpen, CurrentCompany }) => {
  console.log(CurrentCompany);
  const [Name, setName] = useState(CurrentCompany.name);
  const [Contact, setContact] = useState(CurrentCompany.contact);
  const [Email, setEmail] = useState(CurrentCompany.email);
  const [Cnic, setCnic] = useState(CurrentCompany.cnic);
  const [Desc, setDesc] = useState(CurrentCompany.description);
  const [Address, setAddress] = useState(CurrentCompany.address);
  const [CurrentBranch, setCurrentBranch] = useState(CurrentCompany.branch);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const AuthState = useSelector((state) => state.AuthState);
  console.log(AuthState.data.role === 2);
  // console.log(AuthState.data?.branchId?.branch_number || "");

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
        const response = await UpdateCompanyApi({
          companyId: CurrentCompany._id,
          payload: {
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
          },
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

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  return (
    <ModalWrapper open={open} setOpen={setOpen} title={"Edit Company"}>
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
        <CustomPopOver
          label={"Select Branch"}
          placeholder={"Select Branch"}
          required={false}
          Value={
            AuthState.data.role === 2
              ? AuthState.data.branchId.branch_number
              : CurrentCompany.branch || "Select Branch"
          }
          onClick={handleClick}
        />

        <div className="w-full flex justify-center mt-2">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Update Company
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditCompany;
