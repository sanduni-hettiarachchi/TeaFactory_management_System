import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EmpDashboard from './pages/EmpDashboard';
import PrivateRoutes from './utills/PrivateRoutes';
import RoleBaseRoutes from './utills/RoleBaseRoutes';
import AdminSummary from './Dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import Mainpage from './fontend/Mainpage';
import OurStorypage from './fontend/OurStorypage';
import OurOfferingpage from './fontend/OurOfferingpage';
import NewsPage from './fontend/NewsPage';
import ContactUspage from './fontend/Contactuspage';
import AddDepartments from './components/department/AddDepartments';
import EditDepartment from './components/department/EditDepartment';
import EmpList from './components/employee/EmpList';
import EmpAdd from './components/employee/EmpAdd';
import Blacktea from './fontend/Blacktea';
import GreenTea from './fontend/Greentea';
import FlavoredBlends from './fontend/Fleverdblends';
import Organictea from './fontend/Organictea';
import Herbal from './fontend/Herbal';
import LoosePack from './fontend/LoosePack';
import JoinUs from './fontend/JoinUs';
import View from './components/employee/View';
import Edit from './components/employee/Edit';
import SalaryAdd from './components/Salary/SalaryAdd';
import SalaryView from './components/Salary/SalaryView';
import Supplier from './fontend/Supplier';
import JoinOurTeam from './fontend/JoinOurTeam';

// Inventory
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import InventoryFlow from "./pages/InventoryFlow";
import Reorders from "./pages/Reorders";
import MonthlyReport from "./pages/MonthlyReport";
import Notifications from "./pages/Notifications";
import Suppliers from "./pages/Suppliers";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierManagement from "./pages/SupplierManagement";
import PurchaseOrders from "./pages/PurchaseOrders";
import Warehouses from "./pages/Warehouses";
import TeaVarieties from "./pages/TeaVarieties";
import SupplierPortalDashboard from "./pages/SupplierPortalDashboard";
import SupplierLogin from "./pages/SupplierLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupplierRegister from "./pages/SupplierRegister";
import { AuthProvider, useAuth } from "./contex/AuthContext";

//Maintenance
import Home from './components/Home/Home';
import MachinesList from './components/Machines/MachinesList';
import AddMachines from './components/Machines/AddMachines';
import EditMachine from './components/EditMachine';
import List from './components/Maintenance/List';
import Add from './components/Maintenance/Add';
import Edits from './components/Maintenance/Edit';
import AddT from './components/Maintenance/AddT';
import ListT from './components/Technician/ListT';
import NewTech from './components/Technician/NewTech';
import EditT from './components/Technician/EditT';
import AssignList from './components/Assign/AssignList';
import Lay from './components/Layout'

import MakeDelivery from "./deliveries/MakeDelivery";
import DeliveryList from "./deliveries/DeliveryList";
import DeliveryEdit from "./deliveries/DeliveryEdit";
import DeliveryDashboard from "./deliveries/DeliveryDashboard";
import DriversPage from "./deliveries/DriversPageValidated";
import NotificationsPage from "./deliveries/NotificationsPageEnhanced";
import ProfilePage from "./deliveries/ProfilePageEnhanced";
import Layout from "./components/LayoutComp";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch } from "./utils/api";

// Layout
import AdminLayout from "./layout/AdminLayout";
import CustomerLayout from "./layout/CustomerLayout";

// Orders
import OrdersList from "./components/Orders/OrdersList";
import OrderForm from "./components/Orders/OrderForm";
import OrderDetails from "./components/Orders/OrderDetails";

// Pickups
import PickupsList from "./components/Pickups/PickupsList";
import PickupForm from "./components/Pickups/PickupForm";

// Auctions
import AuctionsList from "./components/Auctions/AuctionList";
import AuctionForm from "./components/Auctions/AuctionForm";

// Invoices
import InvoicesList from "./components/Invoices/InvoicesList";
import InvoiceForm from "./components/Invoices/InvoiceForm";

// Accessories
import Accessories from "./components/Accessories/Accessories";

// Admin Sales
import Sales from "./components/Admin/Sales";
import AdminBulkOrders from "./components/Admin/BulkOrders";

// Customer customer
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerAuctions from "./pages/customer/CustomerAuctions";
import ProductSpecificationsInfo from "./pages/customer/ProductSpecificationsInfo";
import BulkOrders from "./pages/customer/BulkOrders";
import CustomerLogin from "./pages/customer/Login";
import SalesOverview from "./pages/customer/SalesOverview";

import EmpSummary from './EmployeeDashboard/EmpSummary';
import LeaveList from './EmployeeDashboard/leave/LeaveList';
import AddLeave from './EmployeeDashboard/leave/AddLeave';
import Setting from './EmployeeDashboard/Setting';
import LeaveTable from './EmployeeDashboard/leave/LeaveTable';
import LeaveDetail from './EmployeeDashboard/leave/LeaveDetail';
import Attendence from './components/attendence/Attendence';
import AttendenceReport from './components/attendence/AttendenceReport';
import SupplierList from './components/supplier/SupplierList';
import CustomerList from './components/customer/CustomerList';
import ChatbotWidget from './fontend/ChatbotWidget';
import AssignInfo from './components/Assign/AssignInfo';
import Techpdf from './components/Technician/Techpdf';


// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { currentUser, isAdmin, isSupplier } = useAuth();
  
  if (!currentUser) {
    // Not logged in
    return <Navigate to={requiredRole === 'supplier' ? '/supplier-login' : '/imanagerlogin'} />;
  }
  
  // Check if user has required role
  if (requiredRole === 'inventoryAdmin' && !isAdmin()) {
    return <Navigate to="/supplier-portal" />;
  }
  
  if (requiredRole === 'supplier' && !isSupplier()) {
    return <Navigate to="/sp" />;
  }
  
  return element;
};

function AppRoutes() {
  const { isAdmin, isSupplier } = useAuth();
  
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/imanagerlogin" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/supplier-login" element={<SupplierLogin />} />
        <Route path="/supplier-register" element={<SupplierRegister />} />
        
        {/* Choose homepage based on role */}
        <Route 
          path="/sp" 
          element={
            isSupplier() ? <Navigate to="/supplier-portal" /> : 
            isAdmin() ? <Lay><Dashboard /></Lay> : 
            <Navigate to="/imanagerlogin" />
          } 
        />
        
        {/* Admin Routes */}
        <Route element={<Lay />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory-list" element={<InventoryList />} />
          <Route path="/inventory-flow" element={<InventoryFlow />}  />
          <Route path="/reorders" element={<Reorders />}  />
          <Route path="/monthly-report" element={<MonthlyReport />}  />
          <Route path="/notifications"  element={<Notifications />}/>
          
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/dashboard" element={<SupplierDashboard />} />
          <Route path="/suppliers/manage" element={<SupplierManagement />}/>
          <Route path="/suppliers/orders" element={<PurchaseOrders />} />
          
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/tea-varieties" element={<TeaVarieties />} />
        </Route>
        
        {/* Supplier Routes */}
        <Route path="/supplier-portal" element={<ProtectedRoute element={<SupplierPortalDashboard />} requiredRole="supplier" />} />
      </Routes>
  );
}

function App() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/api/order");
      // Accept multiple possible response shapes
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (data && data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        const msg = (data && (data.error || data.message)) || "Failed to fetch orders";
        console.error("Failed to fetch orders:", msg, data);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.message || "Network error while fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const isCustomerAuthed = !!localStorage.getItem("customerEmail");

  return (
    <AuthProvider>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnHover />
      <Routes>
        {/* Redirect root and legacy paths */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartments />} />
          <Route path="department/:id" element={<EditDepartment />} />
          <Route path="employees" element={<EmpList />} />
          <Route path="add-employee" element={<EmpAdd />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="salary" element={<SalaryAdd />} />
          <Route path="/admin-dashboard/attendence" element={<Attendence />} />
          <Route path="/admin-dashboard/attendence-report" element={<AttendenceReport />} />
          <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />} />
          <Route path="employees/salary/:id" element={<SalaryView />} />
          <Route path="/admin-dashboard/leaves" element={<LeaveTable />} />
          <Route path="/admin-dashboard/leaves/:id" element={<LeaveDetail />}/>
          <Route path="/admin-dashboard/supplier" element={<SupplierList />}/>
          <Route path="/admin-dashboard/customer" element={<CustomerList />}/>
          
        </Route>

        {/* Employee Dashboard */}
        <Route 
          path="/emp-dashboard" 
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmpDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          } >
            <Route index element={<EmpSummary/>}></Route>
            <Route path="/emp-dashboard/profile/:id" element={<View />}></Route>
            <Route path="/emp-dashboard/leaves/:id" element={<LeaveList />}></Route>
            <Route path="/emp-dashboard/add-leave" element={<AddLeave />}></Route>
            <Route path="/emp-dashboard/salary/:id" element={<SalaryView />}></Route>
            <Route path="/emp-dashboard/setting" element={<Setting />}></Route>
            
        </Route>

        {/* Admin area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Sales />} />
          <Route path="orders" element={<OrdersList orders={orders} refreshOrders={fetchOrders} />} />
          <Route path="orders/new" element={<OrderForm refreshOrders={fetchOrders} />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="pickups" element={<PickupsList orders={orders} />} />
          <Route path="pickups/new" element={<PickupForm orders={orders} />} />
          <Route path="auctions" element={<AuctionsList />} />
          <Route path="auctions/new" element={<AuctionForm />} />
          <Route path="invoices" element={<InvoicesList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="sales" element={<Sales />} />
          <Route path="bulk-orders" element={<AdminBulkOrders />} />
        </Route>


        {/* ---------------------- CUSTOMER AREA ---------------------- */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route
          path="/customer"
          element={
            isCustomerAuthed ? (
              <CustomerLayout />
            ) : (
              <Navigate to="/customer/login" replace />
            )
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="auctions" element={<CustomerAuctions />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="specifications" element={<ProductSpecificationsInfo />} />
          <Route path="bulk" element={<BulkOrders />} />
          <Route path="sales" element={<SalesOverview />} />
          {/* Customer Orders */}
          <Route
            path="orders/new"
            element={
              <OrderForm refreshOrders={fetchOrders} productsFilter="tea" />
            }
          />
          <Route
            path="orders/new/accessories"
            element={
              <OrderForm
                refreshOrders={fetchOrders}
                productsFilter="accessories"
              />
            }
          />
        </Route>

        {/* Frontend Pages */}
        <Route path="/home" element={<Mainpage />} />
        <Route path="/ourStory" element={<OurStorypage />} />
        <Route path="/ourOfferings" element={<OurOfferingpage />} />
        <Route path="/NewsPage" element={<NewsPage />} />
        <Route path="/ContactUspage" element={<ContactUspage />} />
        <Route path="/blacktea" element={<Blacktea />} />
        <Route path="/greentea" element={<GreenTea />} />
        <Route path="/flevored" element={<FlavoredBlends />} />
        <Route path="/organictea" element={<Organictea />} />
        <Route path="/herbal" element={<Herbal />} />
        <Route path="/loose" element={<LoosePack />} />
        <Route path="/join" element={<JoinUs />} />
        <Route path="/suplier" element={<Supplier />} />
        <Route path="/joinOurTeam" element={<JoinOurTeam />} />

        {/* Maintenance */}
          <Route path="/MainDashboard" element={<Home />}/>
          <Route path="/MainDashboard/machines" element={<MachinesList />} />
          <Route path="/MainDashboard/add-machine" element={<AddMachines />} />
          <Route path="/MainDashboard/machines/:id" element={<EditMachine />} />
          <Route path="/MainDashboard/maintenance" element={<List />} />
          <Route path="/MainDashboard/add-maintenance" element={<Add />} />
          <Route path="/MainDashboard/maintenance/:id" element={<Edits />} />
          <Route path="/MainDashboard/add-technician" element={<AddT />} />
          <Route path="/MainDashboard/technician" element={<ListT />} />
          <Route path="/MainDashboard/new-technician" element={<NewTech />} />
          <Route path="/MainDashboard/technician/:id" element={<EditT />} />
          <Route path="/MainDashboard/technician/assign/:id" element={<Techpdf />} />
          <Route path="/MainDashboard/assign" element={<AssignList />} />
          <Route path="/MainDashboard/assign-info/:id" element={<AssignInfo/>}/>
       
        
        {/* Deliveries */}
        <Route element={<Layout />}>
          <Route path="/DelList" element={<DeliveryList />} />
          <Route path="/Delidashboard" element={<DeliveryDashboard />} />
          <Route path="/make-delivery" element={<MakeDelivery />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/notify" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/deliveries/edit/:id" element={<DeliveryEdit />} />
        </Route> 

        {/* ✅ Inventory (moved here via AppRoutes) */}
        <Route path="/*" element={<AppRoutes />} />

        {/* Catch-all */}
       
      </Routes>
      <ChatbotWidget/>
      
    </BrowserRouter>
  </AuthProvider>
    
  );
}

export default App;
