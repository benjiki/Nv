import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const Navigation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove tokens from storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.setQueryData(["auth"], null);

    navigate("/auth/login");
  };
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/">
              <Home />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* Account Holders */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Account Holders</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 md:w-[300px] lg:w-[400px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/accountholders"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      Overview
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      View and manage all account holders.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/accountholders/create"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      Create New Account Holder
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      Create a new account holder record.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Account Management */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Account Management</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-4">
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md"
                  >
                    <div className="mb-2 text-lg font-medium">
                      Transaction b/n accounts
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      this is where you make transactions like lend ,deposite
                      transfer ....
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/deposite"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      Deposite
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      Add fund to your account
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/transfer"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      Transfer
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      normal transaction with out debt ....
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/loan"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">Loan</div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      this is where u make the loan transaction...
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/repayment"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      Repayment
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      this is where you make the repayment...
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Users */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Users</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 md:w-[300px] lg:w-[400px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/users/list"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      User List
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      Browse and manage all users in the system.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/users/settings"
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                  >
                    <div className="text-sm font-medium leading-none">
                      User Settings
                    </div>
                    <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                      Configure user preferences and roles.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={handleLogout}
                    className="block select-none rounded-md p-3 leading-tight no-underline outline-hidden transition-colors hover:bg-destructive/35 hover:text-accent-foreground focus:shadow-md"
                  >
                    Logout
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      {/* ✅ Required for correct dropdown positioning */}
      <NavigationMenuViewport />
    </NavigationMenu>
  );
};

export default Navigation;
