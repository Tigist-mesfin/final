import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SeeProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_progress`);
        const data = await response.json();
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching project progress:', error);
      }
    };

    fetchProjects();
  }, []);

  const getPhaseDescription = (phase1, phase2, phase3) => {
    if (phase1 && !phase2 && !phase3) {
      return "Foundation and Framing part is finished.";
    } else if (phase1 && phase2 && !phase3) {
      return "Foundation, Framing, Mechanical, Electrical, and Plumbing part is finished.";
    } else if (phase1 && phase2 && phase3) {
      return "Interior and Exterior Finishing part is finished.";
    }
    return "";
  };

  return (
    <div className="overflow-y-auto bg-slate-200 max-h-screen p-6">
      <div className="space-y-6 max-w-6xl mx-auto"> {/* Added max-w-6xl and mx-auto for centered layout */}
        <h1 className="text-2xl font-bold">Project Progress</h1>

        {projects.length > 0 ? (
          projects.map((proj) => {
            const phaseDescription = getPhaseDescription(proj.phase1, proj.phase2, proj.phase3);
            const projectInfo = proj.project;

            return (
              <div key={proj.id} className="bg-white rounded-lg shadow p-6 space-y-4 w-full max-w-6xl"> {/* Fixed width */}
                <h2 className="text-xl text-sky-900 font-bold">Project Name: {projectInfo.name}</h2>

                {/* Grid Layout for Description, Progress, and Phases */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Project Info */}
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Description:</strong> {projectInfo.description}</p>
                    <p><strong>Location:</strong> {projectInfo.location}</p>
                    <p><strong>Type of Building:</strong> {projectInfo.type_of_building}</p>
                    <p><strong>Area:</strong> {projectInfo.area}</p>
                    <p><strong>Status:</strong> {proj.status}</p>
                    <p><strong>Updated At:</strong> {proj.updated_at}</p>
                  </div>
                  
                  {/* Progress Description */}
                  <div>
                    <p className='text-gray-700 font-semibold'>Progress Description:</p>
                    <p className="text-gray-700">{proj.description}</p>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      {/* Phase 1 */}
                      <div className="w-20">
                        <CircularProgressbar
                          value={proj.phase1 ? 100 : 0}
                          text="Phase 1"
                          styles={{
                            path: { stroke: proj.phase1 ? '#4CAF50' : '#9E9E9E' },
                            text: { fill: proj.phase1 ? '#4CAF50' : '#9E9E9E', fontSize: '12px' }
                          }}
                        />
                      </div>
                      
                      {/* Phase 2 */}
                      <div className="w-20">
                        <CircularProgressbar
                          value={proj.phase2 ? 100 : 0}
                          text="Phase 2"
                          styles={{
                            path: { stroke: proj.phase2 ? '#4CAF50' : '#9E9E9E' },
                            text: { fill: proj.phase2 ? '#4CAF50' : '#9E9E9E', fontSize: '12px' }
                          }}
                        />
                      </div>
                      
                      {/* Phase 3 */}
                      <div className="w-20">
                        <CircularProgressbar
                          value={proj.phase3 ? 100 : 0}
                          text="Phase 3"
                          styles={{
                            path: { stroke: proj.phase3 ? '#4CAF50' : '#9E9E9E' },
                            text: { fill: proj.phase3 ? '#4CAF50' : '#9E9E9E', fontSize: '12px' }
                          }}
                        />
                      </div>
                    </div>
                    {phaseDescription && (
                      <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">{phaseDescription}</p>
                    )}
                  </div>
                </div>

                {/* Image Gallery */}
                <div>
                  <p className="font-semibold">Current images of the project:</p>
                  {proj.image_urls && proj.image_urls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {proj.image_urls.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={`/${imgUrl}`}
                          alt={`Progress ${proj.id} - ${idx}`}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No images available.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No project progress data found.</p>
        )}
      </div>
    </div>
  );
};

export default SeeProjectList;