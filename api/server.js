import app from "../app.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config({ quiet: true })

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

dns.setDefaultResultOrder("ipv4first");

const DB = process.env.DATABASE

try {

    mongoose.connect(DB)
    console.log("connected")


} catch (err) {

    console.log(err);
    console.log('not connected')

}

const port = process.env.PORT


app.listen(port, () => {

    console.log(`port is running ${port}`)
})



