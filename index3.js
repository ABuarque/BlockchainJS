import SHA256 from "crypto-js/sha256";

/*
*/
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timeStamp, transactions, prevHash = "") {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = this.calculateHash();
            this.nonce++;
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("2018-06-29", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAdress) {
        const block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAdress, this.miningReward),
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddres(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const transaction of block.transactions) {
                if(transaction.fromAddress === address)
                    balance -= transaction.amount;
                if(transaction.toAddress === address)
                    balance += transaction.amount;
            }
        }
        return balance;
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

const chain = new BlockChain();
chain.createTransaction(new Transaction("Address1", "Address2", 100));
chain.createTransaction(new Transaction("Address2", "Address1", 50));
console.log("Start mining...");
chain.minePendingTransactions("xaviers-address");
console.log("balance: " + chain.getBalanceOfAddres("xaviers-address"));
