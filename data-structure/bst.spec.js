const chai = require('chai');
let should = require('chai').should();
const expect = chai.expect;
let bss = require("./bst");
const bst =  new bss();
const bst2 = new bss();
describe("test binary search tree",()=>{
	it("constructor and insertion",()=>{
		expect(bst.root).to.equal(null);
		const first = {rating:20,number:"0120"};
		const second = {rating:20,number:"011"};
		const third = {rating:10,number:"0120"};
		const forth = {rating:10,number : "012"};
		const fifth = {rating:30,number:"0123"};
		const sixth ={rating : 40,number:"00"};
		const seventh = {rating:25,number:"01"};
		bst.insertPermedic(first);
		expect(bst.root.data[0]).to.equal(first);
		bst.insertPermedic(second);
		expect(bst.root.data[1]).to.equal(second);
		expect(bst.root.left).to.equal(null);
		expect(bst.root.right).to.equal(null);
		expect(bst.insertPermedic(third)).to.equal(false);
		bst.insertPermedic(forth);
		bst.insertPermedic(fifth);
		bst.insertPermedic(sixth);
		bst.insertPermedic(seventh);
		// bst.printTree(bst.root);
		expect(bst.root.left.data[0].rating).to.equal(10);
		expect(bst.root.right.data[0].rating).to.equal(30);
		expect(bst.root.right.right.data[0].rating).to.equal(40);
	});
	it("binary search tree deletion",()=>{
		expect(bst2.getPermedic(20)).to.equal(false);
		bst.getPermedic(20);
		should.not.exist(bst.root.data[1]);
		expect(bst.root.data[0].number).to.equal("011");
		bst.getPermedic(20);
		expect(bst.root.data[0].number).to.equal("01");
		expect(bst.getPermedic(5).number).to.equal("012");
		expect(bst.root.left).to.equal(null);
		bst.getPermedic(30);
		expect(bst.root.right.data[0].number).to.equal("00");
		expect(bst.getPermedic(10).number).to.equal("01");
		expect(bst.getPermedic(10).number).to.equal("00");
		expect(bst.root).to.equal(null);
	});
})