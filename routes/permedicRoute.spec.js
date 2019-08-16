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
let should = chai.should();


chai.use(chaiHttp);

let app = rewire("../index");
let Permedic = require('../models/permedic');
describe("Permedic ", ()=> {
	beforeEach(()=>{
		samplePermedic = {
			"name":"ahmed",
			"number":"0120741881",
			"rank":50
		}
		findStub = sandbox.stub(moongose.Model , 'find').resolves(samplePermedic);
	});
	afterEach(()=>{
		sandbox.restore();
		app = rewire("../index");
	});
	context("Available Permedics ", (done)=>{
		it("should return wrong params", ()=>{
			chai.request(app)
			.get('/api/requestPermedic')
			.end((err,response)=> {
				expect(response.body).to.have.property('Error').to.equal('unauthorized');
			});
		});
	});
});