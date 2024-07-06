import React, { useState, useEffect } from "react";

const NavBtn = ({ title, onClick, Icon, Width, Type }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`text-white flex items-center justify-center cursor-pointer bg-[#464F51] border-2 border-[#464F51] pl-4 py-3 text-xl font-bold hover:rounded-lg hover:bg-[#464f51c7] hover:text-[white] transition-all ease-in-out duration-700 ${
        Width && Width
      } ${windowWidth < 500 && " w-fit px-3 pl-3 !justify-center"}`}
      onClick={onClick}
      title={title} // This will display the tooltip
    >
      <Icon
        className={`text-xl ${
          windowWidth < 500 ? "mr-0 flex justify-center items-center" : "mr-2"
        }`}
      />
      {windowWidth > 500 ? (
        <div className={windowWidth < 500 ? "hidden" : "flex"}>{title}</div>
      ) : null}
      {/* Hide title on small screens */}
    </div>
  );
};

export default NavBtn;
