// src/components/ui/CustomerSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdGavel,
  MdLocalMall,
  MdLocalShipping,
  MdShowChart,
} from "react-icons/md";
import "./SideBar.css"

export default function CustomerSidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Customer Portal</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdDashboard className="me-2" /> Customer's Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/customer/auctions"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdGavel className="me-2" /> Customer Auctions
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/customer/accessories"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdLocalMall className="me-2" /> Tea Accessories
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/customer/sales"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdShowChart className="me-2" /> Sales Overview
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/customer/bulk"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdLocalShipping className="me-2" /> Bulk Orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
