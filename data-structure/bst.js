"use strict"
const redis = require("redis");
const util = require("util");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
client.set("available","true");
let available ; 

class BinarySearchTree {
    constructor(){
        this.root = null;
	}

	async insertPermedic(data,left=null,right=null){
			available =	await client.get("available");
			if(available ){
				this.root = await client.get("root");
				this.root = JSON.parse(this.root);
				return this.PrivateinsertPermedic(data,left,right);
			}
	}

    PrivateinsertPermedic(data , left = null,right = null ) {
		
		client.set("available","false");
		let node = {
            data : [data],
            left,
            right
		};
		if(!this.root){
			this.root = node;
			client.set("root",JSON.stringify(this.root));
			client.set("available","true");
			return true;
		}
		// Check if phoneNo already exists
		if(!this.printTree(this.root,data.phoneNo)){
			return false;
		}
		let lastNode = this.root;
		let currentNode;
		if(this.root.data[0].rating < data.rating){
			currentNode = this.root.right;
		} else if( this.root.data[0].rating > data.rating) {
			currentNode = this.root.left;
		} else {
			currentNode = this.root;
		}
        while(currentNode){
            if(currentNode.data[0].rating === data.rating) {
				currentNode.data.push(data);
				client.set("root",JSON.stringify(this.root));
				client.set("available","true");
                return true;
            } else if (currentNode.data[0].rating < data.rating) {
				lastNode = currentNode;
				currentNode  = currentNode.right;
            } else {
				lastNode = currentNode;
                currentNode = currentNode.left;
            }
		}
		if(lastNode.data[0].rating < node.data[0].rating){
			lastNode.right = node;
		} else {
			lastNode.left = node;
		}
		client.set("root",JSON.stringify(this.root));
		client.set("available","true");
		return true;
	}

	/**
	 * get replacable node to current node
	 * @param  node node to be replaced 
	 * @param  last its parent
	 * @param  rating request permedic rating
	 */
    findAlternative(node,last,child){
		let temp ;
        if(node.right === null){
            if(node.left === null){
				if(child == "root"){
					this.root  = null;
					return;
				}
				last[child] = null;
				return;
            } else {
				if(child == "root"){
					this.root  = this.root.left;
					return;
				}
				last[child] = node.left;
				return;
			}
        } else if(node.left === null){
			if(child == "root"){
				this.root  = this.root.right;
				return;
			}
			last[child] = node.right;
			return;
		} else {
			temp = node.right;
			if(temp.left === null){
				if(child == "root"){
					this.root  = temp;
					return;
				}
				last["child"] = temp;
				return;
			}
			let lastNode = node;
            while(temp.left !== null){
				lastNode = temp;
				temp = temp.left;
			}
			node.data = temp.data;
			if(temp.left === null){
				if(temp.right === null){
					lastNode.left =null;
				} else {
					lastNode.left = temp.right;
				}
			} 
        }
	}
	
	async getPermedic(rating){
			available =	await client.get("available");
			if(available){
				this.root = await client.get("root");
				this.root = JSON.parse(this.root);
				return this.PrivategetPermedic(rating);
				} else {
					return false;
				}
			}

    PrivategetPermedic(rating){
		client.set("available","false");
		let lastNode = this.root;
		let currentNode;
        if(!this.root){
            return false;
        }
        if(this.root.data[0].rating>rating){
			currentNode = this.root.left;
        } else if(this.root.data[0].rating<rating) {
            currentNode = this.root.right;
        } else {
			currentNode = this.root;
		}
        let permedic;
        while(currentNode){
            if(currentNode.data[0].rating === rating){
                permedic = currentNode.data.shift();
                if(currentNode.data.length !== 0){
					client.set("root",JSON.stringify(this.root));
					client.set("available","true");
					return permedic;
                } else {
					client.set("root",JSON.stringify(this.root));
					client.set("available","true");
					if(lastNode == currentNode){
						this.findAlternative(currentNode,lastNode,"root");
					}
					else if(permedic.rating > lastNode.data[0].rating){
					   this.findAlternative(currentNode,lastNode,"right");
					} else {
						this.findAlternative(currentNode,lastNode,"left");
					}
						client.set("root",JSON.stringify(this.root));
						client.set("available","true");
					    return permedic;
                }
            } else if(currentNode.data[0].rating < rating){
				if(currentNode.right){
					lastNode = currentNode;
					currentNode = currentNode.right;
				}else {
					break;
				}
            } else {
				if(currentNode.left)
				{
                	lastNode = currentNode;
					currentNode = currentNode.left;
				}else {
					break;
				}
            }
		}
		if(!currentNode){
			currentNode = this.root;
		}
        let close =currentNode.data.shift();
        if(currentNode.data.length === 0){
			if(lastNode == currentNode){
				this.findAlternative(currentNode,lastNode,"root");
			}
			else if(close.rating > lastNode.data[0].rating){
				this.findAlternative(currentNode,lastNode,"right");
			 } else {
				 this.findAlternative(currentNode,lastNode,"left");
			 }
		}
		client.set("root",JSON.stringify(this.root));
		client.set("available","true");
        return close;
	}
	printTree(node,phoneNo){
		let flag0=true,flag1=true,flag2=true;
		node.data.forEach(element => {
			if(element.phoneNo === phoneNo){
				flag0 = false;
			}
		});
		if(node.left){
			flag1 = this.printTree(node.left,phoneNo);
		} 
		if(node.right) {
			flag2 = this.printTree(node.right,phoneNo);
		}
		return flag0 && flag1 && flag2;
	}
}

module.exports = BinarySearchTree;