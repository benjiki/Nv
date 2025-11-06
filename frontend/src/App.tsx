// import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import RegForm from "./pages/Auth/Reg";
import { GuestRoute, PrivateRoute } from "./PageGuards";
import { Toaster } from "sonner";

import Home from "./pages/main/home";
import LoginForm from "./pages/Auth/Login";
function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("/api/hello")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
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
