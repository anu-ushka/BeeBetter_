import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, Trash2, Search, Filter, ArrowUpDown, Flame, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 6; // As requested by user

    // Add Habit Form State
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState('Health');

    const fetchHabits = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    search,
                    status: filter !== 'all' ? filter : undefined,
                    page,
                    limit: LIMIT
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits`, config);
            setHabits(data.habits);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [user, filter, search, page]); 

    const addHabit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/habits`,
                { name: newHabitName, category: newHabitCategory },
                config
            );
            setNewHabitName('');
            setShowAddModal(false);
            fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleHabit = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const habit = habits.find(h => h._id === id);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isCompletedToday = habit.completedDates.some(d => new Date(d).setHours(0, 0, 0, 0) === today.getTime());

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/habits/${id}`,
                { completed: !isCompletedToday },
                config
            );
            fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHabit = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits/${id}`, config);
            fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    const isCompletedToday = (habit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return habit.completedDates.some(d => new Date(d).setHours(0, 0, 0, 0) === today.getTime());
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="min-h-screen bg-transparent relative font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            Hey {user.name.split(' ')[0]} <span className="text-3xl">👋</span> Keep Growing!
                        </h1>
                        <p className="text-gray-400 font-medium">
                            "You are a little bit better than you were yesterday."
                        </p>
                        <a href="/journal" className="text-primaryHover font-bold hover:underline mt-2 inline-block">
                            Go to Journal &rarr;
                        </a>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center bg-white p-2 rounded-full shadow-sm border border-gray-100">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-transparent focus:outline-none text-sm w-32 md:w-48 text-gray-700"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 transition">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 transition">
                            <ArrowUpDown size={18} />
                        </button>
                    </div>
                </header>

                {/* Habits Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading habits...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {habits.map((habit) => {
                            const completed = isCompletedToday(habit);
                            return (
                                <div key={habit._id} className="bg-[#FFFFF8] border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-48 relative group">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{habit.name}</h3>
                                        <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full text-xs">
                                            <Flame size={14} fill="currentColor" />
                                            <span>{habit.streak}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">{habit.category}</span>
                                    </div>

                                    <button
                                        onClick={() => toggleHabit(habit._id)}
                                        className={`w-full mt-4 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${completed
                                            ? 'bg-green-400 text-white shadow-green-200 shadow-lg'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {completed ? 'Done Today!' : 'Mark as Done'}
                                    </button>

                                    {/* Delete Button (Visible on Hover) */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteHabit(habit._id); }}
                                        className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Empty State */}
                        {habits.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-400 mb-4">No habits found.</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="text-primaryHover font-bold hover:underline"
                                >
                                    Create your first habit
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="p-2 text-gray-400 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <span className="bg-primary text-gray-900 font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
                            {page}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className="p-2 text-gray-400 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 bg-primary hover:bg-primaryHover text-gray-900 p-4 rounded-full shadow-lg transition transform hover:scale-105"
            >
                <Plus size={28} />
            </button>

            {/* Add Habit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-900">New Habit</h2>

                        <form onSubmit={addHabit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Read for 15 mins"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
                                    value={newHabitCategory}
                                    onChange={(e) => setNewHabitCategory(e.target.value)}
                                >
                                    <option>Health</option>
                                    <option>Productivity</option>
                                    <option>Mindfulness</option>
                                    <option>Learning</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-gray-900 font-bold py-3 rounded-xl hover:bg-primaryHover transition mt-4"
                            >
                                Create Habit
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
