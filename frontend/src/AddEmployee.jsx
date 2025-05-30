import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BadgeCheck, Mail, Lock, Phone, Home, DollarSign, Briefcase, Send } from 'lucide-react';

const UserForm = () => {
    const navigate = useNavigate();
      const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        salary: '',
        role: ''
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
const nameRegex = /^[a-zA-Z 0-9]{4,20}$/;
  if (!nameRegex.test(formData.name)) {
    setError("Name must be 4–20 characters and contain only letters .");
    return;
  }
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
            const response = await fetch('http://127.0.0.1:5000/site_contractor/create_contractor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                alert('User created successfully!');
                setFormData({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    salary: '',
                    role: ''
                });
            } else {
                alert(`Failed to create user: ${result.error || "Please try again."}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            
            
            <h1 className="text-2xl font-bold pl-36 text-gray-800 mb-4">Employee Form</h1>
            {error && <p className="text-red-700 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16">

        {/* Name */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Name
            </label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-style w-72" required />
        </div>

        {/* Username */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <User className="h-4 w-4" />
            Username
            </label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-style w-72" required />
        </div>

        {/* Email */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-style w-72" required />
        </div>

        {/* Password */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
            </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-style w-72" required />
        </div>

        {/* Phone */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
            </label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-style w-72" required />
        </div>

        {/* Address */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <Home className="h-4 w-4" />
            Address
            </label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-style w-72" rows="3" required />
        </div>

        {/* Salary */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Salary
            </label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} step="0.01" className="input-style w-72" required />
        </div>

        {/* Role */}
        <div>
            <label className="block text-sm font-medium text-gray-700  items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Role
            </label>
            <select name="role" value={formData.role} onChange={handleChange} className="input-style w-72" required>
            <option value="">Select type of employee </option>
            <option value="Site Contractor">Site Contractor</option>
            <option value="Engineer">Engineer</option>
            <option value="Architecture">Architecture</option>
            </select>
        </div>

        {/* Submit Button */}
        <div>
            <button
            type="submit"
            className="mt-3 w-40 bg-sky-800 text-white py-2 px-4 shadow-lg rounded-md hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
            
            Submit
            </button>
        </div>
        </form>
        </div>
    );
};

export default UserForm;