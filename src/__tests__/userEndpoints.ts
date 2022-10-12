require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test';


import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user';
import db from '../db/database.config';
import cookieParser from 'cookie-parser';

let cookie: string;
let id: string;

beforeAll(async () => {
  await db.sync({ force: true })
    .then(() => {
      console.info("Test Db Connected")
    })
    .catch((err: any) => {
      console.error(err)
    })
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRouter);

//Tests user sign-up
describe('User Sign-up API Integration test', () => {
  test('POST /user/register - success - sign-up a user', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(201);
    expect(body.msg).toContain('User created successfully');
  });

  test('POST /user/register - failure - request body invalid', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: null,
      email: "jd@gmail.com",
      phonenumber: null,
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  });

  test('POST /user/register - failure - User already exists', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
  });
});


//Tests user login
describe('User Login API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    await db.query('UPDATE users SET verified = true WHERE email = "jds@example.com";')
  })

  test('POST /user/login - success - login a user with email', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jds@example.com",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('userInfo');
  });

  test('POST /user/login - success - login a user with username', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('userInfo');
  });

  test('POST /user/login - failure - improper request body', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      username: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  });

  test('POST /user/login - failure - user does not exist', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(404);
    expect(body.msg).toBe('User not found');
  });

  test('POST /user/login - failure - incorrect password', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "tets",
    })

    expect(statusCode).toBe(400);
    expect(body.msg).toBe('Invalid credentials');
  });

  test('POST /user/login - failure - user not verified', async () => {
    await db.query('UPDATE users SET verified = false WHERE email = "jds@example.com";')

    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test",
    })
    expect(statusCode).toBe(401);
    expect(body.msg).toBe('Your account has not been verified');
  });
});

//Tests user update
describe('User Update API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "jds@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test"
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    id = results.body.userInfo.id;
  })

  test('PATCH /user/update/:id - success - update user details', async () => {
    const { body, statusCode } = await request(app).patch(`/user/update/${id}`).set("Cookie", cookie).send({
      firstname: "Jane",
      lastname: "Austen",
      phonenumber: "08023780049"
    })
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('updated');
    expect(body).toHaveProperty('firstname');
    expect(body.firstname).toBe('Jane');
    expect(body).toHaveProperty('lastname');
    expect(body.lastname).toBe('Austen');
    expect(body).toHaveProperty('phonenumber');
    expect(body.phonenumber).toBe('08023780049');
    expect(body).toHaveProperty('avatar');
  })

  test('PATCH /user/update/:id - failure - user not found', async () => {
    const { body, statusCode } = await request(app).patch(`/user/update/100`).set("Cookie", cookie).send({
      firstname: "Jane",
      lastname: "Austen",
      phonenumber: "08023780049"
    })
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('not found');
  })

  test('PATCH /user/update/:id - failure - invalid details', async () => {
    const { body, statusCode } = await request(app).patch(`/user/update/${id}`).set("Cookie", cookie).send({
      username: "janey",
      phonenumber: "08023780049"
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  })

  test('PATCH /user/update/:id - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).patch(`/user/update/${id}`).send({
      firstname: "Jane",
      lastname: "Austen",
      phonenumber: "08023780049"
    })
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })
})

//Tests user logout
describe('User Logout API Integration test', () => {
  test('POST /user/logout - success', async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "jds@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "jds@example.com",
      password: "test"
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    id = results.body.userInfo.id;
    const { body, statusCode } = await request(app).get('/user/logout').set("Cookie", cookie).send();
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('logged out');
  })
})
