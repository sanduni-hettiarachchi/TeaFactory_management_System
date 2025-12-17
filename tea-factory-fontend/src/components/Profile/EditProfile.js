import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    profilePhoto: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users/profile");
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/api/users/profile", form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
      <input type="text" name="profilePhoto" value={form.profilePhoto} onChange={handleChange} placeholder="Profile Photo URL" />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;