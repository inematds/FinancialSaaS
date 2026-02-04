import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-accent-blue clip-parallelogram flex items-center justify-center font-mono font-extrabold text-2xl text-bg-primary">
                        F
                    </div>
                    <span className="font-mono font-extrabold text-2xl tracking-tight">FinPilot</span>
                </div>

                {/* Login Card */}
                <div className="bg-bg-secondary border-[3px] border-border-color p-8 clip-top-right">
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-text-secondary mb-8">Sign in to your command center</p>

                    {error && (
                        <div className="bg-accent-red/10 border border-accent-red text-accent-red p-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-tertiary border-2 border-border-color p-4 text-white focus:border-accent-green focus:outline-none transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-tertiary border-2 border-border-color p-4 text-white focus:border-accent-green focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-accent-green text-bg-primary font-bold text-sm uppercase tracking-wider clip-button hover:bg-accent-blue transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent-blue hover:text-accent-green transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
