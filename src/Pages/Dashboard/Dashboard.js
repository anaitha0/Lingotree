import React from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Content from "../../components/Content/Content";
import SideCards from "../../components/Sidecard/Sidecards";
import "./Dashboard.css";
import"../../colors.css";
function Dashboard() {
  return (
   
      <div className="main-content">
        <div className="contentside">
           <Content />
        </div>
        <div className="cardside">
          <SideCards/>

        </div>
        </div>
      
    
  );
}

export default Dashboard;
