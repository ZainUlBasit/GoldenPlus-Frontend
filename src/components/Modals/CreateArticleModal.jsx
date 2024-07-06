import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import ModalWrapper from "./ModalWrapper";
import CustomInput from "../Inputs/CustomInput";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { CreateArticleApi } from "../../Https";

const CreateArticleModal = ({ openModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    branchId: "",
  });
  const [Loading, setLoading] = useState(false);

  const AuthState = useSelector((state) => state.AuthState);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    if (!formData.name) {
      ErrorToast("Required fields are undefined!");
    } else {
      try {
        // console.log(AuthState.data);
        const response = await CreateArticleApi({
          ...formData,
          branch:
            AuthState.data.role === 2
              ? AuthState.data.branchId.branch_number
              : -1,
          branchId:
            AuthState.data.role === 2 ? AuthState.data.branchId._id : -1,
        });
        if (response.data.success) {
          SuccessToast(response.data.message);
          //   dispatch(fetchItems({ branch: 1 })); // Ensure you have a function to fetch customer data
          setOpenModal(false);
        } else {
          ErrorToast("Unable to add new article");
        }
      } catch (err) {
        ErrorToast(err.response.data.error.msg);
      }
    }
    setLoading(false);
  };

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      title={"Create Article"}
    >
      <div className="flex justify-center flex-col py-5 gap-y-4">
        <CustomInput
          id="article"
          Type="text"
          label="Article"
          placeholder="Enter Article name"
          Value={formData.name}
          setValue={(value) => handleChange("name", value)}
          required
        />
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Create Article
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateArticleModal;
