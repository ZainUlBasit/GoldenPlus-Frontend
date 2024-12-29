import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (data, fileName) => {
  console.log(data);

  const updatedData = data.map((dt) => {
    const actualDate = new Date(dt.date * 1000).toISOString().split("T")[0]; // Get actual date in YYYY-MM-DD format
    return { ...dt, date: actualDate };
  });
  console.log(updatedData);

  const worksheet = XLSX.utils.json_to_sheet(updatedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
