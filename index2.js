import SHA256 from "crypto-js/sha256";

/*
    Proof of woork (mining): it ensures that there is a lot of
    computing process to making a block.

    Ex: Bitcoin requires that the hash of a block start with a certain
    ammount of zeroes.
    Due to the fact you cannot influence the output of hash function,
    u need to try a lot of combinations to get a hash with the right
    ammount of zeros at the begining; and it requires a lot of computing
    power, it's called difficulty.
*/

class Block {
    constructor(index, timeStamp, data, prevHash = "") {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        //it is responseble to just change the hash output
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    /**
     * It will make the hash function start with a certain
     * ammount of zeros.
     * It will run the while loop 'til the hash starts
     * with the desired quantity.
     */
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = this.calculateHash();
            this.nonce++; //just changing the value
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class BlockChain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        //it constrols how fast the mining happens
        this.difficulty = 4; //how many zeros at begining
    }

    createGenesisBlock() {
        return new Block(0, "2018-06-29", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
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
console.log("Mining block 1...")
chain.addBlock(new Block(1, "2018-06-29", {ammount: 45}));

console.log("Mining block 2...")
chain.addBlock(new Block(2, "2018-06-29", {ammount: 98}));

console.log(JSON.stringify(chain, null, 4));
