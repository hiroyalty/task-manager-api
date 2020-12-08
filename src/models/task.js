const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: { 
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if ( validator.isInt(value)) throw new Error('Description cannot be Number')
        }
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

    //console.log('Just before task updated')

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task