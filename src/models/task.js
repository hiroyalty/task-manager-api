const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    description: { 
        type: String,
        required: true,
        trim: true,
     },
    completed: {
        type: Boolean,
        required: false, 
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
 
taskSchema.pre('save', async function(next) {
    const task = this

    console.log('Just before task updated')

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task