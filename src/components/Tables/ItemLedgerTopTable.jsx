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

export default function ItemLedgerTopTable({ Data }) {
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
            backgroundColor: "#000",
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
                  <span className="font-bold">Customer Name:</span>
                  <span className="font-[400] ml-1">
                    {Data?.customerId?.name || "not specified"}
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
              <div className="font-[700] text-[13.9px] text-white bg-[#000] whitespace-nowrap font-poppins">
                <div className="maxWeb1:text-[1.1rem] maxWeb2:text-[1.3rem] maxWeb3:text-[1.5rem] maxWeb4:text-[1.5em] text-[.9rem] text-center">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-[400] ml-1">
                    {new Intl.NumberFormat("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    }).format(Data?.total_amount) || "not specified"}
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
              <div className="font-[700] text-[13.9px] text-black whitespace-nowrap font-poppins">
                <div
                  className="w-fit px-[6px] py-[6px] text-center bg-white rounded-xl cursor-pointer hover:bg-[#333] hover:text-white border-[2px] border-white transition-all ease-in-out duration-500"
                  onClick={handleClick}
                >
                  <MdEditSquare className="text-xl" />
                </div>
              </div>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    // borderRadius: "25px", // Add rounded corners
                    backgroundColor: "white", // Set background color to white
                    width: "120px", // Set the width as needed
                    overflow: "hidden", // Hide overflowing content
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Typography
                  sx={{
                    // p: 2,
                    // paddingY: 1,
                    // paddingX: 1,
                    borderColor: "#333",
                    backgroundColor: "aliceblue",
                    width: "120px",
                    overflow: "hidden",
                    // borderRadius: "25px",
                    overflowY: "auto", // Ensure vertical scroll if needed
                    maxHeight: "50vh", // Set height to 60vh
                  }}
                >
                  <div className="bg-[aliceblue] text-white font-[Quicksand] flex flex-col justify-center items-center ">
                    <div className="w-full flex flex-col justify-between  items-start ">
                      {[
                        {
                          name: "Edit",
                          icon: <MdEditSquare className="text-xl" />,
                        },
                        {
                          name: "Delete",
                          icon: <MdDelete className="text-xl" />,
                        },
                        {
                          name: "Print",
                          icon: <MdPrint className="text-xl" />,
                        },
                      ].map((dt) => (
                        <div
                          key={dt.name}
                          className={`flex gap-x-3 items-center cursor-pointer hover:bg-gray-300 w-full px-2 py-1 font-poppins ${
                            dt.name === "Delete"
                              ? "text-[red]"
                              : dt.name === "Edit"
                              ? "text-[green]"
                              : "text-black"
                          }`}
                          onClick={() => {
                            if (dt.name === "Delete") {
                              setOpenModal(true);
                            } else if (dt.name === "Edit") {
                              navigate(
                                "/customer/edit-ledger-item/" + Data._id
                              );
                            }
                            handleClose();
                          }}
                        >
                          {dt.icon}
                          <span>{dt.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Typography>
              </Popover>
              {OpenModal && (
                <DeleteModal
                  Open={OpenModal}
                  setOpen={setOpenModal}
                  onSubmit={async () => {
                    setLoading(true);
                    try {
                      const payloadData = {
                        customerId: Data.customerId._id,
                        invoice_no: Data.invoice_no,
                      };
                      const response = await DeleteInvoiceApi(payloadData);
                      if (response.data.success) {
                        SuccessToast(response.data.data.msg);
                        setOpenModal(false);
                        // dispatch(
                        //   fetchPaymentById({
                        //     user_Id: CurrentCustomer,
                        //     startDate: fromDate,
                        //     endDate: toDate,
                        //     branch: 1,
                        //   })
                        // );
                      }
                    } catch (err) {
                      console.log(err);
                    }
                    setLoading(false);
                  }}
                  Loading={Loading}
                />
              )}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
}
