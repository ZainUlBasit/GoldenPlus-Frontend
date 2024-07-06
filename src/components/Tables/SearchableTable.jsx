import React, { useState } from "react";
import Search from "../SearchBox/Search";
import TableComp from "./TableComp";
import TableWrapper from "./TableWrapper";

const SearchableTable = ({
  setOpenDeleteModal,
  setOpenEditModal,
  setSelected,
  CurrentData,
  Columns,
  SearchPlaceholder,
  SearchText,
  setSearchText,
}) => {
  return (
    <TableWrapper>
      <Search
        Placeholder={SearchPlaceholder}
        Value={SearchText}
        setValue={setSearchText}
      />
      <TableComp
        setOpenEditModal={setOpenEditModal}
        setOpenDeleteModal={setOpenDeleteModal}
        setSelected={setSelected}
        CurrentData={CurrentData}
        Columns={Columns}
      />
    </TableWrapper>
  );
};

export default SearchableTable;
