import { useState, useEffect } from "react";
import { useNavigate,Outlet, useLocation } from "react-router-dom";
import { Home, HardHat, Users, LogOut, Menu,ChevronRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectprogressOpen, setIsProjectprogressOpen] = useState(false); // Track submenu stat
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false); // Track submenu state
  const [isMaterialOpen, setIsMaterialOpen] = useState(false); // Track submenu state


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login", { replace: true }); // Redirect to login
  };
  
  // Define menu items with paths 
  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/site-dashboard" },
    { name: "Project Progress", icon: <HardHat size={20} />, path: "/site-dashboard/project_progress" },
    { name: "Employee", icon: <Users size={20} />, path: "/site-dashboard/employee" },
    { name: "Material", icon: <Layers size={20} />, path: "/site-dashboard/material" },
  ];

const projectprogressSubmenu = [
    { name: "Add Project Progress", icon: <ChevronRight size={18} />, path: "/site-dashboard/project_progress/addprojectprogress" },
    { name: "Project Progress list", icon: <ChevronRight size={18} />, path: "/site-dashboard/project_progress/seeprojectprogresslist" },
  ];

  const employeeSubmenu = [
      { name: "Add Employee", icon: <ChevronRight size={18} />, path: "/site-dashboard/employee/addemployee" },
      { name: "Employees", icon: <ChevronRight size={18} />, path: "/site-dashboard/employee/see_employeelist" },
    ];

    const materialSubmenu = [
        { name: "Add Material", icon: <ChevronRight size={18} />, path: "/site-dashboard/material/addmaterial" },
        { name: "Materials", icon: <ChevronRight size={18} />, path: "/site-dashboard/material/seematerial" },
      ];


  // Extract the active tab from the URL path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find((item) => item.path === currentPath);
    return activeMenuItem ? activeMenuItem.name : ""; // Default to Dashboard
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update activeTab whenever the path changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  // Handle navigation and update URL
  const handleNavigation = (name, path) => {
    if (name === "Project Progress") {
      setIsProjectprogressOpen((prev) => !prev);
    }
    if (name === "Employee") {
      setIsEmployeeOpen((prev) => !prev);
    }
    if (name === "Material") {
      setIsMaterialOpen((prev) => !prev);
    }
    setActiveTab(name);
    navigate(path, { replace: true });
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? "250px" : "80px" }}
        className="bg-sky-800 text-white h-full p-4 flex flex-col gap-4 shadow-lg overflow-y-auto max-h-screen"
      >
        <button
          className="text-white flex items-center gap-2 p-2 rounded-lg bg-sky-950 hover:bg-sky-900"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              <button
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activeTab === item.name ? "bg-sky-900" : "hover:bg-sky-900"
                }`}
                onClick={() => handleNavigation(item.name, item.path)}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.name}</span>}
              </button>

              {/* Toggle submenu when clicking "Project" */}
              {item.name === "Project Progress" && isProjectprogressOpen && (
                <div className="ml-6 flex flex-col gap-2">
                  {projectprogressSubmenu.map((subItem) => (
                    <button
                      key={subItem.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-sky-900"
                      onClick={() => handleNavigation(subItem.name, subItem.path)}
                    >
                      {subItem.icon}
                      {isSidebarOpen && <span>{subItem.name}</span>}
                    </button>
                  ))}
                </div>
              )}

  {/* Toggle submenu when clicking "client" */}
  {item.name === "Material" && isMaterialOpen && (
                <div className="ml-6 flex flex-col gap-2">
                  {materialSubmenu.map((subItem) => (
                    <button
                      key={subItem.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-sky-900"
                      onClick={() => handleNavigation(subItem.name, subItem.path)}
                    >
                      {subItem.icon}
                      {isSidebarOpen && <span>{subItem.name}</span>}
                    </button>
                  ))}
                </div>
              )}


              
  {/* Toggle submenu when clicking "employee" */}
  {item.name === "Employee" && isEmployeeOpen && (
                <div className="ml-6 flex flex-col gap-2">
                  {employeeSubmenu.map((subItem) => (
                    <button
                      key={subItem.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-sky-900"
                      onClick={() => handleNavigation(subItem.name, subItem.path)}
                    >
                      {subItem.icon}
                      {isSidebarOpen && <span>{subItem.name}</span>}
                    </button>
                  ))}
                </div>
              )}

            </div>
          ))}
        </nav>
        <button
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-sky-900"
          onClick={handleLogout}>
         <LogOut size={20} />
             {isSidebarOpen && <span>Logout</span>}
           </button>

      </motion.div>

         {/* Main Content Area */}
      <div className=" ml-[20px] md:ml-[20px]">
        <Outlet /> {/* This renders the active route content */}
      </div>
    </div>
  );
};

export default AdminDashboard;
