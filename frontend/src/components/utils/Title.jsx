import React from "react";

const Title = ({ title }) => {
  return (
    <div className=" py-5 w-full flex items-center gap-3">
      <h1 className=" text-text text-2xl text-nowrap leading-none font-extrabold">
        {title}
      </h1>
      <div className=" border-t border-subMain border-dashed mt-2 w-full"></div>
    </div>
  );
};

export default Title;
