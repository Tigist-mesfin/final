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
    <div className=" overflow-y-auto bg-slate-200 max-h-screen p-6 space-y-6 md:grid-cols-4  gap-6 ">
     <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">Project Progress</h1>

        {projects.length > 0 ? (
          projects.map((proj) => {
            const phaseDescription = getPhaseDescription(proj.phase1, proj.phase2, proj.phase3);

            return (
              <div key={proj.id} className="bg-white rounded shadow p-4 space-y-4 border   ">
                <h2 className="text-lg text-sky-900 font-bold">Progress ID: {proj.id}</h2>

                {/* Grid for description and circular progress bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Description Section */}
                  <div>
                    <div className='w-96'><strong>Description:</strong> {proj.description}</div>
                    <div><strong>Status:</strong> {proj.status}</div>
                    <div><strong>Updated At:</strong> {proj.updated_at}</div>
                  </div>

                  {/* Circular Progress Bars and Phase Description in the same column */}
                  <div >
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
                    {phaseDescription && (
                      <p className="mt-2 text-lg ">{phaseDescription}</p>
                    )}
                  </div>
                </div>

                <p className="font-semibold mt-4">Current images of the project</p>

                {/* Image Display */}
                {proj.image_urls && proj.image_urls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 md:grid-cols-4 gap-2">
                    {proj.image_urls.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={`/${imgUrl}`}
                        alt={`Progress ${proj.id} - ${idx}`}
                        className="w-full h-32 object-cover rounded shadow"
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
  );
};

export default SeeProjectList;
