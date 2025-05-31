

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, Check, X } from 'lucide-react';

const SeeProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    const navigate = useNavigate();



    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;
                
                const response = await fetch(`http://127.0.0.1:5000/api/get_progress/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setProjects(data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
    
        fetchProjects();
    }, []);
    




    const fetchProjectImages = async (progressId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/get_uploaded_image/${progressId}`);
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
    
            // Update project with fetched images
            const updatedProjects = projects.map(proj =>
                proj.id === progressId ? { ...proj, image_urls: data.image_urls || [] } : proj
            );
            setProjects(updatedProjects);
            setSelectedProject(updatedProjects.find(p => p.id === progressId));
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    



    const handleEdit = (project) => {
        setEditId(project.id);
        setEditedData({ ...project });
        setErrorMessage('');
    };

    const handleChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const handleSave = async (id) => {
        try {
            setErrorMessage('');
            
            // Create FormData object
            const formData = new FormData();
            
            // Append all fields
            formData.append('description', editedData.description || '');
            formData.append('status', editedData.status || '');
            formData.append('phase1', editedData.phase1 ? 'true' : 'false');
            formData.append('phase2', editedData.phase2 ? 'true' : 'false');
            formData.append('phase3', editedData.phase3 ? 'true' : 'false');
            formData.append('p_id', editedData.p_id || '');
            formData.append('site_cont_id', editedData.site_cont_id || '');
            formData.append('updated_at', editedData.updated_at || '');
    
            const response = await fetch(`http://127.0.0.1:5000/api/update_progress/${id}`, {
                method: 'PUT',
                body: formData,  // No Content-Type header needed for FormData
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                setErrorMessage(result.error || 'Update failed');
                return;
            }
    
            setProjects(projects.map(proj => (proj.id === id ? { ...proj, ...editedData } : proj)));
            setEditId(null);
        } catch (error) {
            console.error('Error saving project progress:', error);
            setErrorMessage('An error occurred while saving.');
        }
    };
    const handleCancel = () => {
        setEditId(null);
        setEditedData({});
        setErrorMessage('');
    };

    

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this project?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/delete_progress/${id}`, {
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





    const handleShowImages = (project) => {
        console.log("Selected project:", project);  // Check what's inside images
        setSelectedProject(project);
    };
    


    const handleShowImage = (project) => {
        fetchProjectImages(project.id);
    };
    


    const handleAddImage = async (e, progressId) => {
        const file = e.target.files[0];
        if (!file) return;
      
        const formData = new FormData();
        formData.append('images', file); // ✅ correct key
      
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/upload_progress_image/${progressId}`, {
            method: 'POST',
            body: formData,
          });
      
          if (!res.ok) throw new Error('Image upload failed');
          const updated = await res.json();
      
          // Update selected project in state
          const updatedProjects = projects.map(proj =>
            proj.id === progressId ? { ...proj, image_urls: updated.all_images } : proj
          );
          setProjects(updatedProjects);
          setSelectedProject(updatedProjects.find(p => p.id === progressId));
        } catch (err) {
          console.error('Add image error:', err);
        }
      };
      

            

      
const handleDeleteImage = async (imgUrl, progressId) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this image?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://127.0.0.1:5000/api/delete_progress_image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imgUrl, progress_id: progressId }),
    });

    if (!res.ok) throw new Error('Failed to delete image');
    const updated = await res.json();

    // Update project state after image delete
    const updatedProjects = projects.map(proj => {
        if (proj.id === progressId) {
          return {
            ...proj,
            image_urls: proj.image_urls.filter(url => url !== imgUrl),
          };
        }
        return proj;
      });
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === progressId));
      
  } catch (err) {
    console.error('Delete image error:', err);
  }
};



    

    return (
        <div className="container mx-auto p-6 overflow-y-auto max-h-screen">
            
            <h1 className="text-2xl font-bold mb-4">Project Progress List</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-Hex3">
                        <tr>
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Description</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Phase 1</th>
                            <th className="py-2 px-4 border">Phase 2</th>
                            <th className="py-2 px-4 border">Phase 3</th>
                            <th className="py-2 px-4 border">Project ID</th>
                            <th className="py-2 px-4 border">Date</th>
                            <th className="py-2 px-4 border">Images</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((proj) => (
                                <tr key={proj.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{proj.id}</td>

                                    {/* Description */}
                                    <td className="py-2 px-4 border">
                                        {editId === proj.id ? (
                                            <input
                                                type="text"
                                                value={editedData.description || ''}
                                                onChange={(e) => handleChange(e, 'description')}
                                                className="border p-1 w-full"
                                            />
                                        ) : (
                                            proj.description
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="py-2 px-4 border">
                                        {editId === proj.id ? (
                                            <input
                                                type="text"
                                                value={editedData.status || ''}
                                                onChange={(e) => handleChange(e, 'status')}
                                                className="border p-1 w-full"
                                            />
                                        ) : (
                                            proj.status
                                        )}
                                    </td>

                                                            {/* Phase 1 */}
                        <td className="py-2 px-4 border text-center">
                            {editId === proj.id ? (
                                <input
                                    type="checkbox"
                                    checked={editedData.phase1 || false}
                                    onChange={(e) =>
                                        setEditedData({ ...editedData, phase1: e.target.checked })
                                    }
                                />
                            ) : (
                                proj.phase1 ? '✔' : '✘'
                            )}
                        </td>

                        {/* Phase 2 */}
                        <td className="py-2 px-4 border text-center">
                            {editId === proj.id ? (
                                <input
                                    type="checkbox"
                                    checked={editedData.phase2 || false}
                                    onChange={(e) =>
                                        setEditedData({ ...editedData, phase2: e.target.checked })
                                    }
                                />
                            ) : (
                                proj.phase2 ? '✔' : '✘'
                            )}
                        </td>

                        {/* Phase 3 */}
                        <td className="py-2 px-4 border text-center">
                            {editId === proj.id ? (
                                <input
                                    type="checkbox"
                                    checked={editedData.phase3 || false}
                                    onChange={(e) =>
                                        setEditedData({ ...editedData, phase3: e.target.checked })
                                    }
                                />
                            ) : (
                                proj.phase3 ? '✔' : '✘'
                            )}
                        </td>

                                    {/* p_id */}
                                    <td className="py-1 px-1 border">
                                        {editId === proj.id ? (
                                            <input
                                                type="number"
                                                value={editedData.p_id || ''}
                                                onChange={(e) => handleChange(e, 'p_id')}
                                                className="border p-1 w-full"
                                            />
                                        ) : (
                                            proj.p_id
                                        )}
                                    </td>

                                    
                                                                        {/* Updated At */}
                                    <td className="py-2 px-4 border">
                                        {editId === proj.id ? (
                                            <input
                                                type="date"
                                                value={editedData.updated_at || ''}
                                                onChange={(e) => handleChange(e, 'updated_at')}
                                                className="border p-1 w-full"
                                            />
                                        ) : (
                                            proj.updated_at
                                        )}
                                    </td>


                                    <td className="py-2 px-4 border text-center">
                                        <button
                                            onClick={() => handleShowImages(proj)&& handleShowImage(proj)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            Show Images
                                        </button>
                                    </td>


                                    {/* Actions */}
                                    <td className="py-2 px-4 border">
                                        <div className="flex space-x-2">
                                            {editId === proj.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(proj.id)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-gray-600 hover:text-gray-800"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(proj)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(proj.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
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
                                <td colSpan="11" className="text-center py-4">
                                    No project progress records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {errorMessage && (
                    <div className="text-red-600 mt-4 text-sm">{errorMessage}</div>
                )}
            </div>





            {selectedProject && (
  <div className="mt-6 border p-4 rounded bg-gray-100 shadow">
    <h2 className="text-lg font-semibold mb-3">
      Images for Project Progress ID: {selectedProject.id}
    </h2>

    <div className="flex gap-4 flex-wrap items-center">
      {/* Add Image button */}
      {editId === selectedProject.id && (
        <div className="w-40 h-32 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-200">
          <label className="cursor-pointer">
            <span className="text-sm text-blue-600 font-semibold">+ Add Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleAddImage(e, selectedProject.id)}
            />
          </label>
        </div>
      )}

      {/* Show images */}
      {selectedProject.image_urls && selectedProject.image_urls.length > 0 ? (
        selectedProject.image_urls.map((imgUrl, index) => (
          <div key={index} className="relative w-40 h-32">
            <img
              src={`/${imgUrl}`}
              alt={`Progress image ${index}`}
              className="w-full h-full object-cover rounded shadow"
            />

            {/* Delete Button */}
            {editId === selectedProject.id && (
              <button
                onClick={() => handleDeleteImage(imgUrl, selectedProject.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No images found for this project progress.</p>
      )}
    </div>
  </div>
)}










        </div>
    );
};

export default SeeProjectList;

