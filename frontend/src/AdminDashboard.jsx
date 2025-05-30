import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Home, HardHat, Users, LogOut, Menu, PlusCircle,ChevronRight, FolderOpen, BarChart2, } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [isProjectOpen, setIsProjectOpen] = useState(false); // Track submenu state
  const [isClientOpen, setIsClientOpen] = useState(false); // Track submenu state
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false); // Track submenu state

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin-dashboard" },
    { name: "Project", icon: <HardHat size={20} />, path: "/admin-dashboard/project" },
    { name: "Client", icon: <Users size={20} />, path: "/admin-dashboard/client" },
    { name: "Employee", icon: <Users size={20} />, path: "/admin-dashboard/employee" },
  ];

  const projectSubmenu = [
    { name: "Add Project", icon: <ChevronRight size={18} />, path: "/admin-dashboard/project/addproject" },
    { name: "Projects", icon: <ChevronRight size={18} />, path: "/admin-dashboard/project/seeprojectlist" },
    { name: "Project Progress", icon: <ChevronRight size={18} />, path: "/admin-dashboard/project/seeprojectprogress" },
  ];

  const clientSubmenu = [
    { name: "Add Client", icon: <ChevronRight size={18} />, path: "/admin-dashboard/client/addclient" },
    { name: "Clients", icon: <ChevronRight size={18} />, path: "/admin-dashboard/client/clients" },
    
  ];

  const employeeSubmenu = [
    { name: "Add Employee", icon: <ChevronRight size={18} />, path: "/admin-dashboard/employee/addemployee" },
    { name: "Employees", icon: <ChevronRight size={18} />, path: "/admin-dashboard/employee/employees" },
  
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find((item) => item.path === currentPath);
    return activeMenuItem ? activeMenuItem.name : "";
  };

  const handleNavigation = (name, path) => {
    if (name === "Project") {
      setIsProjectOpen((prev) => !prev);
    }
    if (name === "Client") {
      setIsClientOpen((prev) => !prev);
    }
    if (name === "Employee") {
      setIsEmployeeOpen((prev) => !prev);
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
              {item.name === "Project" && isProjectOpen && (
                <div className="ml-6 flex flex-col gap-2">
                  {projectSubmenu.map((subItem) => (
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
  {item.name === "Client" && isClientOpen && (
                <div className="ml-6 flex flex-col gap-2">
                  {clientSubmenu.map((subItem) => (
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
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-sky-900 "
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="ml-[20px] md:ml-[20px]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
