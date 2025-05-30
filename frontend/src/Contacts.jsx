import React, { useState } from 'react';

const Contacts = () => {
    const [formData, setFormData] = useState({
        TypeOfBuilding: '',
        Budget: '',
        AdditionalDetails: '',
        UserEmail: '',
        Location: '',
        Area: '',
        NumberOfFloors: '',
        NumberOfRooms: '',
        RoofType: '',
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
            const response = await fetch('http://127.0.0.1:5000/api/submit_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Request submitted successfully!');
                setFormData({
                    TypeOfBuilding: '',
                    Budget: '',
                    AdditionalDetails: '',
                    UserEmail: '',
                    Location: '',
                    Area: '',
                    NumberOfFloors: '',
                    NumberOfRooms: '',
                    RoofType: '',
                });
            } else {
                alert('Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div> 
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif text-center mt-28 ">Contact Us</h2>
        <div className=" flex lg:flex-row-reverse flex-col  min-h-screen  py-8 px-4 sm:px-6 lg:px-36">

            <div className=" flex flex-col items-center mb-8">
                    <p className="text-black mr-16 font-bold mb-4 mt-2">
                       For Additional Information
                    </p>
                    <ul className="space-y-2">
                        <li className="text-gray-700">
                            <span className="font-semibold">Email:</span> amboconstruction264@gmail.com
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Phone:</span> +251 975432323
                        </li>
                        <li className="text-gray-700">
                            <span className="font-semibold">Address:</span> Ambo, Oromia, Ethiopia 
                        </li>
                    </ul>
                </div>
            <div className="w-auto mx-auto  rounded-lg  p-6">
                {/* Contact Information */}

                {/* Form Section */}
                <div  > 
                    
                   <form onSubmit={handleSubmit} className="lg:space-y-6 lg:pr-52">
    {/* User Email */}
    <div>
        <label htmlFor="UserEmail" className="block text-sm font-medium text-gray-700">
            Your Email
        </label>
        <input
            type="email"
            id="UserEmail"
            name="UserEmail"
            value={formData.UserEmail}
            onChange={handleChange}
            className="mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Type of Building */}
    <div>
        <label htmlFor="TypeOfBuilding" className="block text-sm font-medium text-gray-700">
            Type of Building
        </label>
        <select
            id="TypeOfBuilding"
            name="TypeOfBuilding"
            value={formData.TypeOfBuilding}
            onChange={handleChange}
            className="w-52 mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

    {/* Location */}
    <div>
        <label htmlFor="Location" className="block text-sm font-medium text-gray-700">
            Location
        </label>
        <input
            type="text"
            id="Location"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            className="w-52 mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Area */}
    <div>
        <label htmlFor="Area" className="block text-sm font-medium text-gray-700">
            Area (in m²)
        </label>
        <input
            type="number"
            id="Area"
            name="Area"
            value={formData.Area}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Number of Floors */}
    <div>
        <label htmlFor="NumberOfFloors" className="block text-sm font-medium text-gray-700">
            Number of Floors
        </label>
        <input
            type="number"
            id="NumberOfFloors"
            name="NumberOfFloors"
            value={formData.NumberOfFloors}
            onChange={handleChange}
            className="mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Number of Rooms */}
    <div>
        <label htmlFor="NumberOfRooms" className="block text-sm font-medium text-gray-700">
            Number of Rooms
        </label>
        <input
            type="number"
            id="NumberOfRooms"
            name="NumberOfRooms"
            value={formData.NumberOfRooms}
            onChange={handleChange}
            className="mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Roof Type */}
    <div>
        <label htmlFor="RoofType" className="block text-sm font-medium text-gray-700">
            Roof Type
        </label>
        <select
            id="RoofType"
            name="RoofType"
            value={formData.RoofType}
            onChange={handleChange}
            className="w-52 mt-1 block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

    {/* Budget */}
    <div>
        <label htmlFor="Budget" className="block text-sm font-medium text-gray-700">
            Budget
        </label>
        <input
            type="number"
            id="Budget"
            name="Budget"
            value={formData.Budget}
            onChange={handleChange}
            step="0.01"
            className=" shadow-lg mt-1  block lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>

    {/* Additional Details */}
    <div>
        <label htmlFor="AdditionalDetails" className="block text-sm font-medium text-gray-700">
            Additional Details
        </label>
        <textarea
            id="AdditionalDetails"
            name="AdditionalDetails"
            value={formData.AdditionalDetails}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-52 lg:w-96 sm:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
    </div>

    {/* Submit Button */}
    <div>
        <button
            type="submit"
            className="mt-3 mb-24 lg:w-40 sm:w-28 bg-gray-600 text-white py-2 px-4 shadow-lg rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Submit
        </button>
    </div>
</form>

                </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
