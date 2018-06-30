import SHA256 from "crypto-js/sha256";

class Block {
    constructor(index, timeStamp, data, prevHash = "") {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timeStamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "2018-06-29", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.prevHash = this.getLatestBlock().hash;
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash())
                return false;
            if(currentBlock.prevHash !== prevBlock.hash)
                return false;
        }
        return true;
    }
}

//creating a chain
let chain = new BlockChain();
chain.addBlock(new Block(1, "2018-06-29", {ammount: 45}));
chain.addBlock(new Block(2, "2018-06-29", {ammount: 19}));
chain.addBlock(new Block(3, "2018-06-30", {ammount: 1.2}));

console.log(JSON.stringify(chain, null, 4));
console.log(`Is chain valid: ${chain.isChainValid()}`);


//trying to change the contract
chain.chain[1].data = { ammount: 10000 };
chain.chain[1].hash = chain.chain[1].calculateHash();
console.log(JSON.stringify(chain, null, 4));
console.log(`Is chain valid: ${chain.isChainValid()}`);
