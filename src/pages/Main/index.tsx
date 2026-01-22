import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  FolderKanban,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    key: 'articleListManage',
    label: '首页',
    icon: Home,
    path: 'articleListManage',
  },
  {
    key: 'articleEdit',
    label: '资源管理',
    icon: FileText,
    path: 'articleEdit',
  },
  {
    key: 'categoryManage',
    label: '类目管理',
    icon: FolderKanban,
    path: 'categoryManage',
  },
];

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'articleListManage';

  const toggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'border-r border-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <nav className="h-full py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.key;
              return (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border h-16 flex items-center px-4">
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="rounded-lg shadow-sm border border-border p-6 min-h-[360px]">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
          Russell ©2018
        </footer>
      </div>
    </div>
  );
}

export default Index;
