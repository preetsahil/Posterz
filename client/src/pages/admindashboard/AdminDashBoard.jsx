import React, { useState } from "react";
import "./AdminDashBoard.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Content from "../../components/content/Content";

function AdminDashBoard() {
  const [selectedContent, setSelectedContent] = useState('Home'); 

  const handleSidebarClick = (content) => {
    setSelectedContent(content);
  };
 
  return (
    <div className="AdminDashBoard">
      <Sidebar onSidebarClick={handleSidebarClick} selectedContent={selectedContent}/>
      <Content content={selectedContent}/>
      </div>   
  );
}

export default AdminDashBoard;
