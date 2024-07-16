import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Popover, Switch, Typography } from "@mui/material";
import CustomPagination from "../TablePagination/TablePagination";
import { BsEye, BsEyeFill } from "react-icons/bs";
import moment from "moment";

export default function TableComp({
  setOpenEditModal,
  setOpenDeleteModal,
  setSelected,
  CurrentData,
  Columns,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [OpenModal, setOpenModal] = useState(false);
  const [CurrentIndex, setCurrentIndex] = useState("");
  const modalRef = useRef(null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModal(false);
        setCurrentIndex("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead style={{ borderBottomWidth: 2, borderColor: "#465462" }}>
            <TableRow>
              {Columns.map((dt, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Quicksand",
                  }}
                  align="center"
                >
                  <div className="text-[14px] pt-[20px] pb-[5px] maxWeb1:pt-[45px] maxWeb1:pb-[6px] maxWeb1:text-[23px] maxWeb2:text-[28px] maxWeb3:text-[34px] maxWeb4:text-[38px] maxWeb2:pt-[70px] maxWeb3:pt-[90px] maxWeb4:pt-[90px] maxWeb2:pb-[12px] maxWeb3:pb-[18px] maxWeb4:pb-[25px] whitespace-nowrap">
                    {dt.title}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {CurrentData.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            ).map((Data, index) => (
              <TableRow
                key={Data._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Columns.map((column, i) =>
                  column.id === "actions" ? (
                    <TableCell
                      sx={{
                        fontWeight: 400,
                        fontFamily: "Quicksand",
                        borderBlockWidth: 0,
                      }}
                      component="th"
                      scope="row"
                      align="center"
                    >
                      <div className="flex justify-center items-center gap-x-2">
                        <BiEdit
                          className="text-[1.2rem] maxWeb1:text-[2rem] maxWeb2:text-[2.5rem] maxWeb3:text-[3rem] maxWeb4:text-[3rem] cursor-pointer hover:text-[green] transition-all duration-500"
                          onClick={() => {
                            setSelected(Data);
                            setOpenEditModal(true);
                          }}
                        />
                        <RiDeleteBin5Line
                          className="text-[1.2rem] maxWeb1:text-[2rem] maxWeb2:text-[2.5rem] maxWeb3:text-[3rem] maxWeb4:text-[3rem] cursor-pointer hover:text-[red] transition-all duration-500"
                          onClick={() => {
                            setSelected(Data);
                            setOpenDeleteModal(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: 400,
                        fontFamily: "Quicksand",
                        borderBottomWidth: 0,
                      }}
                      align="center"
                    >
                      <div
                        className={`maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center`}
                      >
                        {column.format &&
                        typeof Data[column.id] === "number" &&
                        column.id !== "date"
                          ? column.format(Data[column.id])
                          : column.id === "date"
                          ? moment(new Date(Data[column.id] * 1000)).format(
                              "DD/MM/YY"
                            )
                          : Data[column.id]}
                      </div>
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination
        count={CurrentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        RowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
