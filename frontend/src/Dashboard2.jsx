import React, { useState, useEffect } from 'react';
import { Bell, UserCircle2, ChevronDown, X, Check, Mail, Phone, Home, Lock, BadgeCheck} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProject] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
const [editedUser, setEditedUser] = useState(null); // fix: initialize as null
const [employees, setEmployees] = useState([]);
const [deadlineAlerts, setDeadlineAlerts] = useState([]);
 const [error, setError] = useState("");
const [showWorkRequestForm, setShowWorkRequestForm] = useState(false);

const navigate = useNavigate();


const [formData, setFormData] = useState({
  p_id: "",
  description_of_works: "",
  equipment_machinery: "",
  date_of_inspection: "",
  site_contractor_id:  localStorage.getItem("userId") || "",
});

// Handler to update form data state
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};


const handleToggleForm2 = () => {
  navigate("/site-dashboard/workOrder");
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
      const response = await fetch('http://127.0.0.1:5000/api/work-requests', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      if (response.ok) {
          alert('Request submitted successfully!');
          setFormData({
            p_id: "",
            description_of_works: "",
            equipment_machinery: "",
            date_of_inspection: "",
            
          });
          
      } else {
          alert('Failed to submit request. Please try again.');
      }
      setShowWorkRequestForm(false);
  } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again.');
  }
};





 const handleToggleForm = () => {
    setShowWorkRequestForm(!showWorkRequestForm);
  };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                
                const response = await fetch(`http://127.0.0.1:5000/employee/get_employee/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data.employees || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
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

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchProject = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_projects_by_site_contr/${userId}`);
        const data = await response.json();
        setProject(data);
        const today = new Date();
const alerts = data.map((project) => {
  const endDate = new Date(project.end_date);
  const timeDiff = endDate - today;

  if (timeDiff < 0) {
    const overdueDays = Math.ceil(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
    return `❗ Project "${project.name}" is overdue by ${overdueDays} day(s).`;
  }

  const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (totalDays <= 180) {  // Show only if within 6 months
    const monthPart = months > 0 ? `${months} month(s)` : '';
    const dayPart = days > 0 ? `${days} day(s)` : '';
    const andConnector = (months > 0 && days > 0) ? ' and ' : '';
    return `⚠️ Project "${project.name}" is due in ${monthPart}${andConnector}${dayPart}.`;
  }

  return null;
}).filter(Boolean);


      setDeadlineAlerts(alerts);
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

    

    fetchProject();
  }, []);





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
    <div className="flex-1 overflow-y-auto max-h-screen  bg-gray-100">
    <div className="flex flex-col gap-6 p-8 bg-gray-100 min-h-screen relative ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

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
      
      {showProfile && user && (
        <div className="absolute top-24 right-8 w-80 bg-white rounded-xl shadow-xl p-6 z-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Profile</h2>
            <button onClick={() => setShowProfile(false)}>
              <X className="w-5 h-5 text-gray-600 hover:text-Hex44" />
            </button>
          </div>

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
                  className="px-6 py-2 ml-28 bg-Hex3 text-black rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                   Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 ml-40 bg-sky-800 text-white rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}


      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="p-6 h-40 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
          <h2 className="text-lg font-semibold text-black">Total Projects</h2>
          <p className="text-3xl font-bold text-black">{projects.length}</p>
        </div>
        <div className="p-6 h-40 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
          <h2 className="text-lg font-semibold text-black">Active Employees</h2>
          <p className="text-3xl font-bold text-sky-900">{employees.length}</p>
  </div>
         <div>   
          <button
          onClick={handleToggleForm}
          className="mt-4 px-4 py-3 font-bold bg-Hex4 text-black rounded-md hover:bg-Hex3 transition"
        >
          Work Request Form
        </button>


     
      </div>
    
       <div>
         <button
          onClick={handleToggleForm2} 
          className="p-[3px] mt-5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-900 rounded-lg" />
        <div className="px-8 py-2  bg-neutral-700 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
         
          Approved requests
          </div>
        </button>
        </div>




      {/* Conditionally Rendered Form Section */}
      {showWorkRequestForm && (
        <div className="md:col-span-4 p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-sky-500">
          <h2 className="text-lg font-semibold mb-4">Work Request Form</h2>
          
          <form onSubmit={handleSubmit}  className="space-y-4">
          <div>
          <label className="block text-sm font-medium text-gray-700">Project</label>
          <select
                name="p_id"
                value={formData.p_id}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
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
          <label className="block text-sm font-medium text-gray-700">Description of Works</label>
          <textarea
            name="description_of_works"
            value={formData.description_of_works}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the works"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment/Machinery</label>
          <input
            type="text"
            name="equipment_machinery"
            value={formData.equipment_machinery}
            onChange={handleChange}
            placeholder="List equipment or machinery"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Inspection</label>
          <input
            type="date"
            name="date_of_inspection"
            value={formData.date_of_inspection}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

       

            <button
              type="submit"
              className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-700 transition"
            >
              Submit
            </button>
          </form>
         
        </div>
      )}
    

      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
            {deadlineAlerts.length > 0 ? (
    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
      {deadlineAlerts.map((alert, index) => (
        <li key={index}>{alert}</li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-500">No urgent project deadlines.</p>
  )}
        </div>
      </div>

      {/* Project Details */}
      {projects.length > 0 ? (
        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            
            <div key={project.id} className="flex flex-row gap-16 bg-Hex3 shadow p-6 rounded-xl">
              <div>
                <h2 className="text-xl font-bold  mb-2">Project Details</h2>
                <p><strong>ID:</strong> {project.id}</p>
                <p><strong>Name:</strong> {project.name}</p>
                <p className='w-96'><strong>Description:</strong> {project.description}</p>
                <p><strong>Start Date:</strong> {project.start_date}</p>
                <p><strong>End Date:</strong> {project.end_date}</p>
              </div>
              <div className="mt-8">
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Budget:</strong> {project.budget} birr</p>
                <p><strong>Location:</strong> {project.location}</p>
                <p><strong>Site Contractor ID:</strong> {project.site_contractor_id}</p>
                <p><strong>Client ID:</strong> {project.client_id}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading projects...</p>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
