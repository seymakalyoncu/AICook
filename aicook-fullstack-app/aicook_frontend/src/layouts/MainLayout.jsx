import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-full mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}