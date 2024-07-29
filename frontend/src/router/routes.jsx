import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import routes from "./routesInfo";

const MainRoute = () => {
  return (
    <Routes>
      {routes?.map((route) => (
        <Route key={route?.id} path={route?.route} element={route?.component} />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default MainRoute;
