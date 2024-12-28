import React, { useEffect, useState } from "react";
import { SetAuth, SetAuthNotFound } from "./store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import PageLoader from "./components/Loader/PageLoader";
import DataLoader from "./components/Loaders/DataLoader";

const LoadingWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [Loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(SetAuth(user));
    } else {
      dispatch(SetAuthNotFound());
    }
    setInterval(() => {
      setLoading(false);
    }, 4000);
  }, []);
  return Loading ? (
    <div className="flex justify-center items-center h-screen w-screen">
      <DataLoader />
    </div>
  ) : (
    <div className="fade-in">{children}</div>
  );
};

export default LoadingWrapper;
