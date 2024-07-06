"use client";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useDispatch } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import { CreateEmployeeApi } from "@/Https"; // Make sure to define this API function
import { ErrorToast, SuccessToast } from "@/utils/ShowToast";
import CustomInput from "../Inputs/CustomInput";
import { fetchEmployees } from "@/utils/Slices/EmployeeSlice";

const CreateEmployeeModal = ({ OpenModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    cnic: "",
    address: "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { name, contact, email, cnic, address } = formData;

    if (!name || !contact || !email || !cnic || !address) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await CreateEmployeeApi(formData);
      if (response.data.success) {
        SuccessToast(response.data.message);
        dispatch(fetchEmployees()); // Ensure you have a function to fetch employee data
        setOpenModal(false);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <ModalWrapper
      open={OpenModal}
      setOpen={setOpenModal}
      title={"Add Employee"}
    >
      <div className="flex flex-col justify-center py-5">
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <CustomInput
              id="name"
              Type="text"
              label="Name"
              placeholder="Enter Name"
              Value={formData.name}
              setValue={(value) => handleChange("name", value)}
              required
            />
            <CustomInput
              id="contact"
              Type="text"
              label="Contact"
              placeholder="Enter Contact"
              Value={formData.contact}
              setValue={(value) => handleChange("contact", value)}
              required
            />
            <CustomInput
              id="email"
              Type="email"
              label="Email"
              placeholder="Enter Email"
              Value={formData.email}
              setValue={(value) => handleChange("email", value)}
              required
            />
            <CustomInput
              id="cnic"
              Type="text"
              label="CNIC"
              placeholder="Enter CNIC"
              Value={formData.cnic}
              setValue={(value) => handleChange("cnic", value)}
              required
            />
            <CustomInput
              id="address"
              Type="text"
              label="Address"
              placeholder="Enter Address"
              Value={formData.address}
              setValue={(value) => handleChange("address", value)}
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[60%] hover:bg-[#394B92] py-2 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Add Employee
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateEmployeeModal;
