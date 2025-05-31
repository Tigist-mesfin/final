import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, DollarSign, Landmark, Hammer,Badge,  MapPin, Home, FileText, Clock, MessageCircle } from 'lucide-react';

const WorkOrder = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedWorkOrders = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/work-requests');
        if (!response.ok) {
          throw new Error('Failed to fetch work requests');
        }
        const data = await response.json();
        const approved = (data || []).filter(request => request.Status === 'Approved');
        setApprovedRequests(approved);
      } catch (error) {
        console.error('Error fetching approved work orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedWorkOrders();
  }, []);

  return (
    <div className=" grid p-8  ml-24 w-full min-h-screen bg-gray-100 overflow-y-auto  max-h-screen">
        
      <h1 className="text-3xl font-bold text-sky-900 mb-6">Approved Work Orders</h1>
     <div className='grid grid-cols-2'>
      {loading ? (
        <p className="text-gray-600">Loading approved work orders...</p>
      ) : approvedRequests.length === 0 ? (
        <p className="text-gray-600">No approved work orders found.</p>
      ) : (
        <div className="grid gap-6 ">
          {approvedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
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
             
              <div className="text-black">
              <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-sky-900" />
                  <p>Description of works: {req.description_of_works}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Hammer className="w-5 h-5 text-sky-900" />
                  <p>Equipment machinery: {req.equipment_machinery} </p>
                </div>

             

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-sky-900" />
                  <p>Date of inspection: {req.date_of_inspection}</p>
                </div>
              

                <div className="flex items-center gap-2 mb-2">
                  <Badge className="w-5 h-5 text-sky-900" />
                  <p>site contractor id: {req.site_cont_id}</p>
                </div>

               
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-sky-900" />
                  <p>Status: {req.Status}</p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-sky-900" />
                  <p>Admin Reply: {req.AdminReply || 'No reply yet'}</p>
                </div>
                 <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600 w-5 h-5" />
                <p className="font-semibold text-green-700">Approved</p>
              </div>
              </div>
              </div>
           
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default WorkOrder;
