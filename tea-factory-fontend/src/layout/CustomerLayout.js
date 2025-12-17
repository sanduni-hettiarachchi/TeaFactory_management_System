import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "../components/ui/TopNav";
import CustomerSidebar from "../components/ui/CustomerSidebar";

export default function CustomerLayout() {
  const location = useLocation();
  const accessoriesPage = location.pathname.startsWith("/customer/accessories");

  return (
    <>
      {/* Top Navigation */}
      <TopNav />

      <div className="flex">
        {/* Sidebar */}
        <CustomerSidebar />

        {/* Main Content */}
        <main
          className={`ml-[250px] flex-1 flex justify-center items-start min-h-screen p-8 ${
            accessoriesPage ? "bg-transparent shadow-none" : "bg-gray-50"
          }`}
        >
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
