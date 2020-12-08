const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

// afterEach(() => {
//     console.log('afterEach')
// })

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'John',
        email: 'john@test.com',
        password: 'MyPass222!'
    }).expect(201)
    
    // Assert that the dadatbase was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // expect(response.body.user.name).toBe('John') to test each property
    expect(response.body).toMatchObject({
        user: {
            name: 'John',
            email: 'john@test.com'
        },
        token: user.tokens[0].token
    }) // must match entire object 
    expect(user.password).not.toBe('MyPass222!')
})

test('Should not signup user with invalid name/email/password', async () => {
    const response = await request(app).post('/users').send({
        name: 123,
        email: 'dave@c',
        password: 'hide',
    }).expect(400)
    const user = await User.findOne({ name: 123, email: 'dave@', password: 'hide'})
    expect(user).toBeNull()
})

test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non existent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'mapuserin'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200) 
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // when working with objects toEqual is used instead of toBe.
})

test('Should not update valid user fields for unauthenticated user', async () => {
    const response = await request(app)
        .patch('/users/me')
        .send({
            name: 'Bradley',
            age: 27
        })
        .expect(401)
    const user = await User.findById(userOneId)
    expect(user.name).not.toEqual('Bradley')
})

test('Should update valid user fields for authenticated user', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Bradley',
            age: 27
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Bradley')
})

test('Should not update valid user fields with invalid name/email/password', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 12,
            age: test,
            email: 'chayy',
            password: 'wedd'
        })
        .expect(400)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Mike')
})

test('Should not update invalid user fields for authenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: '52 Vieraskuja, Espoo'
        })
        .expect(400)
})