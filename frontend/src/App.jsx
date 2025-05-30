import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import NavBar from "./NavBar";   
import Home from "./Home";      
import Contacts from "./Contacts";
import NotFound from "./NotFound";  
import Footer from "./Footer";
import AboutUs from "./AboutUs";
import LoginForm from "./LoginForm";
import SitePage from "./SitePage";
import ClientPage from "./ClientPage";
import AdminDashboard from "./AdminDashboard";
import Dashboard from "./Dashboard"
import Project from "./Project";
import Employee from "./Employee";
import Client from "./Client";
import AddProject from "./AddProject"
import AddClient from "./AddClient"
import AddEmployee from "./AddEmployee"
import ProtectedRoute from "./ProtectedRoute"; 
import SeeProjectList from "./SeeProjectList";
import Dashboard2 from "./Dashboard2";
import ProjectProgress from "./ProjectProgress"
import AddProjectProgress from "./AddProjectProgress";
import SeeProjectProgressList from "./SeeProjectProgressList";
import ViewProjectProgress from "./ViewProjectProgress";
import SeeEmployee from "./SeeEmployeeList";
import SeeClientList from "./SeeClientList";
import Employee2 from "./Employee2";
import AddEmployee2 from "./AddEmployee2";
import SeeEmployeeList2 from "./SeeEmployeeList2";
import Material from "./Material";
import AddMaterial from "./AddMaterial";
import SeeMaterial from "./SeeMaterial";
import WorkRequest from "./WorkRequest";
import WorkOrder from "./WorkOrder";
import ForgotPassword from "./ForgotPassword";

const MainLayout = ({ children }) => (
  <div>
    <NavBar />
    {children}
    <Footer />
  </div>
);



const App = () => {
  return (
    
      <Routes>
        {/* Public Pages with NavBar and Footer */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contacts /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginForm /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
       

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
         <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="project" element={<Dashboard />} />
          <Route path="project/addproject" element={<AddProject />} />
          <Route path="project/seeprojectlist" element={<SeeProjectList />} />
          <Route path="project/seeprojectprogress" element={<ViewProjectProgress />} />
          <Route path="employee" element={<Dashboard />} />
          <Route path="employee/addemployee" element={<AddEmployee />} />
          <Route path="employee/employees" element={<SeeEmployee />} />
          <Route path="client" element={<Dashboard />} />
          <Route path="client/addclient" element={<AddClient />} />
          <Route path="client/clients" element={<SeeClientList />} />
          <Route path="workrequest" element={<WorkRequest />} />
          

        </Route> 
        </Route>
        

        {/* Protected Site Contractor Route */}
        <Route element={<ProtectedRoute allowedRoles={["site_contractor"]} />}>
          <Route path="/site-dashboard" element={<SitePage />} >
          <Route index element={<Dashboard2 />} />
          <Route path="project_progress" element={<Dashboard2 />} />
          <Route path="project_progress/addprojectprogress" element={<AddProjectProgress />} />
          <Route path="project_Progress/seeprojectprogresslist" element={<SeeProjectProgressList />} />
          <Route path="employee" element={<Dashboard2 />} />
          <Route path="employee/addemployee" element={<AddEmployee2 />} />
          <Route path="employee/see_employeelist" element={<SeeEmployeeList2 />} />
          <Route path="material" element={<Dashboard2 />} />
          <Route path="material/addmaterial" element={<AddMaterial/>} />
          <Route path="material/seematerial" element={<SeeMaterial/>} /> 
          <Route path="workorder" element={<WorkOrder />} />
        </Route>
        </Route>

        {/* Protected Client Route */}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/client-dashboard" element={<ClientPage />} />
  
        </Route>
        

        {/* 404 Page */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
   
  );
};

export default App;
