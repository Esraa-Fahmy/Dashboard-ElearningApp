import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";

const drawerWidth = 220;

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://app.balady-sa.pro/api/v1/user/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(res.data.data);
      } catch (error) {
        console.error("فشل تحميل بيانات الأدمن:", error);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: isSidebarOpen ? `${drawerWidth}px` : "0px",
          transition: "width 0.3s ease",
          backgroundColor: "#1976d2",
          color: "#fff",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        {isSidebarOpen && <Sidebar />}
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1976d2",
            color: "#fff",
            height: "64px",
            px: 2,
          }}
        >
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          لوحة تحكم احترف الانجليزية
          </Typography>

          {admin && (
            <Avatar alt={admin.userName} src={admin.profileImg} />
          )}
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#f4f4f4",
            overflowY: "auto",
            padding: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
