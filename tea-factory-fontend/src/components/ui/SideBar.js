import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingCart,
  MdLocalShipping,
  MdGavel,
  MdReceiptLong,
  MdPeople,
} from "react-icons/md";

import "./SideBar.css"

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Portal</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdShoppingCart className="me-2" /> Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/pickups"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdLocalShipping className="me-2" /> Pickups
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/auctions"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdGavel className="me-2" /> Auctions
          </NavLink>
        </li>

        {/* ✅ Added Bulk Orders route */}
        <li>
          <NavLink
            to="/admin/bulk-orders"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdLocalShipping className="me-2" /> Bulk Orders
          </NavLink>
        </li>

        {/* ✅ Added Sales route separately */}
        <li>
          <NavLink
            to="/admin/sales"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdDashboard className="me-2" /> Sales
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/invoices"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdReceiptLong className="me-2" /> Invoices
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <MdPeople className="me-2" /> Customer
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
