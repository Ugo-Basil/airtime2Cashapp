require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test';

import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user';
import accountRouter from '../routes/account';
import db from '../db/database.config';
import cookieParser from 'cookie-parser';
import { getRandomBankName } from '../utility/getRandomBank';

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
app.use('/account', accountRouter);
let cookie: string;
let id: string;

describe('Account Creation API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "johnny",
      email: "johndoe@example.com",
      phonenumber: "08001001738",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "johndoe@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "johndoe@example.com",
      password: "test",
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
  })

  test('POST /account/add - failure - invalid account details', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      bank: "",
      number: "1234567890",
      name: "John Doe",
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('bank');
  })

  test('POST /account/add - failure - account name does not match user details', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Lennon",
      bank: getRandomBankName(),
      number: "1234567890"
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('name');
  })

  test('POST /account/add - success - account created', async () => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Doe",
      bank: getRandomBankName(),
      number: "1234567890"
    })
    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('created');
    expect(body).toHaveProperty('data');
  })

  test('POST /account/add - failure - account already exists', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Doe",
      bank: getRandomBankName(),
      number: "1234567890"
    })
    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('already exists');
  })

  test('POST /account/add - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).post('/account/add').send({
      name: "John Doe",
      bank: getRandomBankName(),
      number: "0987654321"
    })
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })
});

describe('Account Retrieval API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "Peter",
      lastname: "Pan",
      username: "petey",
      email: "peterpan@example.com",
      phonenumber: "08001234567",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "peterpan@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "peterpan@example.com",
      password: "test",
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
  })

  test('GET /account/ - failure - no accounts found', async() => {
    const { body, statusCode } = await request(app).get('/account').set("Cookie", cookie).send()
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('msg');
  })

  test('GET /account/ - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).get('/account').send()
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })

  test('GET /account - success - accounts retrieved', async () => {
    await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "Peter Pan",
      bank: getRandomBankName(),
      number: "1112223334"
    })
    const { body, statusCode } = await request(app).get('/account').set("Cookie", cookie).send()
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('retrieved');
    expect(body).toHaveProperty('accounts');
    expect(body.accounts).toHaveLength(1);
  })
});

describe('Account Deletion API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "James",
      lastname: "Bond",
      username: "james007",
      email: "jamesbond@example.com",
      phonenumber: "08001234007",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "jamesbond@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "james007",
      password: "test",
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    const { body } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "James Bond",
      bank: getRandomBankName(),
      number: "1112223335"
    })
    id = body.data.id;
  })

  test('DELETE /account/:id - failure - account does not exist', async () => {
    const { body, statusCode } = await request(app).delete('/account/delete/1').set("Cookie", cookie).send()
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('not found');
  })

  test('DELETE /account/:id - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).delete(`/account/delete/${id}`).send()
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })

  test('DELETE /account/:id - success - account deleted', async () => {
    const { body, statusCode } = await request(app).delete(`/account/delete/${id}`).set("Cookie", cookie).send()
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('deleted');
  })
})

describe('Account Update API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "Peter",
      lastname: "Parker",
      username: "spidey",
      email: "peterparker@example.com",
      phonenumber: "08001231234",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE users SET verified = true WHERE email = "peterparker@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "spidey",
      password: "test",
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    const { body } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "Peter Parker",
      number: "1112223336",
      bank: getRandomBankName()
    })
    id = body.data.id;
  })

  test('PATCH /account/:id - failure - account does not exist', async () => {
    const { body, statusCode } = await request(app).patch('/account/update/1').set("Cookie", cookie).send({
      name: "Peter Parker",
      number: "1112223367"
    })
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('not found');
  })

  test('PATCH /account/:id - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).patch(`/account/update/${id}`).send({
      name: "Peter Parker",
      number: "1112223367"
    })
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })

  test('PATCH /account/:id - success - account updated', async () => {
    const { body, statusCode } = await request(app).patch(`/account/update/${id}`).set("Cookie", cookie).send({
      name: "Peter Parker",
      number: "1112223367"
    })
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('updated');
    expect(body).toHaveProperty('data');
  })
})

