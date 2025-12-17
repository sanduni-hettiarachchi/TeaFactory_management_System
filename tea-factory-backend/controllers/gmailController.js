const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Supplier = require("../model/Suplier"); // adjust path to your supplier model
const { PassThrough } = require("stream");

// ✅ Send Supplier Email with Registered Suppliers PDF
const sendSupplierEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    // ✅ Fetch only registered suppliers
    const registeredSuppliers = await Supplier.find({ status: "Registered" });

    if (!registeredSuppliers.length) {
      return res
        .status(400)
        .json({ success: false, msg: "No registered suppliers found" });
    }

    // ✅ Generate PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      let pdfData = Buffer.concat(buffers);

      // ✅ Setup Nodemailer Transporter
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.HR_MANAGER_EMAIL,
          pass: process.env.HR_MANAGER_PASS,
        },
      });

      // ✅ Send Email
      let mailOptions = {
        from: '"Ranaya Tea Factory" salemanager516@gmail.com',
        to: email,
        subject: subject || "Registered Suppliers Report",
        text: message,
        attachments: [
          {
            filename: "RegisteredSuppliers.pdf",
            content: pdfData,
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, msg: "Email sent successfully!" });
      } catch (err) {
        console.error("Email sending error:", err);
        res.status(500).json({ success: false, msg: "Failed to send email" });
      }
    });

    // ✅ Add PDF content
    doc.fontSize(18).text("Registered Suppliers Report", { align: "center" });
    doc.moveDown();

    registeredSuppliers.forEach((supplier, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${supplier.name} - ${supplier.email} - ${supplier.vehicleType} (${supplier.vehicleNumber})`
      );
    });

    doc.end();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

exports.sendSupplierEmail = sendSupplierEmail
