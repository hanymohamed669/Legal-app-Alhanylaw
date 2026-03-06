
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/hooks/useAuth';
import { UserRole } from '../types';
import { DashboardIcon, CaseIcon, CalendarIcon, TaskIcon, TeamIcon, LogoutIcon, GavelIcon, ChevronDownIcon, BellIcon, ClockIcon, UsersIcon, ArchiveIcon, SearchIcon } from './icons';
import { useNotifications } from '../services/hooks/useNotifications';
import { Menu, X } from 'lucide-react';

type NavItemProps = {
  to: string;
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to === '/calendar' && location.pathname.startsWith('/sessions'));
  
    return (
        <NavLink
            to={to}
            onClick={onClick}
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


const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const canManageTeam = user?.role === UserRole.ADMIN || user?.role === UserRole.PARTNER;

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            
            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 right-0 w-64 bg-primary text-on-primary z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <div className="flex items-center justify-between h-20 px-4 border-b border-primary-light/20">
                    <div className="flex items-center">
                        <GavelIcon className="w-8 h-8 text-secondary ml-3" />
                        <div className="text-right">
                            <h1 className="text-xl font-bold">إدارة قانونية</h1>
                            <p className="font-serif text-xs text-secondary tracking-widest">ALHANYLAW</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-white hover:text-secondary">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem to="/" icon={<DashboardIcon />} label="لوحة التحكم" onClick={onClose} />
                    <NavItem to="/cases" icon={<CaseIcon />} label="القضايا" onClick={onClose} />
                    <NavItem to="/archive" icon={<ArchiveIcon />} label="الأرشيف" onClick={onClose} />
                    <NavItem to="/calendar" icon={<CalendarIcon />} label="التقويم" onClick={onClose} />
                    <NavItem to="/clients" icon={<UsersIcon />} label="العملاء" onClick={onClose} />
                    {user?.role !== UserRole.CLIENT && (
                        <NavItem to="/tasks" icon={<TaskIcon />} label="المهام" onClick={onClose} />
                    )}
                    {canManageTeam && (
                        <NavItem to="/team" icon={<TeamIcon />} label="الفريق" onClick={onClose} />
                    )}
                </nav>
                <div className="p-4 border-t border-primary-light/20">
                    <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-primary-dark/50 hover:text-white transition-colors duration-200"
                    >
                        <span className="ml-3">تسجيل الخروج</span>
                        <LogoutIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
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
                    <div className="font-bold text-sm text-gray-700 px-4 py-2 border-b text-right">الإشعارات</div>
                    {notifications.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto">
                            {notifications.map(n => (
                                <li key={n.id} className="px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 text-right">
                                    <p className="text-sm text-gray-800 font-medium">{n.message}</p>
                                    <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                                        <span>{n.timeUntil} {n.session && `في ${new Date(n.session.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`}</span>
                                        <ClockIcon className="w-3 h-3 mr-1" />
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

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
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
        <header className="bg-surface h-20 flex items-center justify-between px-4 lg:px-8 shadow-sm z-30">
             <div className="flex items-center flex-1 max-w-lg">
                <button onClick={onMenuClick} className="lg:hidden p-2 ml-2 text-gray-600 hover:text-primary">
                    <Menu className="w-6 h-6" />
                </button>
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="بحث شامل..."
                            className="w-full pl-4 pr-10 py-2 border rounded-full bg-background focus:ring-primary-light focus:border-primary-light text-right"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </form>
             </div>
             <div className="flex items-center space-x-4 lg:space-x-6 space-x-reverse">
                <NotificationBell />
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-3 space-x-reverse">
                        <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-semibold text-on-surface">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getGradientClass = () => {
    const { pathname } = location;
    if (pathname.startsWith('/cases')) return 'bg-gradient-to-br from-primary to-slate-400';
    if (pathname.startsWith('/archive')) return 'bg-gradient-to-br from-slate-600 to-stone-500';
    if (pathname.startsWith('/clients')) return 'bg-gradient-to-br from-teal-600 to-sky-400';
    if (pathname.startsWith('/calendar')) return 'bg-gradient-to-br from-purple-600 to-slate-400';
    if (pathname.startsWith('/team')) return 'bg-gradient-to-br from-green-700 to-slate-500';
    if (pathname.startsWith('/tasks')) return 'bg-gradient-to-br from-slate-700 to-slate-500';
    return 'bg-gradient-to-br from-slate-50 to-slate-200';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 ${getGradientClass()}`}>
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
