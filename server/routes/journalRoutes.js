const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all journals with pagination, search, sort, filter
// @route   GET /api/journals
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { search, mood, sort, page = 1, limit = 10 } = req.query;
        const query = { user: req.user._id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        if (mood) {
            query.mood = mood;
        }

        let sortOption = { createdAt: -1 }; 
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'title') sortOption = { title: 1 };

        const journals = await Journal.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Journal.countDocuments(query);

        res.json({
            journals,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single journal
// @route   GET /api/journals/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a journal entry
// @route   POST /api/journals
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, content, mood, tags } = req.body;

    try {
        const journal = await Journal.create({
            user: req.user._id,
            title,
            content,
            mood,
            tags,
        });
        res.status(201).json(journal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a journal entry
// @route   PUT /api/journals/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        journal.title = req.body.title || journal.title;
        journal.content = req.body.content || journal.content;
        journal.mood = req.body.mood || journal.mood;
        journal.tags = req.body.tags || journal.tags;

        const updatedJournal = await journal.save();
        res.json(updatedJournal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        if (journal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await journal.deleteOne();
        res.json({ message: 'Journal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
