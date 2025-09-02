import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNavbar from "./BottomNavbar";
import { useQuery } from "@tanstack/react-query";

const Layout = ({ children }) => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  return (
    <div className=" bg-main">
      <Navbar authUser={authUser} />
      {children}
      <BottomNavbar authUser={authUser} />
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
