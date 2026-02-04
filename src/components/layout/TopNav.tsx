import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/goals', label: 'Goals' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/documents', label: 'Documents' },
    { to: '/news', label: 'Market' },
];

export default function TopNav() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // Get user initials from email or metadata
    const getInitials = () => {
        const name = user?.user_metadata?.full_name || user?.email || '';
        if (name.includes('@')) {
            return name.slice(0, 2).toUpperCase();
        }
        return name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';
    };

    return (
        <nav className="bg-bg-secondary border-b-[3px] border-border-color sticky top-0 z-50 clip-nav">
            <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-4 py-6">
                    <div className="w-10 h-10 bg-accent-blue clip-parallelogram flex items-center justify-center font-mono font-extrabold text-xl text-bg-primary">
                        F
                    </div>
                    <span className="font-mono font-extrabold text-xl tracking-tight">FinPilot</span>
                </div>

                {/* Nav Links */}
                <ul className="flex list-none">
                    {navLinks.map((link) => (
                        <li key={link.to} className="relative">
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `block px-6 py-8 text-sm font-semibold uppercase tracking-wider border-l border-border-color transition-all
                  ${isActive
                                        ? 'bg-bg-primary text-accent-green'
                                        : 'text-text-secondary hover:bg-bg-primary hover:text-accent-green'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-green" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* User Section */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold">{user?.user_metadata?.full_name || 'User'}</div>
                        <div className="text-xs text-text-secondary">{user?.email}</div>
                    </div>
                    <div
                        className="w-9 h-9 bg-accent-blue clip-parallelogram-sm flex items-center justify-center font-mono font-bold text-sm cursor-pointer hover:bg-accent-green transition-colors"
                        title={user?.email}
                    >
                        {getInitials()}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm text-text-secondary hover:text-accent-red transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
