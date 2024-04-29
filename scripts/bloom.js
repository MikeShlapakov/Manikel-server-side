const net = require('net');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

const client = new net.Socket();
client.setNoDelay(true)

function writeData(socket, data) {
    return new Promise((resolve, reject) => {
        socket.write(data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function handleWrite(input){
    if (!client.destroyed) {
        let newIn = input + ' '.repeat(process.env.BUFFER_SIZE - input.length); 
        // console.log(newIn, " length: ", newIn.length);
        try {
            await writeData(client, newIn);
            console.log("Data sent successfully");
            return true;
        } catch (error) {
            console.error("Error sending data:", error);
            return false;
        }
    } 
    else{
        console.error('Client is disconnected');
        return false;
    }
} 

async function initBloom () {
    client.connect(process.env.TCP_PORT, process.env.TCP_ADDR, () => {
        console.log('Connected to server');
        sendData();
    });
}

async function sendData() {
    // init the bloom filter
    if (!await handleWrite(process.env.BLOOM_FILTER)){
        console.log("Failed to initialize bloom filter");
        return -1;
    }
    
    // init the blacklist
    for (const url of process.env.BAD_URLS.split(" ")) {
        if (!await handleWrite("1 " + url)){
            console.log("Failed to add url to blacklist:", url);
            return -1;
        }
    }
}

module.exports.initBloom = initBloom;
