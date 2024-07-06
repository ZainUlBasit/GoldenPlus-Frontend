// By Default
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "auto",
  bgcolor: "#fff",
  boxShadow: 24,
  border: "0px solid #fff !important",
  borderRadius: 8,
  outline: "none",
};

export default function DeleteModal({ Open, setOpen, onSubmit, Loading }) {
  const handleClose = () => setOpen(false);
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
            <div className="bg-[#fff] text-[#000] p-8 w-[670px] max767:w-[100%] flex flex-col justify-center items-center font-[Quicksand] rounded-[25px] overflow-hidden">
              <div className="text-center text-[1.8rem] max767:text-[1.2rem] font-[700] mb-8 mt-3">
                Are you sure want to Delete ?
              </div>
              <div className="bg-[#90898E] h-[2px] w-[95%]" />
              <div className="flex flex-col w-full justify-center items-center my-10">
                <button
                  className={`mt-[20px] w-[297px] h-fit py-2 bg-[#000] hover:bg-[#394B93] border-[2px] border-[#000] hover:border-[#394B93] rounded-[40px] text-white text-[1.2rem] font-[700] transition-all duration-500 ease-in-out`}
                  onClick={onSubmit}
                >
                  {Loading ? "Deleting..." : "Yes , Delete"}
                </button>
                <button
                  className={`mt-[20px] w-[297px] h-fit py-2 bg-[#fff] rounded-[40px] text-black text-[1.2rem] font-[700] transition-all duration-500 ease-in-out`}
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
