import React, { useState } from "react";

const ProjectProgressForm = () => {
    const [formData, setFormData] = useState({
        description: "",
        status: "",
        phase1: false,
        phase2: false,
        phase3: false,
        p_id: "",
        site_cont_id: "",
        updated_at: "",
        images: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhaseChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: [...e.target.files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if required fields are filled
        if (!formData.description || !formData.status || !formData.p_id || !formData.updated_at) {
            alert("Please fill out all required fields.");
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData.images.forEach((image) => {
                    formDataToSend.append("images", image);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch("http://127.0.0.1:5000/api/progress", {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                alert("Project progress submitted successfully!");
                setFormData({
                    description: "",
                    status: "",
                    phase1: false,
                    phase2: false,
                    phase3: false,
                    p_id: "",
                    site_cont_id: "",
                    updated_at: "",
                    images: [],
                });
            } else {
                alert("Failed to submit progress. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting progress:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold pl-36 text-gray-800 mb-4">Project Progress Form</h1>
            <form
                onSubmit={handleSubmit}
                className="border border-gray-400 ml-32 p-6 rounded-lg shadow-lg bg-slate-200 w-auto mt-1 lg:space-y-2 lg:pr-52 lg:pl-16"
            >
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-style w-72"
                        rows="4"
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-style w-72"
                        required
                    />
                </div>

                {/* Phases Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phases (Select any)</label>
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="phase1"
                                checked={formData.phase1}
                                onChange={handlePhaseChange}
                                className="w-4 h-4"
                            />
                            <span>Phase 1</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="phase2"
                                checked={formData.phase2}
                                onChange={handlePhaseChange}
                                className="w-4 h-4"
                            />
                            <span>Phase 2</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="phase3"
                                checked={formData.phase3}
                                onChange={handlePhaseChange}
                                className="w-4 h-4"
                            />
                            <span>Phase 3</span>
                        </label>
                    </div>
                </div>

                {/* Project ID & Site Contractor ID */}
                <div className="flex flex-row gap-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project ID</label>
                        <input
                            type="text"
                            name="p_id"
                            value={formData.p_id}
                            onChange={handleChange}
                            className="input-style w-72"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Site Contractor ID</label>
                        <input
                            type="text"
                            name="site_cont_id"
                            value={formData.site_cont_id}
                            onChange={handleChange}
                            className="input-style w-72"
                        />
                    </div>
                </div>

                {/* Updated At */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        name="updated_at"
                        value={formData.updated_at}
                        onChange={handleChange}
                        className="input-style w-72"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="input-style w-72"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="mt-3 lg:w-40 sm:w-28 bg-sky-800 text-white py-2 px-4 shadow-lg rounded-md hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectProgressForm;
