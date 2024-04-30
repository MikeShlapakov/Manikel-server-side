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

async function waitForResponse(socket) {
    return new Promise((resolve, reject) => {
        socket.once('data', (data) => {
            resolve(data);
        });
        socket.once('error', (error) => {
            reject(error);
        });
    });
}

async function handleWrite(input){
    if (!client.destroyed) {
        let newIn = input + ' '.repeat(process.env.BUFFER_SIZE - input.length-1); 
        // console.log(newIn, " length: ", newIn.length);
        try {
            await writeData(client, newIn);
            console.log("Data sent successfully ", newIn.trimEnd());
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

async function handleReceive(){
    // Wait for response from server
    let response = await waitForResponse(client);
    console.log("Response from server:", response.toString('utf8'));
    return response.toString('utf8')
}

async function initBloom () {
    await client.connect(process.env.TCP_PORT, process.env.TCP_ADDR).on('error', () => {console.log("Blooom server not found running")} ).on('data', () => {console.log("Successfully connected to bloom server")} );
    
    await sendData(); // Make sure sendData is also async or returns a promise
    
    client.on('close', () => {
        console.log('Connection closed');
    });
    
    client.on('error', (error) => {
        console.error('Error:', error);
    });
}

async function logmessage (msg) {console.log(msg);}

async function sendData() {
    // init the bloom filter
    if (!await handleWrite(process.env.BLOOM_FILTER)){
        console.log("Failed to initialize bloom filter");
        return -1;
    }

    await handleReceive();
    
    // init the blacklist
    for (const url of process.env.BAD_URLS.split(" ")) {
        if (!await handleWrite("1 " + url)){
            console.log("Failed to add url to blacklist:", url);
            return -1;
        }

        await handleReceive();
    }
}

module.exports.initBloom = initBloom;
module.exports.handleWrite = handleWrite;
module.exports.handleReceive = handleReceive;
