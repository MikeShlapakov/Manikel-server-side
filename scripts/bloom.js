const net = require('net');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

const BAD_URLS = ['www.site0.com', 'www.site1.com', 'www.site2.com', 'www.site3.com']

const client = new net.Socket();

async function handleWrite(input){
    // console.log(input)
    if (!client.destroyed) {
        let newIn = input + '\0'.repeat(4096 - input.length); 
        console.log(newIn, " length: ", newIn.length)
        client.write(newIn);
        return true;
    }

    console.error('Client is disconnected');
    return false;
} 

async function initBloom () {
    client.connect(process.env.TCP_PORT, process.env.TCP_ADDR, () => {
        console.log('Connected to server');
    });
    
    // init the bloom filter
    if (!handleWrite(process.env.BLOOM_FILTER)){
        return -1;
    }
    
    // init the blacklist
    for (const url of BAD_URLS) {
        if (!handleWrite("1 "+url)){
            return -1;
        }
    }
};

module.exports.initBloom = initBloom;
