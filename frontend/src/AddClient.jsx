import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft,User, Mail, Lock, Phone, Home, Send } from "lucide-react";

const UserForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
   
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "Client",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors

  const usernameRegex = /^[a-zA-Z0-9]{4,10}$/;
  if (!usernameRegex.test(formData.username)) {
    setError("Username must be 4–10 characters and contain only letters and numbers.");
    return;
  }

  if (formData.password.length < 6 || formData.password.length > 8) {
    setError("Password must be between 6 and 8 characters.");
    return;
  }

  // Password complexity validation
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
    return;
  }
    try {
      const response = await fetch("http://127.0.0.1:5000/client/create_client", {
        method: "POST",
        
        headers: {
          "Content-Type": "application/json",
          
        },
  
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("User created successfully!");
        setFormData({
        
          username: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          role: "Client",
        });
      } else {
        alert(`Failed to create user: ${result.error || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      

      <h1 className="text-2xl font-bold pl-36 text-gray-800 mb-4">Client Form</h1>
         {error && <p className="text-red-700 text-center">{error}</p>}
      
      <form
        onSubmit={handleSubmit}
        className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16"
      >
        {/* Username */}
        <div>
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-style w-72"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-style w-72"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-style w-72"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-style w-72"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-style w-72"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="mt-3 w-40 bg-sky-800 text-white py-2 px-4 shadow-lg rounded-md  focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
