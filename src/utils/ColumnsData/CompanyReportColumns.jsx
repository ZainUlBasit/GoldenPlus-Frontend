export const CompanyReportColumns = [
  {
    id: "name",
    title: "Name",
  },
  {
    id: "total",
    title: "Total",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "paid",
    title: "Paid",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "remaining",
    title: "Payable",
    format: (value) => value.toLocaleString("en-US"),
  },
];
