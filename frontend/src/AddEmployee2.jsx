import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Home, DollarSign, Hash, Building2, Briefcase } from 'lucide-react';

const UserForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        salary: '',
        p_id:'',
        site_cont_id:'',
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

        try {
            const response = await fetch('http://127.0.0.1:5000/employee/create_employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('User created successfully!');
                setFormData({
                    full_name: '',
                    email: '',
                    phone: '',
                    address: '',
                    salary: '',
                    p_id:'',
                    site_cont_id:'',
                    role: ''
                });
            } else {
                alert('Failed to create user. Please try again.');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
          
            
            <h1 className="text-2xl font-bold pl-36 text-gray-800 mb-4">Employee Form</h1>
            
                        <form onSubmit={handleSubmit} className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16">
            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
                </label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input-style w-72" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-style w-72" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
                </label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-style w-72" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Home className="h-4 w-4" />
                Address
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-style w-72" rows="3" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary
                </label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} step="0.01" className="input-style w-72" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Hash className="h-4 w-4" />
                p_id
                </label>
                <input type="number" name="p_id" value={formData.p_id} onChange={handleChange} step="0.01" className="input-style w-72" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Building2 className="h-4 w-4" />
                site_cont_id
                </label>
                <input type="number" name="site_cont_id" value={formData.site_cont_id} onChange={handleChange} step="0.01" className="input-style w-72" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700  items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Role
                </label>
                <select name="role" value={formData.role} onChange={handleChange} className="input-style w-72" required>
                <option value="">select type of Laborer</option>
                <option value="Plumbers">Plumbers</option>
                <option value="Carpenters">Carpenters</option>
                <option value="Electrician">Electrician</option>
                <option value="Roofer">Roofer</option>
                <option value="Painter">Painter</option>
                <option value="Masons">Masons</option>
                <option value="Construction Labourer">Construction Labourer</option>
                </select>
            </div>

            <div>
                <button type="submit" className="mt-3 w-40 bg-sky-800 text-white py-2 px-4 shadow-lg rounded-md hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Submit
                </button>
            </div>
            </form>

        </div>
    );
};

export default UserForm;