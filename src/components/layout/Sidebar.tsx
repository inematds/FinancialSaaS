import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PieChart,
    Map,
    FolderOpen,
    Globe,
    Settings,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
        { to: '/plan', icon: Map, label: 'Financial Plan' },
        { to: '/documents', icon: FolderOpen, label: 'Documents' },
        { to: '/news', icon: Globe, label: 'Market News' },
    ];

    return (
        <aside className="w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white text-lg">
                        F
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">FinPilot</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                                isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )
                        }
                    >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 w-full rounded-xl transition-colors">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
