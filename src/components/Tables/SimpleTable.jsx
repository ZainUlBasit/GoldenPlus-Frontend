import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import styled from "styled-components";
import moment from "moment";

const TableWrapper = styled.div`
  /* Tailwind="flex justify-center flex-col"> */
  margin-top: 1px;
  transition: all 0.5s ease-in-out;
  display: flex;
  justify-content: center;
  flex-direction: column;
  // margin: 0px 120px;
  width: 100%;
  padding: ${(props) =>
    props.isAct ? "0px 20px 0px 140px" : "0px 20px 0px 20px"};
`;

const BannerHeader = styled.h1.attrs({
  className:
    "relative bg-[#000] py-[20px] text-xl flex items-center rounded-t-lg pl-10 text-white justify-center font-[Roboto] font-[700] text-[1.4rem] select-none",
})`
  & {
    font-size: ${(props) => (props.fontSize ? props.fontSize : "1.4rem")};
    padding: ${(props) => (props.padding ? props.padding : "8px 0px")};
  }
`;

export default function SimpleTable({ rows, columns, title }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const HandleDoubleClick = (e) => {
    // if (e.detail === 2) {
    //   setSelID(e.target.id);
    // console.log(e.target.name);
    //   if (title === "ITEM INFO") setEditItemModal(true);
    //   if (title === "COMPANIES INFO") setEditCompanyModal(true);
    // }
  };
  return rows.length == 0 ? (
    // <LoadingError />
    <div></div>
  ) : (
    <TableWrapper isAct={false} width="80px">
      <BannerHeader padding="20px 0px">{title.toUpperCase()}</BannerHeader>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          className="border-[2px] border-[#000] border-t-white"
          sx={{ maxHeight: 550, borderRadius: "0px 0px 10px 10px" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    className="select-none"
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#000",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length &&
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        style={{ cursor: "pointer" }}
                      >
                        {columns.map(({ id }, key) => {
                          const value = row[id];
                          return (
                            <TableCell
                              // id={c_id}
                              onClick={HandleDoubleClick}
                              className={"font-[Roboto] select-none"}
                              // key={column.id}
                              // align={column.align}
                              style={{ fontWeight: "700", fontSize: "0.95rem" }}
                            >
                              {id === "date"
                                ? moment(new Date(value * 1000)).format(
                                    "DD/MM/YY"
                                  )
                                : value || "N/A"}
                              {/* {column.format && typeof value === "number" */}
                              {/* ? column.format(value) */}
                              {/* : value} */}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </TableWrapper>
  );
}
