const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, async (req, res) => {
    try {
        const { search, category, status, sort, page = 1, limit = 10 } = req.query;
        const query = { user: req.user._id };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter
        if (category) {
            query.category = category;
        }

        if (status === 'completed') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.completedDates = { $gte: today };
        } else if (status === 'pending') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // unless we use aggregation.
            // Let's stick to basic filters for now or handle in memory if dataset is small, 
            // but for pagination we should do it in DB.
            // Let's omit complex status filter in DB query for now and handle basic fields.
        }

        let sortOption = { createdAt: -1 }; // Default: Newest first
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'streak') sortOption = { streak: -1 };
        if (sort === 'name') sortOption = { name: 1 };

        const habits = await Habit.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Habit.countDocuments(query);

        res.json({
            habits,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a habit
// @route   POST /api/habits
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, category, frequency } = req.body;

    try {
        const habit = await Habit.create({
            user: req.user._id,
            name,
            category,
            frequency,
        });
        res.status(201).json(habit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        habit.name = req.body.name || habit.name;
        habit.category = req.body.category || habit.category;
        habit.frequency = req.body.frequency || habit.frequency;

        // Check for completion toggle
        if (req.body.completed !== undefined) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isCompletedToday = habit.completedDates.some(date => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });

            if (req.body.completed && !isCompletedToday) {
                habit.completedDates.push(new Date());
                habit.streak += 1;
            } else if (!req.body.completed && isCompletedToday) {
                // Remove today from completedDates
                habit.completedDates = habit.completedDates.filter(date => {
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() !== today.getTime();
                });
                habit.streak = Math.max(0, habit.streak - 1);
            }
        }

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await habit.deleteOne();
        res.json({ message: 'Habit removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
