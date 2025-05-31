
import React, { useEffect, useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { FolderKanban, FileText, CalendarClock, CalendarCheck, LoaderCircle, DollarSign, MapPin, UserCog, User, Send } from 'lucide-react';



const ProjectForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [contractors, setContractors] = useState([]);
    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({
        p_name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: '',
        budget: '',
        location: '',
        site_contractor_id: '',
        client_id: ''
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
  if (!nameRegex.test(formData.p_name)) {
    setError(" Project Name must be 4–20 characters and contain only letters and numbers .");
    return;
  }

        try {
            const response = await fetch('http://127.0.0.1:5000/project/create_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Project submitted successfully!');
                setFormData({
                    p_name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: '',
                    budget: '',
                    location: '',
                    site_contractor_id: '',
                    client_id: ''
                });
            } else {
                alert('Failed to submit project. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('An error occurred. Please try again.');
        }
    };


useEffect(() => {
        const fetchData = async () => {
            try {
                // Update these URLs to match your backend routes
                const contractorRes = await fetch('http://127.0.0.1:5000/site_contractors');
                const contractorData = await contractorRes.json();
                setContractors(contractorData);

                const clientRes = await fetch('http://127.0.0.1:5000/clients');
                const clientData = await clientRes.json();
                setClients(clientData);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

    fetchData();
}, []);


    
    return (
        <div className=' flex  pr-96 flex-cols-3 overflow-y-auto max-h-screen' >
          
           

            <div >
            <h1 className="text-2xl p-6 font-bold pl-36 text-black ">Project Form</h1>
             {error && <p className="text-red-700 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16"
            >
                <div>
                    <label className="block text-sm font-medium text-black">Project Name</label>
                    <input type="text" name="p_name" value={formData.p_name} onChange={handleChange} className="input-style w-72" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="input-style w-72" rows="4" />
                </div>

 <div>
                    <label htmlFor="TypeOfBuilding" className="block text-sm font-medium text-black">
                        Type of Building
                    </label>
                    <select
                        id="TypeOfBuilding"
                        name="TypeOfBuilding"
                        value={formData.TypeOfBuilding}
                        onChange={handleChange}
                        className="input-style w-72" 
                        required
                    >
                        <option value="">Select Building Type</option>
                        
                        <option value="Villa">Villa</option>
                        <option value="Town house">Town house</option>
                        <option value="Bungalow">Bungalow</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Farm house">Farm house</option>
                        <option value="mansion">mansion</option>
                    </select>
                </div>

                <div>
                        <label htmlFor="Area" className="block text-sm font-medium text-black">
                            Area (in m²)
                        </label>
                        <input
                            type="number"
                            id="Area"
                            name="Area"
                            value={formData.Area}
                            onChange={handleChange}
                            step="0.01"
                            className="input-style w-72" 
                        />
                    </div>

                    {/* Number of Floors */}
                    <div>
                        <label htmlFor="NumberOfFloors" className="block text-sm font-medium text-black">
                            Number of Floors
                        </label>
                        <input
                            type="number"
                            id="NumberOfFloors"
                            name="NumberOfFloors"
                            value={formData.NumberOfFloors}
                            onChange={handleChange}
                            className="input-style w-72" 
                            required
                        />
                    </div>

                    {/* Number of Rooms */}
                    <div>
                        <label htmlFor="NumberOfRooms" className="block text-sm font-medium text-black">
                            Number of Rooms
                        </label>
                        <input
                            type="number"
                            id="NumberOfRooms"
                            name="NumberOfRooms"
                            value={formData.NumberOfRooms}
                            onChange={handleChange}
                            className="input-style w-72" 
                            required
                        />
                    </div>

                    {/* Roof Type */}
                    <div>
                        <label htmlFor="RoofType" className="block text-sm font-medium text-black">
                            Roof Type
                        </label>
                        <select
                            id="RoofType"
                            name="RoofType"
                            value={formData.RoofType}
                            onChange={handleChange}
                            className="input-style w-72" 
                            required
                        >
                            <option value="">Select Roof Type</option>
                            <option value="Flat">Flat</option>
                            <option value="Gable">Gable</option>
                            <option value="Hip">Hip</option>
                            <option value="Shed">Shed</option>
                            <option value="Gambrel">Gambrel</option>
                            <option value="Mansard">Mansard</option>
                        </select>
                    </div>



                <div className='flex flex-row gap-x-4'>
                   
                <div>
                    <label className="block text-sm font-medium text-black">Start Date</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="input-style " required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">End Date</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="input-style" />
                </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="input-style w-72" required>
                        <option value="">Select Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Cancelled">Cancelled</option>
                      
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">Budget</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} step="0.01" className="input-style w-72" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-style w-72" required />
                </div>
               <div>
                <label className="block text-sm font-medium text-black">Site Contractor</label>
                <select
                    name="site_contractor_id"
                    value={formData.site_contractor_id}
                    onChange={handleChange}
                    className="input-style w-72"
                    required
                >
                    <option value="">Select Contractor</option>
                    {contractors.map((contractor) => (
                        <option key={contractor.id} value={contractor.id}>
                            ID{contractor.id }    :    {contractor.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-black">Client</label>
                <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="input-style w-72"
                    required
                >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            ID{client.id} : {client.username}
                        </option>
                    ))}
                </select>
            </div>

                <div>
                    <button type="submit" className="mt-3 lg:w-40 sm:w-28 bg-sky-800 text-white py-2 px-4 shadow-lg rounded-md hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Submit
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default ProjectForm;