import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./styles/AOTop.css";
import { MdEditSquare, MdDelete, MdPrint } from "react-icons/md"; // Import all icons used in the code
import { Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteModal from "../Modals/DeleteModal";
import { DeleteInvoiceApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";

export default function CashLedgerTopTable({ Data }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [OpenModal, setOpenModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead
          style={{
            borderWidth: 0,
            // borderBottomWidth: 0,
            // borderColor: "#465462",
            backgroundColor: "green",
            height: "7vh",
          }}
        >
          <TableRow sx={{ borderWidth: 0 }}>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontFamily: "Quicksand",
                padding: 1,
                fontSize: "13px",
              }}
            >
              <div className="font-[700] text-[13.9px] text-white whitespace-nowrap font-poppins">
                <div className="maxWeb1:text-[1.1rem] maxWeb2:text-[1.3rem] maxWeb3:text-[1.5rem] maxWeb4:text-[1.5em] text-[.9rem] text-center">
                  <span className="font-bold">Invoice No:</span>
                  <span className="font-[400] ml-1">
                    {Data?.invoice_no || "not specified"}
                  </span>
                </div>
              </div>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                fontFamily: "Quicksand",
                padding: 1,
                fontSize: "13px",
              }}
            >
              <div className="font-[700] text-[13.9px] text-white whitespace-nowrap font-poppins">
                <div className="maxWeb1:text-[1.1rem] maxWeb2:text-[1.3rem] maxWeb3:text-[1.5rem] maxWeb4:text-[1.5em] text-[.9rem] text-center">
                  <span className="font-bold">Date:</span>
                  <span className="font-[400] ml-1">
                    {new Date(Data?.date * 1000).toLocaleDateString() ||
                      "not specified"}
                  </span>
                </div>
              </div>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                fontFamily: "Quicksand",
                padding: 1,
                fontSize: "13px",
              }}
            >
              <div className="font-[700] text-[13.9px] text-white whitespace-nowrap font-poppins">
                <div className="maxWeb1:text-[1.1rem] maxWeb2:text-[1.3rem] maxWeb3:text-[1.5rem] maxWeb4:text-[1.5em] text-[.9rem] text-center">
                  <span className="font-bold">Amount:</span>
                  <span className="font-[400] ml-1">
                    {Data?.amount || "not specified"}
                  </span>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
}
