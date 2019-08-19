"use strict"
const available = {};
class BinarySearchTree {
    constructor(){
        this.root = null;
    }
    insertPermedic(data , left = null,right = null ) {
		if(available[data.number] !== undefined) {
			return false;
		}
		available[data.number] = true;
		let node = {
            data : [data],
            left,
            right
		};
		if(!this.root){
			this.root = node;
			return true;
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
		return true;
	}
	/**
	 * 
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
    getPermedic(rating){
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
					// available.delete[permedic.number];
					return permedic;
                } else {
					// avialable.delete
					if(lastNode == currentNode){
						this.findAlternative(currentNode,lastNode,"root");
					}
					else if(permedic.rating > lastNode.data[0].rating){
					   this.findAlternative(currentNode,lastNode,"right");
					} else {
						this.findAlternative(currentNode,lastNode,"left");
					}
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
		// available.delete[close.number];
        return close;
	}
	printTree(node){
		console.log(node.data[0].number);
		if(node.left){
			this.printTree(node.left);
		} 
		if(node.right) {
			this.printTree(node.right);
		}
	}
}

module.exports = BinarySearchTree;