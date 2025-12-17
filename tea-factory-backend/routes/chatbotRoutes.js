// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in .env
});

// Very small rule-based responder for common Tea Factory queries
function getRuleBasedReply(raw) {
  if (!raw) return null;
  const msg = String(raw).toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey)\b/.test(msg) || /(good\s*(morning|afternoon|evening))/.test(msg)) {
    return "Hello! I’m the Tea Factory assistant. Ask me about products, bulk orders, pricing, certifications, tours, careers, or how to contact us.";
  }

  // Products and varieties
  if (/(products?|varieties?|black|green|herbal|organic|flavo?red|blend|loose|bulk)/.test(msg)) {
    return "We produce a range of teas: Black, Green, Herbal, Flavored blends, and Organic options. We supply in loose/bulk packs and retail SKUs. Tell me what variety and quantity you need and I can guide you to pricing/quotes.";
  }

  // Opening hours
  if (/(hours|open|opening|time|when are you open)/.test(msg)) {
    return "Our office hours are Mon–Fri, 8:30 AM – 5:30 PM (local time). Factory operations may run extended shifts depending on production.";
  }

  // Location / address
  if (/(address|where|location|visit|map)/.test(msg)) {
    return "We’re located at: 123 Tea Estate Road, Kandy, Sri Lanka. Visitors by appointment only. Please contact us to arrange a factory tour.";
  }

  // Contact
  if (/(contact|email|phone|call)/.test(msg)) {
    return "You can reach us at sales@teafactory.example or +94 11 234 5678. Share your requirement (variety, grade, quantity, destination) for a quick quote.";
  }

  // Order status / tracking
  if (/(order|track|status)/.test(msg)) {
    return "To check an order status, please provide your order ID and the email used for the purchase. Our team will respond promptly.";
  }

  // Suppliers / procurement
  if (/(supplier|supply|vendor|procure|procurement)/.test(msg)) {
    return "For supplier partnerships (leaves/packaging/logistics), email procurement@teafactory.example with your company profile and certifications.";
  }

  // Careers
  if (/(career|job|hiring|join our team|vacanc(y|ies))/i.test(raw)) {
    return "We’re often hiring across production, QA, and logistics. Please send your CV to careers@teafactory.example with the subject ‘Application’.";
  }

  // Export / shipping
  if (/(export|ship|shipping|container|incoterms|freight)/.test(msg)) {
    return "We export globally. We support common INCOTERMS and can work with your forwarder or ours. Share destination, volume, and timeline for a quote.";
  }

  // Pricing / quotes
  if (/(price|pricing|quote|quotation|wholesale|bulk)/.test(msg)) {
    return "Pricing depends on variety/grade, volume, and destination. Please share: tea variety, grade, monthly volume, packaging, and destination port for a formal quote.";
  }

  // Quality / certifications
  if (/(quality|qc|iso|haccp|certified|certificate|organic|fair\s*trade)/.test(msg)) {
    return "We follow strict QC and hold relevant certifications (e.g., HACCP/ISO as applicable). Certificates can be shared on request with your RFQ.";
  }

  // Factory tours
  if (/(tour|visit|facility tour)/.test(msg)) {
    return "Factory tours are available by prior appointment for partners and groups. Please email tours@teafactory.example with preferred dates and group size.";
  }

  // Returns / complaints
  if (/(return|refund|complaint|issue|problem|defect)/.test(msg)) {
    return "We’re sorry for the inconvenience. Please share your order ID, product, batch/lot number, and photos if applicable to qa@teafactory.example for resolution.";
  }

  // General help
  if (/(help|support|assist|guide)/.test(msg)) {
    return "I can help with product info, quotes, certifications, shipments, tours, careers, and contact details. What would you like to know?";
  }

  return null; // unknown
}

// Chat endpoint
router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Message required" });
    }

    // First try rule-based responses
    const ruleReply = getRuleBasedReply(message);
    if (ruleReply) {
      return res.json({ success: true, reply: ruleReply });
    }

    // If API key is not configured, return a helpful fallback instead of 500
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        reply: "I couldn’t match that to our FAQs. Please ask about products, bulk pricing, certifications, shipping, tours, careers, or contact details.",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful Tea Factory assistant. Answer politely and clearly." },
        { role: "user", content: message },
      ],
    });

    const reply = response?.choices?.[0]?.message?.content || "I'm here to help!";
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    // Return graceful fallback instead of 500 to avoid front-end error popups
    return res.json({ success: true, reply: "Sorry, I couldn't process that right now. Please try again later." });
  }
});

module.exports = router;
