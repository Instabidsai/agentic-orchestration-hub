
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BellDot } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import ThemeToggle from '../ui/theme-toggle';

const Navbar: React.FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex h-16 items-center px-4">
        <SidebarTrigger className="mr-2" />
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-instabids-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold">IB</span>
            </div>
            <span className="font-bold text-lg hidden md:inline-block">InstaBids</span>
          </Link>
        </div>
        
        <div className="md:w-96 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search across all resources..."
              className="w-full bg-background pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center ml-auto gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="relative">
            <BellDot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Alex Johnson</p>
                  <p className="text-xs leading-none text-muted-foreground">alex.johnson@instabids.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
