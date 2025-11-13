// import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import RegForm from "./pages/Auth/Reg";
import { GuestRoute, PrivateRoute } from "./PageGuards";
import { Toaster } from "sonner";

import Home from "./pages/main/home";
import LoginForm from "./pages/Auth/Login";
import AccountHolders from "./pages/main/accountHolders";
import Layout from "./pages/main/layout";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/accountholders" element={<AccountHolders />} />
          </Route>
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/auth/reg" element={<RegForm />} />
          <Route path="/auth/login" element={<LoginForm />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
