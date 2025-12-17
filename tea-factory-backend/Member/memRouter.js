const express = require("express");
const memRouter = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const Member = require("../model/Member");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Employee = require("../model/Emplyee")


// ✅ Multer Storage for PDF
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"));
  },
});

//Route to add a member
memRouter.post("/add", upload.single("pdf"), async (req, res) => {
  try {
    const { name, email, contact, subject, description } = req.body;

    // Basic validation
    if (!name || !email || !contact || !subject || !description) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    if (!/^0\d{9}$/.test(contact)) {
      return res.status(400).json({ success: false, error: "Contact must start with 0 and be exactly 10 digits." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "PDF file is required." });
    }

    const pdfUrl = req.file.path; // Store file path or URL

    const newMember = new Member({
      name,
      email,
      contact,
      subject,
      description,
      pdfUrl,
    });

    await newMember.save();

    res.json({ success: true, message: "Supplier ticket created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});


memRouter.get("/unregistered", async(req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json({ success: true, members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch unregistered employees" });
  }
})

memRouter.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, error: "Member not found" });

    res.json({ success: true, message: "Unregistered employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

memRouter.post("/send", upload.single("pdfFile"), async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    //Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HR_MANAGER_EMAIL, 
        pass: process.env.HR_MANAGER_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      attachments: [],
    };

    // If file uploaded
    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        path: path.join(__dirname, "../public/uploads", req.file.filename),
      });
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

memRouter.get("/generate-pdf", async (req, res) => {
  try {
    const employees = await Employee.find().populate("department userId");

    const doc = new PDFDocument();
    const filePath = `public/uploads/employees_${Date.now()}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("Registered Employees Report", { align: "center" });
    doc.moveDown();

    employees.forEach((emp, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${emp.userId?.name || "-"} | ${emp.department?.dep_name || "-"} | DOB: ${emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}`
      );
    });

    doc.end();

    writeStream.on("finish", () => {
      res.json({
        success: true,
        pdfUrl: filePath.replace(/^public[\\/]/, "").replace(/\\/g, "/"), // return relative path
      });
    });
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate PDF" });
  }
});


module.exports = memRouter;
