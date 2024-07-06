import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CashPaymentNav from "../../components/Navigations/CashPaymentNav";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import ProcessLoader from "../../components/Loader/ProcessLoader";
import TableWrapper from "../../components/Tables/TableWrapper";
import Search from "../../components/SearchBox/Search";
import PaymentInfoTable from "../../components/Tables/PaymentInfoTable";

const CashPaymentInfo = () => {
  const [userType, setUserType] = useState("company"); // "company" or "customer"
  const [SearchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const CustomerState = useSelector((state) => state.CustomerState); // Ensure you have a slice to fetch users (companies and customers)
  const CompanyState = useSelector((state) => state.CompanyState); // Ensure you have a slice to fetch users (companies and customers)
  const AuthState = useSelector((state) => state.AuthState);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
    dispatch(
      fetchCompanies({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, []);

  const userData =
    userType === "company"
      ? CompanyState.data
      : userType === "customer" && CustomerState.data;

  const filteredData =
    SearchText === ""
      ? userData
      : userData.filter((item) =>
          item.name.toLowerCase().includes(SearchText.toLowerCase())
        );

  useEffect(() => {
    setSearchText("");
  }, [userType]);
  return (
    <div className="relative">
      <Navbar />
      <CashPaymentNav />
      <div className="w-full flex justify-center items-center">
        <div className="w-[90%] flex justify-center items-center bg-[#EFE7EC] rounded-[40px] font-[700] text-[1.5rem] mt-5 mb-8">
          <div
            className={`w-[50%] flex justify-center items-center rounded-[40px] ${
              userType === "company"
                ? "bg-[#000] text-white"
                : "bg-[#EFE7EC] text-[#000]"
            } py-3 transition-all ease-in-out duration-700 cursor-pointer max767:py-2`}
            onClick={() => setUserType("company")}
          >
            Company
          </div>
          <div
            className={`w-[50%] flex justify-center items-center rounded-[40px] ${
              userType === "customer"
                ? "bg-[#000] text-white"
                : "bg-[#EFE7EC] text-[#000]"
            } py-3 transition-all ease-in-out duration-700 cursor-pointer max767:py-2`}
            onClick={() => setUserType("customer")}
          >
            Customer
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center fade-in">
        {CustomerState.loading || CompanyState.loading ? (
          <ProcessLoader />
        ) : (
          <TableWrapper>
            <Search
              Placeholder={
                userType === "company"
                  ? "Search Company..."
                  : userType === "customer" && "Search Customer..."
              }
              Value={SearchText}
              setValue={setSearchText}
            />
            <PaymentInfoTable Rows={filteredData} />
          </TableWrapper>
        )}
      </div>
    </div>
  );
};

export default CashPaymentInfo;
