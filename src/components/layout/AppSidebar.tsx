
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Wrench, Database, Rss, Settings, Layout } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Prompts Library', path: '/prompts' },
  { icon: Wrench, label: 'Tools Catalog', path: '/tools' },
  { icon: Database, label: 'MCP Repository', path: '/mcp' },
  { icon: Layout, label: 'Workflows', path: '/workflows' },
  { icon: Rss, label: 'AI Intelligence', path: '/intelligence' },
];

const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };
  
  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${collapsed ? 'w-[70px]' : 'w-64'}`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={getNavClass}
                      end={item.path === '/'}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={getNavClass}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
