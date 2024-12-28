import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ItemLedgerBottomTable({ Data }) {
  console.log(Data.items);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead style={{ borderBottomWidth: 2, borderColor: "#465462" }}>
          <TableRow sx={{ backgroundColor: "#111827" }}>
            {[
              { id: "article_name", title: "Article Name" },
              { id: "article_size", title: "Size" },
              { id: "qty", title: "Quantity" },
              { id: "price", title: "Price" },
              { id: "amount", title: "Amount" },
            ].map((dt) => {
              return (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Quicksand",
                    fontSize: "13px",
                  }}
                >
                  <div className="text-[14px] pt-[20px] pb-[0px] text-center whitespace-nowrap text-white select-none font-poppins">
                    {dt.title}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Data.items.map((row) => (
            <TableRow
              // key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {[
                { id: "article_name", title: "Article Name" },
                { id: "article_size", title: "Size" },
                { id: "qty", title: "Quantity" },
                { id: "price", title: "Price" },
                { id: "amount", title: "Amount" },
              ].map(({ id }) => {
                const value = row[id];
                return (
                  <TableCell
                    sx={{
                      fontWeight: 400,
                      fontFamily: "Quicksand",
                      borderBottomWidth: 0,
                    }}
                    align="center"
                  >
                    <div className="maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2.2rem] text-[1rem] text-center font-poppins">
                      {id === "price" || id === "amount"
                        ? new Intl.NumberFormat("en-PK", {
                            style: "currency",
                            currency: "PKR",
                          }).format(value)
                        : typeof value === "number"
                        ? value.toLocaleString()
                        : value || "not specified"}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
