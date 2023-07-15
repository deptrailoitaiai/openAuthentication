const redis = require('redis');

// Tạo một client Redis
const client = redis.createClient();

async function connection(){
    await client.connect();
    console.log('Connected');
}
connection();

client.on('error', err => console.log('Redis Client Error', err));

async function generateKeys(){
    await client.set("number", "1234");
    const getKeys = await client.get("number");
    console.log(getKeys);
    await client.del("number", (err, repply)=>{
        if(err) console.log(err);
        if(repply) console.log(repply);
    });
    await client.disconnect();
};
generateKeys();


