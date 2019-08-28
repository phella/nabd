process.env.NODE_ENV = 'test'; 
const chai = require('chai');
 const expect = chai.expect;
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai)
// const request = require('supertest');
 const rewire = require('rewire');
// let sandbox = sinon.createSandbox();
// let moongose = require('mongoose');
 let chaiHttp = require('chai-http');
// const {populatePermedics} = require("../services/seed.service");


chai.use(chaiHttp);

 let app = rewire("../index");
 let Patient = require('../models/patient');
 describe("Register Route ", ()=> { 
	afterEach(()=>{
 		//sandbox.restore();
 		app = rewire("../index");
 	});
 	context("Sign up ", ()=>{
 		it("should return wrong phone format", ()=>{
 			chai.request(app)
			 .post('/api/register/user')
			 .send({"phoneNo":"01207418882","name":"philo","password":"pass","birthDate":"2018-9-9","gender":true})
 			.end((err,response)=> {
 				expect(response.body).to.have.property('Error').to.equal('Wrong phone number format');
			 });
		 });
		 // number already exists not implemented yet
		 it("should return wrong phone format", ()=>{
			chai.request(app)
			.post('/api/register/user')
			.send({"phoneNo":"201207418882","name":"philo","birthDate":"2018-9-9","gender":true})
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('Payload is missing');
			});
		});
		it("should return wrong phone format", ()=>{
			chai.request(app)
			.post('/api/register/user')
			.send({"phoneNo":"201207418882","password":"pass","name":"philo","birthDate":"2018-9-9","gender":true})
			.end((err,response)=> {
				expect(response.body).to.equal('created successfully');
			});
		});
		it("should return wrong phone format", ()=>{
			chai.request(app)
			.post('/api/register/user')
			.send({"phoneNo":"201207418882","password":"pass","name":"philo","birthDate":"2018-9-9","gender":true})
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('Account is created and needs confirmation');
			});
		});
	 });
 });