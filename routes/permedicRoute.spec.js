const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai)
const request = require('supertest');
const rewire = require('rewire');
let sandbox = sinon.createSandbox();
let moongose = require('mongoose');
let chaiHttp = require('chai-http');
const {populatePermedics} = require("../services/seed.service");


chai.use(chaiHttp);

let app = rewire("../index");
let Permedic = require('../models/permedic');
describe("Permedic ", ()=> {
	let tokens;
	let permedics;
	before(()=>{
		 permedics = [
			{
				name: "philo",
				bio: "Co-founder",
				rating: 50,
				password: "pass",
				gender: "Male",
				number: "01207418881",
				profilePath: "image.jpeg",
				available: true
			} , {
				name: "omar",
				bio: "Cp-founder",
				rating: 100,
				password: "pass",
				gender: "Male",
				number:"0103012331",
				profilePath: "image2.jpeg",
				available: true
			}
		];
		while( !tokens ){
			 tokens = populatePermedics(permedics);
		}
	});
	beforeEach(()=>{
	
	});
	afterEach(()=>{
		sandbox.restore();
		app = rewire("../index");
	});
	context("Available Permedics ", ()=>{
		it("should return unothorized", ()=>{
			chai.request(app)
			.get('/api/requestPermedic/50/012')
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('unauthorized');
			});
		});
		it("should return rating out of range", ()=>{
			chai.request(app)
			.get('/api/requestPermedic/-50/01207418881')
			.set('token',tokens[0])
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('Rating out of range');
			});
		});
		it("should return wrong number", ()=>{
			chai.request(app)
			.get('/api/requestPermedic/50/0218881')
			.set('token',tokens[0])
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('Wrong phone number format');
			});
		});
		it("should return first permedic", async ()=>{
			chai.request(app)
			.get('/api/requestPermedic/50/01207418881')
			.set('token',tokens[0])
			.send()
			.end((err,response)=> {
				expect(response.body).to.have.property('name').to.equal(permedics[0].name);
			});
		});
		it("should return second permedic", async ()=>{
			chai.request(app)
			.get('/api/requestPermedic/90/01207418881')
			.set('token',tokens[1])
			.send()
			.end((err,response)=> {
				expect(response.body).to.have.property('name').to.equal(permedics[1].name);
			});
		});
		it("shouldn't return last number", async ()=>{
			permedics[1].rating = 50;
			populatePermedics(permedics);
			chai.request(app)
			.get('/api/requestPermedic/50/01207418881')
			.set('token',tokens[1])
			.send()
			.end((err,response)=> {
				expect(response.body).to.have.property('name').to.equal(permedics[1].name);
			});
		});
		it("should return no avialable permedics", async ()=>{
			permedics[1].available = false;
			permedics[0].available = false;
			populatePermedics(permedics);
			chai.request(app)
			.get('/api/requestPermedic/90/01207418881')
			.set('token',tokens[1])
			.send()
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal("No available permedics at the moment");
			});
		});
	});
});