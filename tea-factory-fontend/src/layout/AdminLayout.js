// src/layouts/AdminLayout.jsx
import React from "react";
import TopNav from "../components/ui/TopNav";
import Sidebar from "../components/ui/SideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main
          className="ml-[250px] flex-1 flex justify-center items-start bg-gray-50 min-h-screen p-8"
        >
          <div className="w-full max-w-6xl">
            {/* This is where pages like AuctionsList will render */}
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
