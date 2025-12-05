import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-transparent relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 p-6 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                    <img src="/bee-logo.png" alt="BeeBetter Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">BeeBetter</span>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">

                {/* Animated Bee Logo */}
                <div className="mb-8 relative">
                    {/* White background container for the bee */}
                    <div className="bg-white p-6 rounded-full shadow-xl animate-fly relative z-10">
                        <img src="/bee-logo.png" alt="BeeBetter Logo" className="w-32 h-32 object-contain" />
                    </div>
                    {/* Decorative blob behind */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary opacity-20 rounded-full blur-3xl -z-10"></div>
                </div>

                {/* Heading */}
                <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
                    BeeBetter
                </h1>

                {/* Subheading */}
                <p className="text-gray-600 text-xl mb-12 font-medium max-w-lg mx-auto leading-relaxed">
                    Build Better Habits. Stay Consistent. <br />
                    <span className="text-gray-500 text-lg">Track your journey one day at a time.</span>
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
                    <Link
                        to="/signup"
                        className="btn-primary text-center flex-1"
                    >
                        Sign Up
                    </Link>
                    <Link
                        to="/login"
                        className="btn-secondary text-center flex-1"
                    >
                        Log In
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-6 text-center text-gray-400 text-sm">
            </footer>
        </div>
    );
};

export default Home;
