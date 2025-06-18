import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  if (!localStorage.getItem("accessToken")) {
    window.location.href = "/login";
  }

  return (
    <div className="max-w-[1024px] mx-auto">
      <div className="flex justify-center flex-col lg:flex-row">
        <div className="bg-gray-800 hidden lg:block px-5 min-w-[250px]">
          <UserMenu />
        </div>
        <section className="w-full">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
