import React, { useState, useEffect } from 'react';
import { Bell, UserCircle2, ChevronDown, MessageCircle,Mail, DollarSign, MapPin, Home,DoorOpen,Layers, FileText, Clock,Ruler, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [client, setClient] = useState([]);
  const [deadlineAlerts, setDeadlineAlerts] = useState([]);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [workRequests, setWorkRequests] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [pendingWorkRequestsCount, setPendingWorkRequestsCount] = useState(0);
  
  const navigate = useNavigate();



const handleToggleForm = () => {
  navigate("/admin-dashboard/workOrder");
};
const handleClick = () => {
  
  navigate("/admin-dashboard/workrequest");
};


useEffect(() => {
  const fetchWorkRequests = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/work-requests');
      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setWorkRequests(data || []);
      const pending = (data || []).filter(req =>
        req.AdminReply === null || req.AdminReply === '' 
      );
      setPendingWorkRequestsCount(pending.length);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
    fetchWorkRequests();
  }, []);

 useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/client/get_client');
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setClient(data.client || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);



  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/requests');
        if (!response.ok) throw new Error('Failed to fetch requests');

        const data = await response.json();
        setRequests(data || []);
        const pending = (data || []).filter(req =>
          req.AdminReply === null || req.AdminReply === '' 
        );
        setPendingRequestsCount(pending.length);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    } ;




    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/project/get_projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects || []);
        const ongoingProjects = data.projects.filter(project => project.status === 'In Progress');
        setOngoingCount(ongoingProjects.length);

        const today = new Date();
        const alerts = (data.projects || []).map((project) => {
          const endDate = new Date(project.end_date);
          const diffTime = endDate - today;
          const isOverdue = diffTime < 0;
          const diff = Math.abs(diffTime);
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          const days = (diffDays % 365) % 30;

          const formatDuration = `${years ? `${years} yr${years > 1 ? 's' : ''}, ` : ''}${months ? `${months} mo${months > 1 ? 's' : ''}, ` : ''}${days} day${days !== 1 ? 's' : ''}`;

          if (isOverdue) {
            return `❗ Project "${project.p_name}" is overdue by ${formatDuration}`;
          } else if (diffDays <= 180) {
            return `⚠️ Project "${project.p_name}" is due in ${formatDuration}`;
          }
          return null;
        }).filter(Boolean);

        setDeadlineAlerts(alerts);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/site_contractor/get_contractors');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data.contractors || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchRequests();
    fetchProjects();
    fetchEmployees();
  }, []);

  const handleReply = async (requestId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/requests/${requestId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AdminReply: status,
          Status: status === 'Accepted' ? 'Approved' : 'Rejected', // Update status accordingly
        }),
      });

      if (response.ok) {
        // Remove the request from the UI after reply
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.RequestID !== requestId)
        );
      } else {
        console.error('Failed to update the request status');
      }
    } catch (error) {
      console.error('Error replying to request:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto max-h-screen  flex-col bg-gray-100">
      <div className="flex flex-col gap-6 p-8 bg-grey-100 min-h-screen relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-black  font-bold">Dashboard</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="flex flex-cols-1 sm:flex-cols-3 md:flex-cols-3 gap-7 ">
          <div className="p-6 w-40 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-black">Total Projects</h2>
            
            <p className="text-3xl font-bold text-black">{projects.length}</p>
          </div>
            
          <div className="p-6 w-40  bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-black">Active clients</h2>
            <p className="text-3xl font-bold text-sky-900">{client.length}</p>
          </div>
        
        {/* Notification and Requests */}
        
          <div className="p-6 bg-Hex4 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="text-lg text-black font-semibold">Notifications</h2>
            </div>
            {deadlineAlerts.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-black space-y-1">
                {deadlineAlerts.map((alert, index) => (
                  <li key={index}>{alert}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No urgent project deadlines.</p>
            )}
          </div>
       
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
        <div className="p-6 w-40 bg-white rounded-xl shadow hover:shadow-lg transition text-center mr-4">
            <h2 className="text-lg font-semibold text-black">Active Employees</h2>
            <p className="text-3xl font-bold text-sky-900">{employees.length}</p>
          </div>
          <div className="p-6 w-40 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-black">Ongoing Projects</h2>
            <p className="text-3xl font-bold text-black">{ongoingCount}</p>
          </div>
          <div>   
          
          <button  
            onClick={handleClick}
            className="relative rounded-md mt-4 h-20 px-4 py-2 border-2 border-Hex44 font-bold bg-Hex3 text-black hover:bg-Hex3 transition"
          >
            {/* Bell icon positioned in the top-right corner */}
            <Bell className="absolute top-2 right-2 w-5 h-5 text-white" />

            {/* Badge for pending requests */}
            {pendingWorkRequestsCount > 0 && (
              <span className="absolute top-0 right-0 bg-Hex4 text-black text-xs font-bold px-1 py-0 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {pendingWorkRequestsCount}
              </span>
            )}

            {/* Button label */}
            Work Request's
          </button>


      </div>
     
          </div>
        {/* Requests Section */}
        <div className="p-6 bg-neutral-500 rounded-xl shadow hover:shadow-lg transition">
          <div className="relative inline-block">
            <MessageCircle className="w-6 h-6 text-white" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-Hex4 text-black text-xs font-bold px-1 py-0 rounded-full">
                {pendingRequestsCount}
              </span>
              
            )}
          </div>
          <p className='text-white mb-3'>  use internet connection to reply</p>
          {/* Request Details */}
          {requests.length > 0 ? (
            <div className="flex flex-col gap-6">
              {requests
                .filter(req =>
                  req.AdminReply === null || req.AdminReply === '' || req.AdminReply === 'None'
                )
                .map((req) => (
                  <div key={req.RequestID} className="flex flex-row gap-16 bg-white shadow p-6 rounded-xl">
                    <div>
                      <h2 className="text-xl text-sky-950 font-bold  mb-2">Request Details</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-sky-900" />
                      <p>Email: {req.UserEmail}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-sky-900" />
                      <p>Budget: {req.Budget} birr</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-sky-900" />
                      <p>Location: {req.Location}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-sky-900" />
                      <p>Type of Building: {req.TypeOfBuilding}</p>
                    </div>

                   

                     <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-5 h-5 text-sky-900" />
                      <p>Area: {req.Area}</p>
                    </div>

                     <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-sky-900" />
                      <p>Roof type: {req.RoofType}</p>
                    </div>

                    </div>
                    <div className="mt-8">

                      
                     <div className="flex items-center gap-2 mb-2">
                      <DoorOpen className="w-5 h-5 text-sky-900" />
                      <p>Number of rooms: {req.NumberOfRooms}</p>
                    </div>

                      <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-sky-900" />
                      <p>Number of floors: {req.NumberOfFloors}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-sky-900" />
                      <p>Additional Details: {req.AdditionalDetails}</p>
                    </div>


                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-sky-900" />
                      <p>Status: {req.Status}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-sky-900" />
                      <p>Admin Reply: {req.AdminReply || 'No reply yet'}</p>
                    </div>
                                      </div>

                    <div className="flex flex-col gap-4 mt-4">
                      <button 
                        className="px-1 w-16 h-10 bg-gray-200 text-black rounded-lg hover:bg-gray-400" 
                        onClick={() => handleReply(req.RequestID, 'Accepted               Please visit our office to finalize the construction contract. ')}
                      >
                        Accept
                      </button>
                      <button 
                        className="px-1 w-16 h-10 bg-gray-800 text-white rounded-lg hover:bg-gray-950" 
                        onClick={() => handleReply(req.RequestID, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p>Loading requests...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
