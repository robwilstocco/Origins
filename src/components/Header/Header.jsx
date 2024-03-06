import React from "react";
import Logo from "/Origins_logo.png";
import LogoText from "/Origins_text.png";
export default () => {
  return (
    <nav className="bg-gray-800">
        <div className="mx-40 flex h-20">
          <div className="flex flex-1 items-center justify-center ">
            <div className="flex justify-center items-center">
              <img
                className="h-10 w-auto bg-white rounded-full mr-2"
                src={Logo}
                alt="Origins"
              />
              <img
                className="h-10 pt-1"
                src={LogoText}
                alt="Origins"
              />
            </div>
          </div>
        </div>
    </nav>
  );
};
