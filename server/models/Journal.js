const mongoose = require('mongoose');

const journalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        mood: {
            type: String,
            enum: ['Happy', 'Sad', 'Neutral', 'Excited', 'Angry'],
            default: 'Neutral',
        },
        tags: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
