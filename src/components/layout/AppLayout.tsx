
import React from 'react';
import { SidebarProvider } from '../ui/sidebar';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex flex-1 min-h-0 w-full">
          <AppSidebar />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
