import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import { useState } from "react";
import { useNavigate } from "react-router";
import { SetAuthNotFound } from "../../store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { SuccessToast } from "../../utils/ShowToast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "auto",
  bgcolor: "#808080",
  boxShadow: 24,
  border: "0px solid #fff !important",
  borderRadius: 8,
  outline: "none",
};

export default function Logout({ Open, setOpen }) {
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={Open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={Open}>
          <Box sx={style}>
            <div className="bg-[#808080] text-white p-8 w-[670px] max767:w-[100%] flex flex-col justify-center items-center font-[Quicksand] rounded-[25px] overflow-hidden">
              <div className="text-center text-black text-[1.8rem] max767:text-[1.2rem] font-[700] mb-8 mt-3">
                Are you sure want to log out ?
              </div>
              <div className="bg-[#90898E] h-[2px] w-[95%]" />
              <div className="flex flex-col w-full justify-center items-center my-10">
                <button
                  className={`mt-[20px] w-[297px] h-fit py-2 bg-[#000] text-white hover:bg-gray-600 border-[2px] border-black hover:border-gray-600 rounded-[40px] text-[1.2rem] font-[700] transition-all duration-500 ease-in-out`}
                  onClick={() => {
                    setLoading(true);
                    setInterval(() => {
                      // Clear localStorage
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");

                      SuccessToast("Logout successfully!");
                      dispatch(SetAuthNotFound());
                      // Navigate to login or home page
                      window.location.reload();
                      setOpen(false);
                    }, 3000);
                  }}
                >
                  {Loading ? "Loading..." : "Yes , Logout"}
                </button>
                <button
                  className={`mt-[20px] w-[297px] h-fit py-2 bg-[red] text-[#fff] hover:text-white border-2 border-[red] rounded-[40px] hover:bg-red-500 text-[1.2rem] font-[700] transition-all duration-500 ease-in-out`}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
