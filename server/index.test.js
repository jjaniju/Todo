import {expect} from 'chai';
import { initializeTestDb } from './helper/file.js';
import { pool } from './helper/db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const base_url = 'http://localhost:3001/';

describe('GET TASKS',() => {
    before(() => {
    initializeTestDb();
})
    it ('should get all tasks',async() => {
        const response = await fetch('http://localhost:3001/');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id','description');
    })
})

const insertTestUser = (email,password) => {
    hash(password,10,(error,hashedPassword) => {
        pool.query("INSERT INTO account (email,password) VALUES ($1,$2)",
            [email,hashedPassword]);
    });
}
const getToken = (email) => {
    return sign({user: email}, process.env.JWT_SECRET_KEY);
}

describe ('POST task',() => {
    const email = "post@foo.com";
    const password = "post123";
    insertTestUser(email,password);
    const token = getToken(email);
    it ("should post a task",async() => {
        const response = await fetch(base_url + 'create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({description: 'Task from unit test'})
      })
    })
    it('should not post a task without description',async() => {
        const response = await fetch(base_url + 'create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'description':null})
        });
    })
    
})

describe('DELETE task',() => {
    const email = "delete@foo.com";
    const password = "delete123";
    insertTestUser(email,password);
    const token = getToken(email);
    it ('should delete a task',async() => {
        const response = await fetch(base_url + 'delete/1',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    })
    it('should not delete a task with SQL injection',async() => {
        const response = await fetch(base_url + 'delete/id=0 or id > 0',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        const data = await response.json();
        expect(response.status).to.equal(500,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    })
})
describe('POST register',() => {
    const email = 'register@foo.com';
    const password = 'register123';
    it ('should register with valid email and password',async() => {
        const response = await fetch(base_url + 'user/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email,'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(201,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id','email');
    })
    it("should not post a user with less than 8 charecter password",async() =>{
        const email = "register@fdfaoo.com"
        const password = "short4"
        const response = await fetch(base_url + "user/register",{
            method:"post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({"email": email, "password": password})
        })
        const data = await response.json();
        expect(response.status).to.equal(400,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    })
})

describe('POST login',() => {
    const email = "login@foo.com";
    const password = "jeejee123";
    insertTestUser(email,password);
    it ("should login with valid credentials",async() => {
        const response = await fetch(base_url + 'user/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email,'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(200,data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id','email','token');
    })
})

export { initializeTestDb, insertTestUser, getToken}