const express = require('express')
//let ObjectID = require('mongodb').ObjectID; // good if querying for _id in specific query calls.
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
 
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        //req.user.tokens = req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.status(200).send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'userclass']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update] )
        await req.user.save()

        //const user = await User.updateOne({_id: ObjectID(_id)}, { $set: req.body } ) // does not return document
        //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // for middleware we change this.
        
        res.status(200).send(req.user)
    } catch(error) {
        res.status(400).send(error)
    }
})

// user deleting their own record
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch(error) { 
        res.status(500).send()
    }
})

const upload = multer({ 
    //dest: 'avatars', instead of saving in a dir, we can save in database user model.
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// creting and updating avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer // since we dont have dest set up in config, we can reach the file frm req.
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send('User Avatar deleted!')
    } catch(error) {
        res.status(400).send({error: 'Avatar deletion failed!'})
    }
    
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        // To respond what type of image we return, we set headers
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

// Good for Administrator to use to see a ordinary user details
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     if(!validator.isMongoId(_id)) {
//         return res.status(400).send('Invalid user details')
//     }

//     try {
//         const user = await User.findById(_id)
//         if (!user) return res.status(404).send('User not Found')
//         res.status(200).send(user)
//     } catch(error) {
//         res.status(500).send(error)
//     }
// })

module.exports = router