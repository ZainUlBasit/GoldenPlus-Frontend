import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";

const StyledDatePicker = styled(DatePicker)`
  .MuiInputBase-input {
    font-size: 1.2rem; /* Makes the date font size bigger */
    font-family: 800;
  }
`;

export default function BasicDatePicker({
  title,
  CurrentState,
  setCurrentState,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <StyledDatePicker
          label={title}
          value={CurrentState}
          onChange={(newValue) => setCurrentState(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
