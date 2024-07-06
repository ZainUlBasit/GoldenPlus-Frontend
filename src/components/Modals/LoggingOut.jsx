// By Default
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetAuthNotFound } from "../../store/Slices/AuthSlice";
import { useState } from "react";
import PageLoader from "../Loader/PageLoader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "auto",
  bgcolor: "transparent",
  //   boxShadow: 24,
  border: "0px solid #fff !important",
  borderRadius: 8,
  outline: "none",
};

export default function LoggingOut({ Open, setOpen }) {
  const Auth = useSelector((state) => state.auth.auth);
  const navigate = useNavigate();

  const LogginOut = () => {
    // navigate("/auth");
    // window.location.reload();
    alert("yes");
  };
  React.useEffect(() => {
    setInterval(() => {
      LogginOut();
    }, 3000);
  }, []);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={Open}
        // onClose={handleClose}
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
            <PageLoader />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
