import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Final_store_inventory_report from "./pages/Final_store_inventory_report";

export default function App() {
  
  return (
    
        <Routes>
          <Route path="/smart-final-store-inventory/" element={<Login />} />
          <Route path="/smart-final-store-inventory/login" element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/smart-final-store-inventory/home" element={<Navbar />} />
              <Route path="/smart-final-store-inventory/fin_store_inventory_report" element={<Final_store_inventory_report />}/>
            </Route>
        </Routes>
  );
}
