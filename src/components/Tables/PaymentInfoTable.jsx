import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomPagination from "./TablePagination";
import { PaymentInfoColumns } from "../../utils/ColumnsData/PaymentInfoColumns";
// import { PaymentInfoColumns } from "@/assets/Columns/PaymentInfoColumns";

export default function PaymentInfoTable({ Rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // Adjust the number of rows per page as needed

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead style={{ borderBottomWidth: 2, borderColor: "#465462" }}>
            <TableRow>
              {PaymentInfoColumns.map((vc, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    paddingBottom: "5px",
                    fontSize: "14px",
                  }}
                  align="center"
                >
                  <div className="text-[14px] pt-[20px] pb-[5px] maxWeb1:pt-[45px] maxWeb1:pb-[6px] maxWeb1:text-[23px] maxWeb2:text-[28px] maxWeb3:text-[34px] maxWeb4:text-[38px] maxWeb2:pt-[70px] maxWeb3:pt-[90px] maxWeb4:pt-[90px] maxWeb2:pb-[12px] maxWeb3:pb-[18px] maxWeb4:pb-[25px]">
                    {vc.title}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Rows.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            ).map((row, i) => (
              <TableRow
                key={row.id || i} // Ensure each row has a unique and stable key
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{
                    fontWeight: 400,
                    borderBottomWidth: 0,
                  }}
                  align="center"
                >
                  <div className="maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center">
                    {row.name}
                  </div>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 400,
                    borderBottomWidth: 0,
                  }}
                  align="center"
                >
                  <div className="maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center">
                    {row.total}
                  </div>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 400,
                    borderBottomWidth: 0,
                  }}
                  align="center"
                >
                  <div className="maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center">
                    {row.paid}
                  </div>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 400,
                    borderBottomWidth: 0,
                  }}
                  align="center"
                >
                  <div className="maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center">
                    {row.remaining}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination
        count={Rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        RowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
