const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        frequency: {
            type: String, // daily, weekly
            default: 'daily',
        },
        completedDates: [
            {
                type: Date,
            },
        ],
        streak: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
