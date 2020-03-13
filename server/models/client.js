const mongoose = require("mongoose");

const deadlineSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    calenderStartTime: {
        type: String,
        required: true
    },
    calenderEndTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    peopleInvolved: {
        type: Array,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    deadlineTime: {
        type: String,
        required: true
    },
    remainingtime: {
        type: String,
        required: true
    },
    completedDeadline: {
        type: Boolean,
        required: false
    },
    secondLeft:{
        type:Number,
        required:false
    },
});

const deadline = mongoose.model("deadline", deadlineSchema);
module.exports = deadline;