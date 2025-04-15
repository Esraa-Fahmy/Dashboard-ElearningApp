import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyCode";
import AdminLayout from "./layout/AdminLayout"; // ✅ إضافة
import DashboardHome from "./pages/DashboardHome"; // ✅ إضافة
import Users from "./pages/User";
import EditUser from "./pages/EditUser";
import Categories from "./pages/Categories";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import SubCategories from "./pages/SubCategories";
import CreateSubCategory from "./pages/CreateSubCategory";
import EditSubCategory from "./pages/EditSubCategory";
import AccountSettings from "./pages/Account";
import CreateUser from "./pages/CreateUser";
import AllStories from "./pages/StoriesPage";
import AddStory from "./pages/AddStory";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes الخاصة بالتسجيل وتسجيل الدخول */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-reset-code" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  {/* الصفحة الرئيسية للـ dashboard */}
  <Route index element={<DashboardHome />} />
  
  {/* صفحة عرض المستخدمين */}
  <Route path="users" element={<Users />} />
  
  {/* صفحة تعديل مستخدم */}
  <Route path="users/:id/edit" element={<EditUser />} />
  <Route path="/dashboard/users/create" element={<CreateUser />} />

  {/* يمكن إضافة المزيد من الـ routes هنا مثل Categories, Products... */}
  <Route path="categories" element={<Categories />} />
  <Route path="/dashboard/categories/create" element={<CreateCategory />} />
  <Route path="/dashboard/categories/:id/edit" element={<EditCategory />} />

  {/* إضافة الـ SubCategories */}
  <Route path="subcategories" element={<SubCategories />} />
  <Route path="/dashboard/subcategories/create" element={<CreateSubCategory />} />
  <Route path="/dashboard/subcategories/:id/edit" element={<EditSubCategory />} />
  
  <Route path="my-account" element={<AccountSettings />} />
  
  <Route path="stories" element={<AllStories />} />
  <Route path="/dashboard/stories/add-story" element={<AddStory />} />
</Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
