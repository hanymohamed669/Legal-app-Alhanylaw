import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/hooks/useAuth';
import { UserRole } from '../types';
import { DashboardIcon, CaseIcon, CalendarIcon, TaskIcon, TeamIcon, LogoutIcon, GavelIcon, ChevronDownIcon, BellIcon, ClockIcon, UsersIcon, ArchiveIcon, SearchIcon } from './icons';
import { useNotifications } from '../services/hooks/useNotifications';

type NavItemProps = {
  to: string;
  icon: React.ReactElement<{ className?: string }>;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to === '/calendar' && location.pathname.startsWith('/sessions'));
  
    return (
        <NavLink
            to={to}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-primary-dark text-white'
                : 'text-gray-300 hover:bg-primary-dark/50 hover:text-white'
            }`}
        >
            <span className="ml-3">{label}</span>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </NavLink>
    );
};


const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const canManageTeam = user?.role === UserRole.ADMIN || user?.role === UserRole.PARTNER;

    return (
        <div className="flex flex-col w-64 bg-primary text-on-primary">
            <div className="flex items-center justify-center h-20 border-b border-primary-light/20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">إدارة قانونية</h1>
                    <p className="font-serif text-sm text-secondary tracking-widest">ALHANYLAW</p>
                </div>
                <GavelIcon className="w-8 h-8 text-secondary mr-3" />
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavItem to="/" icon={<DashboardIcon />} label="لوحة التحكم" />
                <NavItem to="/cases" icon={<CaseIcon />} label="القضايا" />
                <NavItem to="/archive" icon={<ArchiveIcon />} label="الأرشيف" />
                <NavItem to="/calendar" icon={<CalendarIcon />} label="التقويم" />
                <NavItem to="/clients" icon={<UsersIcon />} label="العملاء" />
                {user?.role !== UserRole.CLIENT && (
                    <NavItem to="/tasks" icon={<TaskIcon />} label="المهام" />
                )}
                 {canManageTeam && (
                    <NavItem to="/team" icon={<TeamIcon />} label="الفريق" />
                )}
            </nav>
            <div className="p-4 border-t border-primary-light/20">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-primary-dark/50 hover:text-white transition-colors duration-200"
                >
                    <span className="ml-3">تسجيل الخروج</span>
                    <LogoutIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const NotificationBell: React.FC = () => {
    const { notifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-500 hover:text-primary">
                <BellIcon className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-surface"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-surface rounded-lg shadow-xl py-1 z-20">
                    <div className="font-bold text-sm text-gray-700 px-4 py-2 border-b">الإشعارات</div>
                    {notifications.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto">
                            {notifications.map(n => (
                                <li key={n.id} className="px-4 py-3 hover:bg-gray-100 border-b last:border-b-0">
                                    <p className="text-sm text-gray-800 font-medium">{n.message}</p>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <ClockIcon className="w-3 h-3 ml-1" />
                                        <span>{n.timeUntil} {n.session && `في ${new Date(n.session.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center p-4">لا توجد إشعارات جديدة.</p>
                    )}
                </div>
            )}
        </div>
    );
}

const Header: React.FC = () => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const targetPath = location.pathname.startsWith('/archive') ? '/archive' : '/cases';
        navigate(`${targetPath}?search=${encodeURIComponent(searchQuery)}`);
    };

    if (!user) return null;

    return (
        <header className="bg-surface h-20 flex items-center justify-between px-8 shadow-sm">
             <div className="flex-1 max-w-lg">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="بحث شامل في القضايا والأرشيف..."
                            className="w-full pl-4 pr-10 py-2 border rounded-full bg-background focus:ring-primary-light focus:border-primary-light"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </form>
             </div>
             <div className="flex items-center space-x-6 space-x-reverse">
                <NotificationBell />
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-3">
                        <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div className="text-right">
                            <div className="text-sm font-semibold text-on-surface">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-10">
                            <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right">الملف الشخصي</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const getGradientClass = () => {
    const { pathname } = location;
    // Cases (القضايا): gradient with dark blue and silver
    if (pathname.startsWith('/cases')) return 'bg-gradient-to-br from-primary to-slate-400';
    // Archive (الأرشيف): gradient with grey and light brown
    if (pathname.startsWith('/archive')) return 'bg-gradient-to-br from-slate-600 to-stone-500';
    // Clients (الموكلين): gradient with teal and light blue
    if (pathname.startsWith('/clients')) return 'bg-gradient-to-br from-teal-600 to-sky-400';
    // Calendar (التقويم): gradient with purple and light grey
    if (pathname.startsWith('/calendar')) return 'bg-gradient-to-br from-purple-600 to-slate-400';
    // Team (الفريق): gradient with dark green and soft grey
    if (pathname.startsWith('/team')) return 'bg-gradient-to-br from-green-700 to-slate-500';
    // Tasks (المهام)
    if (pathname.startsWith('/tasks')) return 'bg-gradient-to-br from-slate-700 to-slate-500';
    
    // Default for Dashboard and others
    return 'bg-gradient-to-br from-slate-50 to-slate-200';
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-8 ${getGradientClass()}`}>
            {children}
        </main>
      </div>
      <Sidebar />
    </div>
  );
};

export default Layout;