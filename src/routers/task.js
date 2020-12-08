const express = require('express')
const validator = require('validator')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send( error)
    }
})

// NOTE every param passed from url is a string and must be converted to boolean or number as the case maybe.
// GET /tasks?completed=false or true, depending.
// GET /tasks?limit=10&skip=0  Pagination: limit, skip
// GET /tasks?sortBy=createdAt:asc           field and direction: asc, desc.
router.get('/tasks', auth, async (req, res) => {
    const match = {} // if completed param is not issued.
    const sort = {}

    if(req.query.completed) { 
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        // One mtd
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort // sort object was created above
            }
        }).execPopulate()
        if(!req.user.tasks) return res.status(404).send('Tasks not Found')
        res.status(200).send(req.user.tasks)

        // Alternatively
        // const tasks = await Task.find({ owner: req.user._id })
        // if(!tasks) return res.status(404).send('Tasks not Found')
        // res.status(200).send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!validator.isMongoId(_id)) return res.status(400).send('Wrong details provided') 

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send('No task Found')
        res.status(200).send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!validator.isMongoId(_id)) return res.status(400).send('Invalid Updates')

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => { return allowedUpdates.includes(update) })

    if(!isValidOperation) { return res.status(400).send('Invalid Updates') }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) return res.status(404).send()

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        
        res.status(200).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    if (!validator.isMongoId(_id)) { return res.status(400).send('Invalid Operation') }

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if(!task) { return res.status(404).send('Task not Found') }
        res.status(200).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

module.exports = router