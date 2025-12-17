import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SupplierSidebar from "./SupplierSidebar";
import { useAuth } from "../contex/AuthContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const { isAdmin, isSupplier } = useAuth();

  return (
    <div className={`layout-wrapper ${isSupplier() ? "supplier-layout" : "admin-layout"}`}>
      <Header />

      <div className="main-content">
        {/* Sidebar inside the layout-wrapper */}
        <Sidebar />
        {isSupplier() && <SupplierSidebar />}

        <main className="content">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;
