import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import RegForm from "./pages/Auth/Reg";
import { GuestRoute, PrivateRoute } from "./PageGuards";
import { Toaster } from "sonner";

import Home from "./pages/main/home";
import LoginForm from "./pages/Auth/Login";
import AccountHolders from "./pages/main/accontHolders/accountHolders";
import Layout from "./pages/main/layout";
import PageWrapper from "./components/PageWrapper";
import CreateAccHolder from "./pages/main/accontHolders/createAccHolder";
import EditAccHolder from "./pages/main/accontHolders/editAccHolder";
import AccountMangement from "./pages/main/accountManagement/accountMangement";
import Deposit from "./pages/main/accountManagement/deposit";
import Transfer from "./pages/main/accountManagement/transfer";
import Loan from "./pages/main/accountManagement/loan";
import Repayment from "./pages/main/accountManagement/repayment";

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountholders"
                element={
                  <PageWrapper>
                    <AccountHolders />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountholders/create"
                element={
                  <PageWrapper>
                    <CreateAccHolder />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountholders/edit/:id"
                element={
                  <PageWrapper>
                    <EditAccHolder />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountmanagment"
                element={
                  <PageWrapper>
                    <AccountMangement />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountmanagment/deposit/"
                element={
                  <PageWrapper>
                    <Deposit />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountmanagment/transfer"
                element={
                  <PageWrapper>
                    <Transfer />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountmanagment/loan"
                element={
                  <PageWrapper>
                    <Loan />
                  </PageWrapper>
                }
              />
              <Route
                path="/accountmanagment/repayment"
                element={
                  <PageWrapper>
                    <Repayment />
                  </PageWrapper>
                }
              />
            </Route>
          </Route>

          {/* Guest Routes */}
          <Route element={<GuestRoute />}>
            <Route
              path="/auth/reg"
              element={
                <PageWrapper>
                  <RegForm />
                </PageWrapper>
              }
            />
            <Route
              path="/auth/login"
              element={
                <PageWrapper>
                  <LoginForm />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>

      <Toaster />
    </>
  );
}

export default App;
