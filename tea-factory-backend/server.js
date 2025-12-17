const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();


const port =3001;
const host = 'localhost';
const mongoose = require('mongoose');
const router = require('./router');
const empRouter = require('./Emp/empRouter')
const suplierRoutes = require('./routes/addSupplierRoutes')
const memRouter = require('./Member/memRouter')
const contactRouter = require('./Contact/contactRouter')
const inquiryRouter = require('./Inquiry/inquiryRouter')
const leaveRouter = require('./routes/leave')
const settingRouter = require('./routes/setting')
const adminDashRouter = require('./routes/adminDashboard')
const attendanceRouter = require('./routes/attendance')
const customerRouter = require('./routes/customerRoute')
const emailRouter = require('./routes/emailRoutes')
const chatbotRoutes = require("./routes/chatbotRoutes");

const inventoryRoutes = require('./routes/inventory');
const supplierRoutes = require('./routes/suppliers');
const dashboardRoutes = require('./routes/dashboard');
const emailRoutes = require('./routes/email');
const notificationRoutes = require('./routes/notifications');
const reportRoutes = require('./routes/reports');
const warehouseRoutes = require('./routes/warehouses');
const purchaseOrderRoutes = require('./routes/purchaseOrders'); 
const ordersRoutess = require('./routes/orders');

const machineRouter= require("./routes/machineRoutes");
const maintenanceRouter = require("./routes/maintenanceRoutes");
const technicianRouter =require("./routes/technicianRoutes")
const assignRouter = require("./routes/assignRoutes");
const dashRouter = require("./routes/dash");

const deliveryRoutes =require( "./routes/deliveryRoutes");
const delEmailRoutes = require("./routes/emailDeliveryRoutes");
const delnotificationRoutes  = require("./routes/notificationRoutes");
const driverRoutes = require("./routes/driverRoutes");
const vehicleRoutes  = require("./routes/vehicleRoutes");
const routeRoutes = require("./routes/routeRoutes");

const pickupRoutes = require("./routes/pickupRoutes");
const auctionRoutes = require("./routes/auctionRoutes"); 
const invoiceRoutes = require("./routes/invoiceRoutes");
const bulkOrderRoutes = require("./routes/bulkOrderRoutes");
const saleCustomerRoutes = require("./routes/saleCustomerRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://buddhikaeranga54:9563@cluster1.cmszlan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

const connect = async () => {
    try{
        await mongoose.connect(uri);
        console.log('Connected to mongoDB');
    }
    catch(error){
        console.log('MongoDB Error: ',error);
    }
};

connect();

const server = app.listen(3001, '127.0.0.1', () => {
    console.log(`Node server is listening to ${server.address().port}`)
    // Start stock monitoring service
    stockMonitorService.startMonitoring();

});

// Import services
const stockMonitorService = require('./services/stockMonitorService');
dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes); 
app.use('/api/orders', ordersRoutess);

app.use("/Machine",machineRouter);
app.use("/Maintenance", maintenanceRouter);
app.use("/Technician", technicianRouter);
app.use("/Assign",assignRouter);
app.use("/Dash", dashRouter);

app.use("/api/deliveries", deliveryRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api", delEmailRoutes); // POST /api/email/send
app.use("/api", delnotificationRoutes); 

// Use order routes
app.use("/api/order", orderRoutes);

// ✅ Use pickup routes under /api/pickups
app.use("/api/pickups", pickupRoutes);

app.use("/api/auctions", auctionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/bulk-orders", bulkOrderRoutes);
app.use("/api/customers", saleCustomerRoutes);



// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Tea Factory API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('all', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

 
// Serve uploads directory (original behavior)
app.use(express.static('public/uploads'))
app.use('/uploads', express.static('public/uploads'));
app.use('/api', router);
app.use('/api/Emp', empRouter);
app.use('/api/Suplier',suplierRoutes);
app.use('/api/Member',memRouter);
app.use('/api/contact',contactRouter)
app.use('/api/inquiry',inquiryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting',settingRouter)
app.use('/api/dashboard',adminDashRouter)
app.use('/api/attendance',attendanceRouter)
app.use('/api/customer', customerRouter)
app.use('/api/email', emailRouter)
app.use('/api/chatbot', chatbotRoutes);