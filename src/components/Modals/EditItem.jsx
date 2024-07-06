import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { fetchCompanies } from "@/utils/Slices/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { ErrorToast } from "@/utils/ShowToast";
import { CreateItemApi, UpdateItemApi } from "@/Https";
import { successMessage } from "@/utils/ResponseMessage";
import ProcessLoader from "../Loader/ProcessLoader";
import { fetchItems } from "@/utils/Slices/ItemSlice";

const EditItem = ({ open, setOpen, CurrentItem }) => {
  const [code, setCode] = useState(CurrentItem?.code);
  const [name, setName] = useState(CurrentItem?.name);
  const [company, setCompany] = useState(CurrentItem?.companyId?._id);
  const [desc, setDesc] = useState(CurrentItem?.desc);
  const [purchase, setPurchase] = useState(CurrentItem?.purchase);
  const [sale, setSale] = useState(CurrentItem?.sale);
  const [Loading, setLoading] = useState(false);

  const CompanyState = useSelector((state) => state.CompanyState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanies());
  }, []);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    // Handle form submission logic here
    if (!code || !name || !company || !purchase || !sale)
      return ErrorToast("Required fields are undefined!");
    try {
      const response = await UpdateItemApi({
        itemId: CurrentItem._id,
        payload: {
          code,
          name,
          companyId: company,
          desc,
          purchase: Number(purchase),
          sale: Number(sale),
        },
      });
      console.log(response);
      if (response.data.success) {
        successMessage(response.data.data.msg);
        dispatch(fetchItems());
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} title={"Create Item"}>
      <div className="flex justify-center flex-col py-5">
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
          <TextField
            id="outlined-basic"
            label="Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }}>
          <Select
            value={company}
            onChange={handleCompanyChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Company" }}
          >
            <MenuItem value="" disabled>
              Select Company
            </MenuItem>
            {!CompanyState.loading &&
              CompanyState.data.map((dt) => (
                <MenuItem value={dt._id}>{dt.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
          <TextField
            id="outlined-basic"
            label="Purchase"
            variant="outlined"
            type="number"
            value={purchase}
            onChange={(e) => setPurchase(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
          <TextField
            id="outlined-basic"
            label="Sale"
            variant="outlined"
            type="number"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </FormControl>
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Update Item
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditItem;
