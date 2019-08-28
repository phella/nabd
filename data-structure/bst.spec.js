const chai = require('chai');
let should = require('chai').should();
const redis = require('redis');
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const expect = chai.expect;
let bss = require("./bst");
const bst =  new bss();


describe("test binary search tree",()=>{
	client.flushall();
	it("constructor and insertion",async()=>{
		expect(bst.root).to.equal(null);
		const first = {rating:20,phoneNo:"0120"};
		const second = {rating:20,phoneNo:"011"};
		const third = {rating:10,phoneNo:"0120"};
		const forth = {rating:10,phoneNo : "012"};
		const fifth = {rating:30,phoneNo:"0123"};
		const sixth ={rating : 40,phoneNo:"00"};
		const seventh = {rating:25,phoneNo:"01"};
		await bst.insertPermedic(first);
		expect(bst.root.data[0]).to.eql(first);
		await bst.insertPermedic(second);
		expect(bst.root.data[1]).to.eql(second);
		expect(bst.root.left).to.equal(null);
		expect(bst.root.right).to.equal(null);
		expect(await bst.insertPermedic(third)).to.equal(false);
		await bst.insertPermedic(forth);
		await bst.insertPermedic(fifth);
		await bst.insertPermedic(sixth);
		await bst.insertPermedic(seventh);
		// bst.printTree(bst.root);
		expect(bst.root.left.data[0].rating).to.equal(10);
		expect(bst.root.right.data[0].rating).to.equal(30);
		expect(bst.root.right.right.data[0].rating).to.equal(40);
	});
	it("binary search tree deletion",async ()=>{
		await bst.getPermedic(20);
		should.not.exist(bst.root.data[1]);
		expect(bst.root.data[0].phoneNo).to.equal("011");
		await bst.getPermedic(20);
		expect(bst.root.data[0].phoneNo).to.equal("01");
		let res = await bst.getPermedic(5);
		expect(res.phoneNo).to.equal("012");
		expect(bst.root.left).to.equal(null);
		await bst.getPermedic(30);
		expect(bst.root.right.data[0].phoneNo).to.equal("00");
		res = await bst.getPermedic(10);
		expect(res.phoneNo).to.equal("01");
		res = await bst.getPermedic(10);
		expect(res.phoneNo).to.equal("00");
		expect(bst.root).to.equal(null);
	});
})