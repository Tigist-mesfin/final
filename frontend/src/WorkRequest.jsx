import React, { useEffect, useState } from 'react';
import { MessageCircle, Mail, DollarSign, MapPin, Home, FileText, Clock, Landmark } from 'lucide-react';

const WorkRequest = () => {
const [workRequests, setWorkRequests] = useState([]);
const [pendingWorkRequestsCount, setPendingWorkRequestsCount] = useState(0);
const [loading, setLoading] = useState(true);


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
   

     const handleReply = async (requestId, status) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/work-requests/${requestId}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            AdminReply: status,
            Status: status === 'Approve' ? 'Approved' : 'Rejected', 
          }),
        });
  
        if (response.ok) {
          // Remove the request from the UI after reply
          setWorkRequests((prevRequests) =>
            prevRequests.filter((req) => req.id !== requestId)
        );
            // Also update the pending counter
             setPendingWorkRequestsCount((prev) => prev - 1)
         
        } else {
          console.error('Failed to update the request status');
        }
      } catch (error) {
        console.error('Error replying to request:', error);
      }
    };
  

    

  return (
    <div className='overflow-y-auto max-h-screen'> 
        {/* Requests Section */}
    <div className="p-6  bg-neutral-500 rounded-xl shadow hover:shadow-lg transition ">
      <div className="relative inline-block">
        <MessageCircle className="w-6 h-6 text-white" />
        {pendingWorkRequestsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-Hex4 text-black text-xs font-bold px-1 py-0 rounded-full">
            {pendingWorkRequestsCount}
          </span>
        )}
      </div>
      {/* Request Details */}
      {workRequests.length > 0 ? (
        <div className="flex flex-col gap-6 overflow-y-auto max-h-screen">
          {workRequests
            .filter(req =>
              req.AdminReply === null || req.AdminReply === '' || req.AdminReply === 'None'
            )
            .map((req) => (
              <div key={req.id} className="flex flex-row gap-16 bg-white shadow p-6 rounded-xl">
                <div>
                  <h2 className="text-xl text-sky-950 font-bold  mb-2"> Work Request Details</h2>
                
                <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5 text-sky-900" />
                <p>Project Name: {req.project?.p_name || 'No project name'}</p>
              </div>
                  <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-sky-900" />
                        <p> Project Description: {req.project?.description}</p>
                      </div>
                       <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-sky-900" />
                        <p>Location: {req.project?.location}</p>
                      </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-sky-900" />
                  <p>Description of works: {req.description_of_works}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-sky-900" />
                  <p>Equipment machinery: {req.equipment_machinery} </p>
                </div>

               
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-sky-900" />
                  <p>Date of inspection: {req.date_of_inspection}</p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-sky-900" />
                  <p>site contractor id: {req.site_cont_id}</p>
                </div>

                </div>
                <div className="mt-8">
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
                    onClick={() => handleReply(req.id, 'Approve')}
                  >
                    Approve
                  </button>
                  <button 
                    className="px-1 w-16 h-10 bg-gray-800 text-white rounded-lg hover:bg-gray-950" 
                    onClick={() => handleReply(req.id, 'Rejected')}
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
  );
};


export default WorkRequest;