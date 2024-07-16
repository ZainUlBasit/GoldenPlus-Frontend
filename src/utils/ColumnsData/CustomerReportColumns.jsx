export const CustomerReportColumns = [
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
    id: "return_amount",
    title: "Return Amount",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "paid",
    title: "Recieved",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "remaining",
    title: "Recievable",
    format: (value) => value.toLocaleString("en-US"),
  },
];
