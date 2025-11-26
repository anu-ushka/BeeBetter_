import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User as UserIcon, Mail } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(name, email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md relative z-10 border border-gray-100">
                <div className="text-center mb-8 flex flex-col items-center">
                    {/* Bee with white background container */}
                    <div className="bg-white p-4 rounded-full shadow-md mb-4 border border-gray-50">
                        <img src="/bee-logo.png" alt="BeeBetter Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-400 mt-2">Start building better habits today.</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <UserIcon size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700 transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <span className="text-lg">🔒</span>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700 pr-12 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary text-lg mt-6"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-gray-900 font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
