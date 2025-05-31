import React, { useEffect, useState } from 'react';
import { UserCircle2, ChevronDown, X, Check, Loader2,  Mail, Phone, Home, Lock, BadgeCheck} from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, useNavigate  } from "react-router-dom";
import { Menu } from "lucide-react";

const ClientPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await fetch(`http://127.0.0.1:5000/auth/user/${userId}`);
        const data = await res.json();
        setUser(data.user);
        setEditedUser(data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    const fetchProjects = async () => {
      const clientId = localStorage.getItem('userId');
      if (!clientId) return;

      try {
        const res = await fetch(`http://127.0.0.1:5000/api/client/${clientId}/progress`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return; // Assuming `user` is already fetched
  
    setError(""); // Clear previous errors

  const usernameRegex = /^[a-zA-Z0-9]{4,10}$/;
  if (!usernameRegex.test(editedUser.username)) {
    setError("Username must be 4–10 characters and contain only letters and numbers.");
    return;
  }
 if (editedUser.password.length < 6 || editedUser.password.length > 8) {
    setError("Password must be between 6 and 8 characters.");
    return;
  }
   // Password complexity validation
  const hasUpperCase = /[A-Z]/.test(editedUser.password);
  const hasLowerCase = /[a-z]/.test(editedUser.password);
  const hasNumber = /[0-9]/.test(editedUser.password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
    return;
  }

    try {
      const response = await fetch(`http://127.0.0.1:5000/site/update_profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser(editedUser);      // update displayed user
        setIsEditing(false);      // exit edit mode
        console.log('User saved:', data.message);
      } else {
        console.error('Update failed:', data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert("Something went wrong while saving.");
    }
  };
  
  

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Reset to original user data
  };


  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/auth/user/${userId}`);
        const data = await response.json();
        setUser(data.user);
        setEditedUser(data.user); 
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };
  
  

  const getPhaseDescription = (phase1, phase2, phase3) => {
    if (phase1 && !phase2 && !phase3) {
      return "Foundation and Framing part is finished.";
    } else if (phase1 && phase2 && !phase3) {
      return "Foundation, Framing, Mechanical, Electrical, and Plumbing part is finished.";
    } else if (phase1 && phase2 && phase3) {
      return "Interior and Exterior Finishing part is finished. Your Home is Complete";
    }
    return "";
  };

  return (
    <div className="flex-1 overflow-y-auto max-h-screen bg-Hex1 ">
       <nav className="bg-sky-800 shadow-md fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo */}
                <Link 
  className="text-1xl  text-gray-200 border-2 border-Hex2 px-3   inline-block text-center leading-tight"
>
  Ambo<br />construction
</Link>


      
                {/* Mobile Menu Toggle Button */}
               
      
                {/* Desktop Navigation Links */}
                <div className="sm:flex space-x-4 absolute right-0 ">
        <button
          onClick={handleLogout}
          className="bg-Hex2 text-base text-black w-28 text-center mx-14 py-2 rounded-md font-medium hover:bg-Hex4"
        >
          Logout
        </button>
      </div>
              </div>
            </div>
      
         
          </nav>
      <div className="flex flex-col gap-6 p-8 bg-Hex1 min-h-screen relative mt-24">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl mx-16 sm:text-2xl font-bold text-gray-800">Your Home Progress Journey</h1>
        
          {/* Profile Button */}
          {user && (
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition"
            >
              <UserCircle2 className="w-6 h-6 text-sky-800" />
              <span className="text-sm font-medium">{user.username}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Profile Dropdown */}
        {showProfile && user && (
          <div className="absolute top-24 right-8 w-72 sm:w-80 bg-white rounded-xl shadow-xl p-6 z-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>
              <button onClick={() => setShowProfile(false)}>
                <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            {/* User Info Form */}
          
            <div className="flex items-center gap-4 mb-4">
            <UserCircle2 className="w-12 h-12 text-sky-800" />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleEditChange}
                  className="text-lg font-semibold text-gray-800 bg-gray-100 p-1 rounded"
                />
              ) : (
                <h2 className="text-lg font-semibold">{user.username}</h2>
              )}
             
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
  {isEditing ? (
    <>
    {error && <p className="text-red-700 text-center">{error}</p>}
      <div>
        <label className="font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={editedUser.email}
          onChange={handleEditChange}
          className="text-sm text-gray-700 bg-gray-100 p-1 rounded"
        />
      </div>

      <div>
        <label className="font-medium flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone:
        </label>
        <input
          type="text"
          name="phone"
          value={editedUser.phone}
          onChange={handleEditChange}
          className="text-sm text-gray-700 bg-gray-100 p-1 rounded"
        />
      </div>

      <div>
        <label className="font-medium flex items-center gap-2">
          <Home className="h-4 w-4" />
          Address:
        </label>
        <input
          type="text"
          name="address"
          value={editedUser.address}
          onChange={handleEditChange}
          className="text-sm text-gray-700 bg-gray-100 p-1 rounded"
        />
      </div>

      <div>
        <label className="font-medium flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={editedUser.password}
          onChange={handleEditChange}
          className="text-sm text-gray-700 bg-gray-100 p-1 rounded"
        />
      </div>

      <div>
        <label className="font-medium flex items-center gap-2">
          <BadgeCheck className="h-4 w-4" />
          User ID:
        </label>
        <input
          type="text"
          name="id"
          value={editedUser.id}
          disabled
          className="text-sm text-gray-500 bg-gray-100 p-1 rounded"
        />
      </div>
    </>
  ) : (
    <>
      <p className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span className="font-medium">Email:</span> {user.email}
      </p>

      <p className="flex items-center gap-2">
        <Phone className="h-4 w-4" />
        <span className="font-medium">Phone:</span> {user.phone}
      </p>

      <p className="flex  items-center gap-2">
        <Home className="h-4 w-4" />
        <span className="font-medium">Address:</span> {user.address}
      </p>

      <p className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        <span className="font-medium">Password:</span> {user.password}
      </p>

      <p className="flex items-center gap-2">
        <BadgeCheck className="h-4 w-4" />
        <span className="font-medium">User ID:</span> {user.id}
      </p>
    </>
  )}
</div>
          <div className="flex gap-3 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className=" px-3 sm:px-6 py-2 ml-28 bg-Hex3 text-black rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className=" px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                   Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className=" px-2 sm:px-4 py- sm:py-2 ml-40 bg-sky-800 text-white rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}

        {/* Project Progress Section */}
        <div className="space-y-6">

           {projects.length > 0 ? (
          projects.map((proj) => {
            const phaseDescription = getPhaseDescription(proj.phase1, proj.phase2, proj.phase3);
            const projectInfo = proj.project;

              return (
                <div key={proj.id} className="bg-white rounded mx-16 shadow p-4 space-y-4 border">
                  <h2 className="text-xl font-bold text-gray-800"></h2>
                  <h2 className="text-lg font-semibold">Project Name: {proj.project_name}</h2>

                  {/* Description and Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                     <div> <strong>Project Description:</strong> {proj.project_description}</div>
                     <div> <strong>location:</strong> {proj.location}</div>
                     <div> <strong>Area:</strong> {proj.area} kare</div>
                     <div> <strong>Type of Building:</strong> {proj.type_of_building}</div>
                      
                      
                      <div><strong>Status:</strong> {proj.status}</div>
                      <div><strong>Updated At:</strong> {proj.updated_at}</div>
                    </div>
                    <div><strong>Progress Description:</strong> {proj.description}</div>

                    {/* Circular Progress Bars */}
                    <div>
                      <div className="flex space-x-4 mb-2">
                         {proj.phase1 !== undefined && (
                                                <div className="w-24">
                                                  <CircularProgressbar
                                                    value={proj.phase1 * 100}
                                                    text={`Phase 1`}
                                                    styles={{
                                                      path: { stroke: '#4CAF50' },
                                                      text: { fill: '#4CAF50', fontSize: '12px' }
                                                    }}
                                                  />
                                                </div>
                                              )}
                       {proj.phase2 !== undefined && (
                                               <div className="w-24">
                                                 <CircularProgressbar
                                                   value={proj.phase2 * 100}
                                                   text={`Phase 2`}
                                                   styles={{
                                                     path: { stroke: '#4CAF50' },
                                                     text: { fill: '#4CAF50', fontSize: '12px' }
                                                   }}
                                                 />
                                               </div>
                                             )}
                          {proj.phase3 !== undefined && (
                            <div className="w-24">
                              <CircularProgressbar
                                value={proj.phase3 * 100}
                                text={`Phase 3`}
                                styles={{
                                  path: { stroke: '#4CAF50' },
                                  text: { fill: '#4CAF50', fontSize: '12px' }
                                }}
                              />
                            </div>
                        )}
                      </div>

                      {/* Phase Description */}
                      {phaseDescription && <p className="mt-2 text-lg">{phaseDescription}</p>}
                    </div>
                  </div>

                  {/* Image Display */}
                  <p className="font-semibold mt-4">Current images of the project</p>
                  {proj.image_urls && proj.image_urls.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {proj.image_urls.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={`/${imgUrl}`}
                          alt={`Progress ${proj.id} - ${idx}`}
                          className="w-full h-full object-cover rounded shadow"
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No project progress data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
