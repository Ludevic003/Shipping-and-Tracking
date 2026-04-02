import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, LogOut, LayoutDashboard, Menu, ChevronDown, ShieldAlert, FileText, HelpCircle, MessageSquare as MessageSquareWarning } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = React.memo(() => {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors duration-200 hover:text-primary nav-link-animated ${
          isActive('/') ? 'text-primary active' : 'text-muted-foreground'
        }`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`text-sm font-medium transition-colors duration-200 hover:text-primary nav-link-animated ${
          isActive('/about') ? 'text-primary active' : 'text-muted-foreground'
        }`}
      >
        About Us
      </Link>
      <Link 
        to="/contact" 
        className={`text-sm font-medium transition-colors duration-200 hover:text-primary nav-link-animated ${
          isActive('/contact') ? 'text-primary active' : 'text-muted-foreground'
        }`}
      >
        Contact Us
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary outline-none nav-link-animated">
          Support <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/faq" className="cursor-pointer flex items-center w-full">
              <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
              FAQ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/complaint-submission" className="cursor-pointer flex items-center w-full">
              <MessageSquareWarning className="w-4 h-4 mr-2 text-muted-foreground" />
              Submit Complaint
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/terms" className="cursor-pointer flex items-center w-full">
              <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
              Terms of Service
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/insurance" className="cursor-pointer flex items-center w-full">
              <ShieldAlert className="w-4 h-4 mr-2 text-muted-foreground" />
              Insurance Policy
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link 
        to="/#track" 
        className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary nav-link-animated"
      >
        Track Shipment
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-none tracking-tight">US Box</span>
              <span className="text-[10px] font-medium text-muted-foreground leading-none mt-1 tracking-wide uppercase">Mail Services</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />

            <div className="w-px h-5 bg-border/50 mx-2"></div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-200 rounded-full px-4">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="transition-all duration-200 rounded-full px-6 shadow-sm hover:shadow">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to={isAdmin ? "/admin" : "/client-dashboard"}>
                  <Button variant="secondary" size="sm" className="transition-all duration-200 rounded-full px-4">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="transition-all duration-200 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col gap-8 pt-16 bg-background/95 backdrop-blur-xl border-l border-border/50">
                <div className="flex flex-col gap-6">
                  <NavLinks />
                </div>
                <div className="border-t border-border/50 pt-8 flex flex-col gap-4">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full justify-start">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/signup" className="w-full">
                        <Button className="w-full justify-start">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={isAdmin ? "/admin" : "/client-dashboard"} className="w-full">
                        <Button variant="secondary" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;