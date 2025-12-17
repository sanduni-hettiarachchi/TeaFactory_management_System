import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/api";

function OrderForm({ order, onClose, onSaved, refreshOrders, productsFilter }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [prefilledProduct, setPrefilledProduct] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    contactNumber: "",
    product: "",
    items: 1,
    productSpecifications: "",
    deliveryInstructions: "",
  });
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState(0);

  const PRODUCT_PRICES = {
    "Organic Tea": 10000,
    "Premium Black Tea": 5000,
    "Herbal Mix Tea": 4000,
    "Loose Leaf Tea": 3000,
    "Flavoured Tea": 2000,
    "Ceylon Black Tea": 1800,
    "Green Tea": 1500,
    "Mint Green Tea": 1200,
    "Chamomile Tea": 1000,
    "Cinnamon Black Tea": 1000,
  };

  const ACCESSORY_PRICES = {
    "Tea Pots": 8000,
    "Tea Warmer": 15000,
    "Tea Cups": 12000,
    "Tea Infusers": 3000,
    "Tea Holder": 8000,
    "Ecobam – Inspired Bamboo Mixer": 2000,
    "Tea Strainer": 3000,
    "Milk & Sugar Sets": 6000,
    "Tea Assortments": 20000,
    "Tea Assortments (20 pack)": 20000,
  };

  const ALL_PRODUCTS = [...new Set([...Object.keys(PRODUCT_PRICES), ...Object.keys(ACCESSORY_PRICES)])];
  const TEA_PRODUCTS = Object.keys(PRODUCT_PRICES);
  const ACCESSORY_PRODUCTS = Object.keys(ACCESSORY_PRICES);
  const VISIBLE_PRODUCTS =
    productsFilter === "tea"
      ? TEA_PRODUCTS
      : productsFilter === "accessories"
      ? ACCESSORY_PRODUCTS
      : ALL_PRODUCTS;

  const computePrice = (productName, itemsCount = Number(formData.items || 1)) => {
    if (ACCESSORY_PRICES[productName] !== undefined) {
      return ACCESSORY_PRICES[productName] * (itemsCount || 1);
    }
    return (PRODUCT_PRICES[productName] || 0) * (itemsCount || 1);
  };

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || "",
        customerEmail: order.customerEmail || "",
        contactNumber: order.contactNumber || "",
        product: order.product || "",
        items: Number(order.items || 1),
        productSpecifications: order.productSpecs || "",
        deliveryInstructions: order.deliveryInstructions || "",
      });
      setPrice(computePrice(order.product || "", Number(order.items || 1)));
    }
  }, [order]);

  useEffect(() => {
    if (!order) {
      const params = new URLSearchParams(location.search);
      const productFromQuery = params.get("product");
      if (productFromQuery) {
        setPrefilledProduct(true);
        setFormData((prev) => ({ ...prev, product: productFromQuery }));
        setPrice(computePrice(productFromQuery, Number(formData.items || 1)));
      }
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: name === "items" ? Number(value) : value };
    setFormData(next);

    if (name === "product" || name === "items") {
      const pName = name === "product" ? value : next.product;
      const itemsCount = Number(name === "items" ? value : next.items) || 1;
      setPrice(computePrice(pName, itemsCount));
    }
  };

  const clamp = (n, min = 1, max = 100) => Math.max(min, Math.min(max, n));
  const incrementItems = () => handleChange({ target: { name: "items", value: clamp(Number(formData.items) + 1) } });
  const decrementItems = () => handleChange({ target: { name: "items", value: clamp(Number(formData.items) - 1) } });

  const handleCancel = () => {
    if (typeof onClose === "function") return onClose();
    if (location.pathname.startsWith("/customer")) {
      navigate(productsFilter === "accessories" ? "/customer/accessories" : "/customer/dashboard");
    } else if (location.pathname.startsWith("/admin")) {
      navigate("/admin/orders");
    } else navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) return toast.error("Valid email is required");
    if (!formData.contactNumber.trim()) return toast.error("Contact number is required");
    if (!formData.deliveryInstructions.trim()) return toast.error("Delivery instructions are required");

    try {
      setSaving(true);
      const path = order ? `/api/order/${order._id}` : `/api/order`;
      const method = order ? "PUT" : "POST";

      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        contactNumber: formData.contactNumber.trim(),
        product: formData.product.trim(),
        quantity: 1,
        items: Number(formData.items) || 1,
        productSpecs: formData.productSpecifications.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim(),
        price: Number(price) || 0,
      };

      const data = await apiFetch(path, { method, body: payload });
      if (data?.success) {
        toast.success("Order saved successfully");
        onSaved?.(data.order);
        refreshOrders?.();
        onClose?.();
      } else toast.error(data?.error || "Failed to save order");
    } catch (err) {
      toast.error(err.message || "Error saving order");
    } finally {
      setSaving(false);
    }
  };

  const isAccessory = ACCESSORY_PRICES[formData.product] !== undefined;
  const bannerText = productsFilter === "accessories" ? "Accessories Order" : productsFilter === "tea" ? "Tea Order" : "Order";
  const bannerClass = productsFilter === "accessories" ? "bg-yellow-100 text-yellow-800" : productsFilter === "tea" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  return (
    <div className="container mx-auto mt-4 p-6 border rounded-lg bg-gray-50">
      <div className={`p-2 mb-4 rounded font-semibold ${bannerClass}`}>{bannerText}</div>
      <h3 className="text-green-700 text-xl font-semibold mb-4">{order ? "Edit Order" : "Add New Order"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="customerEmail"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.customerEmail}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />

        <div>
          {prefilledProduct ? (
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" value={formData.product} readOnly />
          ) : (
            <select
              name="product"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.product}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Product</option>
              {VISIBLE_PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center space-x-2 max-w-xs">
          <button type="button" className="px-3 py-1 border rounded text-gray-700" onClick={decrementItems} disabled={saving || formData.items <= 1}>−</button>
          <input
            type="number"
            name="items"
            className="text-center border border-gray-300 rounded w-16"
            min={1}
            max={100}
            value={formData.items}
            onChange={handleChange}
            required
          />
          <button type="button" className="px-3 py-1 border rounded text-gray-700" onClick={incrementItems} disabled={saving || formData.items >= 100}>+</button>
        </div>

        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value={`LKR ${price.toLocaleString()}`}
          readOnly
        />

        {!isAccessory && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium">Product Specification</label>
              <a href="/customer/specifications" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">What's this?</a>
            </div>
            <select
              name="productSpecifications"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.productSpecifications}
              onChange={handleChange}
            >
              <option value="">Select specification (optional)</option>
              <option value="OP (Orange Pekoe)">OP (Orange Pekoe)</option>
              <option value="FOP (Flowery Orange Pekoe)">FOP (Flowery Orange Pekoe)</option>
              <option value="GFOP / TGFOP">GFOP / TGFOP</option>
              <option value="BOP (Broken Orange Pekoe)">BOP (Broken Orange Pekoe)</option>
              <option value="BOPF (Broken Orange Pekoe Fannings)">BOPF (Broken Orange Pekoe Fannings)</option>
            </select>
          </div>
        )}

        <textarea
          name="deliveryInstructions"
          placeholder={isAccessory ? "Address" : "Delivery Instructions"}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.deliveryInstructions}
          onChange={handleChange}
          required
        ></textarea>

        <div className="flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={saving}>
            {saving ? "Saving..." : "Save Order"}
          </button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;
