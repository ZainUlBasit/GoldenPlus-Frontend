// By Default
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "0px solid #fff !important",
  borderRadius: 2,
  outline: "none",
  overflow: "hidden",
  height: "auto",
};

export default function ModalWrapper({ open, setOpen, children, title }) {
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="flex flex-col p-4 px-6 !text-[#000]">
              <div className="flex w-full justify-center items-center font-bold text-3xl border-b-[3px] border-b-[#000] py-4 pb-6">
                {title}
              </div>
              {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
