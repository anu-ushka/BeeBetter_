import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Search, Filter, ArrowUpDown, X, ChevronLeft, ChevronRight, Edit2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Journal = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moodFilter, setMoodFilter] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [showModal, setShowModal] = useState(false);
    const [editingJournal, setEditingJournal] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 6;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood: 'Neutral',
        tags: ''
    });

    const fetchJournals = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    search,
                    mood: moodFilter || undefined,
                    sort,
                    page,
                    limit: LIMIT
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/journals`, config);
            setJournals(data.journals);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [user, moodFilter, search, sort, page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t)
            };

            if (editingJournal) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/journals/${editingJournal._id}`,
                    payload,
                    config
                );
            } else {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/journals`,
                    payload,
                    config
                );
            }

            closeModal();
            fetchJournals();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteJournal = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/journals/${id}`, config);
            fetchJournals();
        } catch (error) {
            console.error(error);
        }
    };

    const openModal = (journal = null) => {
        if (journal) {
            setEditingJournal(journal);
            setFormData({
                title: journal.title,
                content: journal.content,
                mood: journal.mood,
                tags: journal.tags.join(', ')
            });
        } else {
            setEditingJournal(null);
            setFormData({
                title: '',
                content: '',
                mood: 'Neutral',
                tags: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingJournal(null);
        setFormData({
            title: '',
            content: '',
            mood: 'Neutral',
            tags: ''
        });
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const getMoodColor = (mood) => {
        switch (mood) {
            case 'Happy': return 'bg-green-100 text-green-800';
            case 'Sad': return 'bg-blue-100 text-blue-800';
            case 'Excited': return 'bg-yellow-100 text-yellow-800';
            case 'Angry': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/50 rounded-full transition"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                Your Journal <BookOpen className="text-primaryHover" size={32} />
                            </h1>
                            <p className="text-gray-400 font-medium">
                                Reflect on your journey.
                            </p>
                        </div>
                    </div>

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
                        <select
                            className="p-2 bg-transparent text-sm text-gray-500 focus:outline-none cursor-pointer"
                            value={moodFilter}
                            onChange={(e) => setMoodFilter(e.target.value)}
                        >
                            <option value="">All Moods</option>
                            <option value="Happy">Happy</option>
                            <option value="Excited">Excited</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Sad">Sad</option>
                            <option value="Angry">Angry</option>
                        </select>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <button
                            className="p-2 hover:bg-gray-50 rounded-full text-gray-500 transition"
                            onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
                            title={sort === 'newest' ? 'Newest First' : 'Oldest First'}
                        >
                            <ArrowUpDown size={18} />
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading journals...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {journals.map((journal) => (
                            <div key={journal._id} className="bg-[#FFFFF8] border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col h-64 relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{journal.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMoodColor(journal.mood)}`}>
                                        {journal.mood}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-4 mb-4 flex-grow">
                                    {journal.content}
                                </p>

                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex gap-2 overflow-hidden">
                                        {journal.tags.map((tag, idx) => (
                                            <span key={idx} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md whitespace-nowrap">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(journal.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Actions (Visible on Hover) */}
                                <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 flex gap-2 transition bg-[#FFFFF8] pl-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(journal); }}
                                        className="text-gray-400 hover:text-blue-500 transition"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteJournal(journal._id); }}
                                        className="text-gray-400 hover:text-red-400 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {journals.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-400 mb-4">No journal entries found.</p>
                                <button
                                    onClick={() => openModal()}
                                    className="text-primaryHover font-bold hover:underline"
                                >
                                    Write your first entry
                                </button>
                            </div>
                        )}
                    </div>
                )}


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

            <button
                onClick={() => openModal()}
                className="fixed bottom-8 right-8 bg-primary hover:bg-primaryHover text-gray-900 p-4 rounded-full shadow-lg transition transform hover:scale-105"
            >
                <Plus size={28} />
            </button>


            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-900">
                            {editingJournal ? 'Edit Entry' : 'New Entry'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 h-32 resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
                                        value={formData.mood}
                                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                    >
                                        <option>Happy</option>
                                        <option>Excited</option>
                                        <option>Neutral</option>
                                        <option>Sad</option>
                                        <option>Angry</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. personal, work"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-gray-900 font-bold py-3 rounded-xl hover:bg-primaryHover transition mt-4"
                            >
                                {editingJournal ? 'Update Entry' : 'Save Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Journal;
