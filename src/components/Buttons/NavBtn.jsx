// import React, { useState, useEffect } from "react";

// const NavBtn = ({ title, onClick, Icon, Width, Type }) => {
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div
//       className={`text-white flex items-center justify-center cursor-pointer bg-[#464F51] border-2 border-[#464F51] pl-4 py-3 text-xl font-bold hover:rounded-lg hover:bg-[#464f51c7] hover:text-[white] transition-all ease-in-out duration-700 ${
//         Width && Width
//       } ${windowWidth < 500 && " w-fit px-3 pl-3 !justify-center"}`}
//       onClick={onClick}
//       title={title} // This will display the tooltip
//     >
//       <Icon
//         className={`text-xl ${
//           windowWidth < 500 ? "mr-0 flex justify-center items-center" : "mr-2"
//         }`}
//       />
//       {windowWidth > 500 ? (
//         <div className={windowWidth < 500 ? "hidden" : "flex"}>{title}</div>
//       ) : null}
//       {/* Hide title on small screens */}
//     </div>
//   );
// };

// export default NavBtn;

import React from "react";
import styled from "styled-components";

const NavBtn = ({ title, onClick, Icon }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>
        <div className="svg-wrapper-1">
          <div
            className="svg-wrapper group-hover:text-black"
            style={{ transform: "rotate(-15deg)", color: "white" }}
          >
            <Icon className="text-black svg-icon" id="svg-icon" />
          </div>
        </div>
        <span>{title}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    font-family: "Alegreya Sans SC", "sans-serif";
    /* font-size: 18px; */
    background: linear-gradient(to bottom, #000 0%, #333 100%);
    color: white;
    padding: 0.8em 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  }

  button:active {
    transform: scale(0.95);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  button span {
    display: block;
    margin-left: 0.4em;
    transition: all 0.3s;
  }

  button svg {
    width: 18px;
    height: 18px;
    color: white;
    transition: all 0.3s;
  }

  button .svg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    margin-right: 0.5em;
    transition: all 0.3s;
  }

  button:hover .svg-wrapper {
    background-color: white;
  }

  button:hover svg {
    transform: rotate(15deg);
    color: black !important;
  }

  @media (max-width: 500px) {
    button {
      font-size: 0.8rem;
      padding: 0.8em 1.5em 0.8em 1.2em;
    }
    button .svg-wrapper {
      width: 25px;
      height: 25px;
    }
    button svg {
      width: 13px;
      height: 13px;
    }
  }
`;

export default NavBtn;
