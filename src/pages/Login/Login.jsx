import React, { useState } from "react";
import SimpleInput from "../../components/Inputs/SimpleInput";
import ProcessLoader from "../../components/Loader/ProcessLoader";
import { useNavigate } from "react-router";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { LoginApi } from "../../Https";
import { useDispatch } from "react-redux";
import { SetAuth } from "../../store/Slices/AuthSlice";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await LoginApi({ email: Email, password: Password });
      if (response.data.success) {
        localStorage.setItem("token", response.data?.data?.payload?.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data.payload.user)
        );
        dispatch(SetAuth(response.data.data.payload.user));
        SuccessToast(response.data?.data?.msg);
        navigate("/home");
        window.location.reload();
      }
    } catch (err) {
      //   console.log(err.response.data.error.msg);
      ErrorToast(err.response?.data?.error?.msg || err.message);
    }
    setLoading(false);
  };
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="h-fit shadow-[rgba(60,64,67,0.3)_0px_1px_2px_0px,rgba(60,64,67,0.15)_0px_2px_6px_2px] flex justify-center items-center flex-col p-5 px-5 rounded-xl">
        <img src={"logo1.png"} className="w-[300px] h-[300px]" />
        <div className="font-bold text-3xl my-2 mb-5">Admin Sign In</div>

        <div className="flex flex-col items-center justify-center gap-y-2">
          <SimpleInput
            Type={"email"}
            label={"Email"}
            placeholder={"Email"}
            required={true}
            Value={Email}
            setValue={setEmail}
            readonly={false}
            disabled={false}
          />
          <SimpleInput
            Type={"password"}
            label={"Password"}
            placeholder={"Password"}
            required={true}
            Value={Password}
            setValue={setPassword}
            readonly={false}
            disabled={false}
          />

          <div className="w-full flex justify-center my-2 mb-4">
            {Loading ? (
              <ProcessLoader />
            ) : (
              <button
                onClick={handleSubmit}
                className="w-[90%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
