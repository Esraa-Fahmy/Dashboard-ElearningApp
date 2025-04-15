import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // استخدام useNavigate للتوجيه
  const items = [
    { text: "Home", path: "/dashboard" },
    { text: "Categories", path: "/dashboard/categories" },
    { text: "SubCategories", path: "/dashboard/subcategories" },
    { text: "Stories", path: "/dashboard/stories" },
    { text: "Users", path: "/dashboard/users" },
    { text: "My Account", path: "/dashboard/my-account" },
    { text: "Logout", path: "/" }, // رابط الخروج سيكون خاص
  ];

  // دالة لتسجيل الخروج
  const handleLogout = () => {
    // مسح التوكن من localStorage
    localStorage.removeItem('token');

    // توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate('/');
  };

  return (
    <List sx={{ paddingTop: 6 }}>
      {items.map((item, index) => (
        <ListItem
          button
          key={index}
          onClick={item.text === "Logout" ? handleLogout : null} // إضافة تنفيذ دالة الخروج
          component={item.text !== "Logout" ? Link : "div"} // جعل الخروج بدون رابط
          to={item.text !== "Logout" ? item.path : null} // التوجيه إلا إذا كانت logout
          sx={{ color: "white" }}
        >
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{ fontWeight: "bold", color: "white" }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
