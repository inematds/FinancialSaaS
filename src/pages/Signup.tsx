import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, fullName);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
                <div className="w-full max-w-md text-center">
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-2xl font-bold mb-4">Account Created!</h1>
                    <p className="text-text-secondary mb-6">
                        Check your email for a confirmation link. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

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

                {/* Signup Card */}
                <div className="bg-bg-secondary border-[3px] border-border-color p-8 clip-top-right">
                    <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                    <p className="text-text-secondary mb-8">Start your financial journey</p>

                    {error && (
                        <div className="bg-accent-red/10 border border-accent-red text-accent-red p-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-bg-tertiary border-2 border-border-color p-4 text-white focus:border-accent-green focus:outline-none transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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

                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent-blue hover:text-accent-green transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
