import React, { useEffect } from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/header/Hero";
import RecentBuy from "../components/home/RecentBuy";
import Limiteds from "../components/home/Limiteds";
import { FiltersProvider } from "../context/FiltersContext";

const Home = () => {
  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20  lg:pb-0 min-h-screen bg-main pt-16">
          <Hero />
          <RecentBuy />
          <Limiteds />
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default Home;
