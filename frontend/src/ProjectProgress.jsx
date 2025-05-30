import React from 'react';
import { useNavigate,Outlet, useLocation } from "react-router-dom";




const ProjectProgress = () => {
  const navigate = useNavigate();
  
    return (
      <div>
        <div className="flex-1 p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className=" h-20 p-6 text-center bg-yellow-100 hover:bg-stone-400 shadow-lg rounded-lg w-full"
             onClick={() => navigate('addprojectprogress')}>
                <h2 className="text-lg font-semibold">Add Project</h2>
               
            </button>
            <button className=" h-20 p-6 text-center bg-white hover:bg-stone-400 shadow-lg rounded-lg w-full"
             onClick={() => navigate('seeprojectprogresslist')}>
                <h2 className="text-lg font-semibold">Projects</h2>
               
            </button>
            <button className="  h-20 p-6 text-center bg-white hover:bg-stone-400 shadow-lg rounded-lg w-full">
                <h2 className="text-lg font-semibold">Project progress </h2>
               
            </button>
        </div>

        <div className=' p-12 flex flex-row gap-4'>
           <div className=" w-64 h-64  p-6 text-center bg-white shadow-lg rounded-full">
            <h2 className="text-lg p-4 font-semibold">Total number of project</h2>
  
         </div>
        <div className=" w-64 h-64  p-6 text-center bg-white shadow-lg rounded-full flex flex-col items-center">
             <h2 className="text-lg p-4 font-semibold">Ongoing Projects</h2>
   
          </div>
        </div>



      </div>

    );
};


export default ProjectProgress;
