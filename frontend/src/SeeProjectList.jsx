import React, { useEffect, useState } from 'react';
import { Edit, Trash, Check, X } from 'lucide-react';

const SeeProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/project/get_projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                setProjects(data.projects || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleEdit = (project) => {
        setEditId(project.id);
        setEditedData({ ...project });
        setErrorMessage("");
    };

    const handleChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleSave = async (id) => {
        try {
            setErrorMessage("");

            const response = await fetch(`http://127.0.0.1:5000/project/update_project/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setErrorMessage(responseData.error || "Failed to update project.");
                return;
            }

            setProjects(projects.map(proj => (proj.id === id ? { ...proj, ...editedData } : proj)));
            setEditId(null);
        } catch (error) {
            setErrorMessage("An error occurred while updating. Please check your connection.");
            console.error('Error updating project:', error);
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setEditedData({});
        setErrorMessage("");
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this project?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/project/delete_project/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            setProjects(projects.filter(proj => proj.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className="container mx-auto  p-6 overflow-y-auto max-h-screen">
            <h1 className="text-2xl font-bold mb-4">Project List</h1>
            <div className=" w-full overflow-x-auto">
                <table className="min-w-[1200px] bg-white  border-gray-600 shadow-md rounded-lg">
                    <thead className="bg-Hex3">
                        <tr>
                            {['ID', 'Project Name', 'Description', 'Start Date', 'End Date', 'Status', 'Budget', 'Location','TypeOfBuilding','Area','N0 of floors','N0 of roof','Roof type', 'SiteC ID', 'Client ID', 'Actions'].map(header => (
                                <th key={header} className="py-2 px-4 border">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-300">
                                    {['id', 'p_name', 'description', 'start_date', 'end_date', 'status', 'budget', 'location','TypeOfBuilding','Area','NumberOfFloors','NumberOfRooms','RoofType', 'site_contractor_id', 'client_id'].map(field => (
                                        <td key={field} className="py-2 px-4 border">
                                            {editId === project.id ? 
                                                field === 'status' ? (
                                                    <select
                                                        value={editedData[field] || ''}
                                                        onChange={(e) => handleChange(e, field)}
                                                        className="border p-1 w-full"
                                                    >
                                                        
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="On hold">On hold</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                ) : (
                                                <input
                                                    type="text"
                                                    value={editedData[field] || ''}
                                                    onChange={(e) => handleChange(e, field)}
                                                    className="border p-1 w-full"
                                                />
                                            ) : (
                                                project[field] || 'N/A'
                                            )}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 border">
                                        <div className="flex space-x-2">
                                            {editId === project.id ? (
                                                <>
                                                    <button onClick={() => handleSave(project.id)} className="text-green-600 hover:text-green-800">
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-800">
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
                                <td colSpan="11" className="text-center py-4">No projects found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeeProjectList;
