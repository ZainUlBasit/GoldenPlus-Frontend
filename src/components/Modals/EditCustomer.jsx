"use client";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { FormControl, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import { ErrorToast, SuccessToast } from "@/utils/ShowToast";
import { UpdateCustomerApi } from "@/Https";
import { fetchCustomers } from "@/utils/Slices/CustomerSlice";

const EditCustomerModal1 = ({ OpenModal, setOpenModal, customerData }) => {
  const [formData, setFormData] = useState(customerData); // Initialize state with customer data
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { name, contact, email, cnic, address, ref, page } = formData;

    if (
      !name ||
      !contact ||
      !email ||
      !cnic ||
      !address ||
      !ref ||
      page === ""
    ) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await UpdateCustomerApi({
        customerId: customerData._id,
        payload: formData,
      }); // Use the appropriate API function for updating a customer
      if (response.data.success) {
        SuccessToast(response.data.message);
        dispatch(fetchCustomers()); // Fetch updated customer data
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
      title={"Edit Customer"} // Update modal title
    >
      <div className="flex justify-center flex-col py-5">
        {/* Render form fields for editing customer data */}
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="contact"
            label="Contact"
            variant="outlined"
            value={formData.contact}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="cnic"
            label="CNIC"
            variant="outlined"
            value={formData.cnic}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            value={formData.address}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="ref"
            label="Ref"
            variant="outlined"
            value={formData.ref}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <TextField
            name="page"
            label="Page"
            variant="outlined"
            type="number"
            value={formData.page}
            onChange={handleChange}
          />
        </FormControl>
        {/* Render submit button */}
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Update Customer
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditCustomerModal1;
