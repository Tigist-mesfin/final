import React, { useEffect, useState } from 'react';
import { Edit, Trash, Check, X } from 'lucide-react';

const SeeEmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
  

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;


                const response = await fetch( ` http://127.0.0.1:5000/material/get_material/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data.materials || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleEdit = (employee) => {
        setEditId(employee.id);
        setEditedData({ ...employee });
     
    };

    const handleChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleSave = async (id) => {
        // Clear previous errors before new request

        try {
             

            const response = await fetch(`http://127.0.0.1:5000/material/update_material/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    setErrorMessage(responseData.error); // Set error message from backend
                } else {
                    setErrorMessage("Failed to update employee. Please try again.");
                }
                return;
            }

            // Update local state if successful
            setEmployees(employees.map(emp => (emp.id === id ? { ...emp, ...editedData } : emp)));
            setEditId(null);
        } catch (error) {
            setErrorMessage("An error occurred while updating. Please check your connection.");
            console.error('Error updating employee:', error);
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setEditedData({});
        setErrorMessage(""); // Clear error on cancel
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this material?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/material/delete_material/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete material');
            }

            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 overflow-y-auto max-h-screen">
            <h1 className="text-2xl font-bold mb-4">Employee List</h1>
            
         

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-Hex3">
                        <tr>
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Quantity</th>
                            <th className="py-2 px-4 border">Unit</th>
                            <th className="py-2 px-4 border">Cost</th>
                            <th className="py-2 px-4 border">P_id</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    {employees.length > 0 ? (
        employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{employee.id}</td>

                {/* Name */}
                <td className="py-1 px-1 border">
                    {editId === employee.id ? (
                        <input
                            type="text"
                            value={editedData.name || ''}
                            onChange={(e) => handleChange(e, 'name')}
                            className="border p-1 w-full"
                        />
                    ) : (
                        employee.name
                    )}
                </td>

                {/* Email */}
                <td className="py-1 px-1 border">
                    {editId === employee.id ? (
                        
                        <input
                            type="email"
                            value={editedData.quantity || ''}
                            onChange={(e) => handleChange(e, 'quantity')}
                            className="border p-1 w-full"
                        />
                       
                    ) : (
                        employee.quantity
                    )}
                </td>

                {/* Phone */}
                <td className="py-1 px-1 border">
                    {editId === employee.id ? (
                        <input
                            type="text"
                            value={editedData.unit || ''}
                            onChange={(e) => handleChange(e, 'unit')}
                            className="border p-1 w-full"
                        />
                    ) : (
                        employee.unit
                    )}
                </td>

                {/* Address */}
                <td className="py-1 px-1 border">
                    {editId === employee.id ? (
                        <input
                            type="text"
                            value={editedData.cost || ''}
                            onChange={(e) => handleChange(e, 'cost')}
                            className="border p-1 w-full"
                        />
                    ) : (
                        employee.cost
                    )}
                </td>


                  {/* p_id */}
                  <td className="py-1 px-1 border">
                    {editId === employee.id ? (
                        <input
                            type="number"
                            value={editedData.p_id || ''}
                            onChange={(e) => handleChange(e, 'p_id')}
                            className="border p-1 w-full"
                        />
                    ) : (
                        employee.p_id
                    )}
                </td>


            

                {/* Actions */}
                <td className="py-1 px-1 border">
                    <div className="flex space-x-2">
                        {editId === employee.id ? (
                            <>
                                <button onClick={() => handleSave(employee.id)} className="text-green-600 hover:text-green-800">
                                    <Check className="w-5 h-5" />
                                </button>
                                <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-800">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-800">
                                    <Trash className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="9" className="text-center py-4">No material found</td>
        </tr>
    )}
</tbody>
                </table>
            </div>
        </div>
    );
};

export default SeeEmployeeList;
