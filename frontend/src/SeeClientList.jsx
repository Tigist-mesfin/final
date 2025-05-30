import React, { useEffect, useState } from 'react';
import { Edit, Trash, Check, X } from 'lucide-react';

const SeeEmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); // 🟡 State for error messages

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/client/get_client');
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data.client || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleEdit = (employee) => {
        setEditId(employee.id);
        setEditedData({ ...employee });
        setErrorMessage(""); // 🟡 Clear previous error
    };

    const handleChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleSave = async (id) => {
        try {
            setErrorMessage(""); // 🟡 Clear previous error before sending request

            const response = await fetch(`http://127.0.0.1:5000/client/update_client/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedData),
            });

            const responseData= await response.json(); // 🟡 Get the response

            if (!response.ok) {
                if (response.status === 400) {
                    setErrorMessage(responseData.error); // Set error message from backend
                } else {
                    setErrorMessage("Failed to update client. Please try again.");
                }
                return;
            }

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
        setErrorMessage(""); // 🟡 Clear error when canceling
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this client?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/client/delete_client/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete client');
            }

            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    return (
        <div className="container mx-auto p-6   overflow-y-auto max-h-screen">
            <h1 className="text-2xl font-bold mb-4">Client List</h1>
           
        

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-Hex3">
                        <tr>
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Username</th>
                            <th className="py-2 px-4 border">Password</th>
                            <th className="py-2 px-4 border">Email</th>
                            <th className="py-2 px-4 border">Phone</th>
                            <th className="py-2 px-4 border">Address</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{employee.id}</td>

                                    <td className="py-2 px-4 border">
                                        {editId === employee.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editedData.username || ''}
                                                    onChange={(e) => handleChange(e, 'username')}
                                                    className="border p-1 w-full"
                                                />
                                                {errorMessage.includes("Username") && (
                                                    <p className="text-red-500 text-xs">{errorMessage}</p>
                                                )}
                                            </>
                                        ) : (
                                            employee.username
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {editId === employee.id ? (
                                            <>
                                                <input
                                                    type="password"
                                                    value={editedData.password || ''}
                                                    onChange={(e) => handleChange(e, 'password')}
                                                    className="border p-1 w-full"
                                                />
                                                {errorMessage.includes("password") && (
                                                    <p className="text-red-500 text-xs">{errorMessage}</p>
                                                )}
                                            </>
                                        ) : (
                                            employee.password
                                        )}
                                    </td>

                                    <td className="py-2 px-4 border">
                                        {editId === employee.id ? (
                                            <>
                                                <input
                                                    type="email"
                                                    value={editedData.email || ''}
                                                    onChange={(e) => handleChange(e, 'email')}
                                                    className="border p-1 w-full"
                                                />
                                                {errorMessage.includes("Email") && (
                                                    <p className="text-red-500 text-xs">{errorMessage}</p>
                                                )}
                                            </>
                                        ) : (
                                            employee.email
                                        )}
                                    </td>

                                    <td className="py-2 px-4 border">{editId === employee.id ? (
                                        <input
                                            type="text"
                                            value={editedData.phone || ''}
                                            onChange={(e) => handleChange(e, 'phone')}
                                            className="border p-1 w-full"
                                        />
                                    ) : (
                                        employee.phone
                                    )}</td>

                                    <td className="py-2 px-4 border">{editId === employee.id ? (
                                        <input
                                            type="text"
                                            value={editedData.address || ''}
                                            onChange={(e) => handleChange(e, 'address')}
                                            className="border p-1 w-full"
                                        />
                                    ) : (
                                        employee.address
                                    )}</td>

                                    <td className="py-2 px-4 border">
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
                                <td colSpan="6" className="text-center py-4">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeeEmployeeList;
