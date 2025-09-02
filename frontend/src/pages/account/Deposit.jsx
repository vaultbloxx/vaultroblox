import React from "react";
import Layout from "../../components/layout/Layout";
import TransSidebar from "../../components/layout/TransSidebar";
import DepositTable from "../../components/account/DepositTable";
import { useQuery } from "@tanstack/react-query";
import { FiltersProvider } from "../../context/FiltersContext";

const Deposit = () => {
  const { data: deposits, isLoading: depositsLoading } = useQuery({
    queryKey: ["deposits"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/rumman/v1/user/deposit-transactions");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unknown error occurred");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  return (
    <FiltersProvider>
      <Layout>
        <div className="pb-20 lg:pb-0 bg-main min-h-screen text-dryGray pt-10 md:pt-16">
          <div className=" container mx-auto px-2">
            <h1 className=" py-3 pt-10 text-2xl font-bold uppercase tracking-wide ">
              Transactions
            </h1>
            <div className=" md:grid grid-cols-12 gap-12 pt-2">
              <div className=" col-span-3 relative">
                <TransSidebar />
              </div>
              <div className=" col-span-9 mt-3 md:mt-0">
                <DepositTable items={deposits} loading={depositsLoading} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </FiltersProvider>
  );
};

export default Deposit;
