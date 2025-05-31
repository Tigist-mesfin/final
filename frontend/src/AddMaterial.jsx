import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const UserForm = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: '',
        cost: '',
        p_id:'',
        site_cont_id:  localStorage.getItem("userId") || "",
      
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
            const response = await fetch('http://127.0.0.1:5000/material/create_material', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Material created successfully!');
                setFormData({
                    name: '',
                    quantity: '',
                    unit: '',
                    cost: '',
                    p_id:'',
                    site_cont_id:'',
                });
            } else {
                alert('Failed to create material. Please try again.');
            }
        } catch (error) {
            console.error('Error creating material:', error);
            alert('An error occurred. Please try again.');
        }
    };



     useEffect(() => {
                const userId = localStorage.getItem("userId");
                if (!userId) return;
    
                const fetchProjects = async () => {
                    try {
                    const response = await fetch(`http://127.0.0.1:5000/api/get_projects_by_site_contr/${userId}`
                    );
                    const data = await response.json();
                    setProjects(data);
                    } catch (error) {
                    console.error("Error fetching projects:", error);
                    }
                };
    
                fetchProjects();
                }, []);


    return (
        <div>
          
            
            <h1 className="text-2xl font-bold pl-36 text-gray-800 mb-4">Material Form</h1>
            
            <form onSubmit={handleSubmit} className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16"
            > <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-style w-72" />
                </div>
             
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-style w-72" required />
                </div>
              
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="input-style w-72" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                    <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="input-style w-72" rows="3" required />
                </div>
             
                <div>
                    <label className="block text-sm font-medium text-gray-700">p_id</label>
               <select
                name="p_id"
                value={formData.p_id}
                onChange={handleChange}
                className="input-style w-72"
                required
                >
                <option value="">Select Project</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                    {project.name} (ID: {project.id})
                    </option>
                ))}
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