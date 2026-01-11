const fs = require("fs");

function createTimestamp(){
    const now = new Date();

    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return `${date} ${time}`;
}

const timestamp = createTimestamp();

const args = process.argv.slice(2);

const tagIndex = args.indexOf("--tag");

let tag = undefined;

if(tagIndex !== -1 && tagIndex + 1 < args.length){
    tag = args[tagIndex + 1];
    args.splice(tagIndex, 2);
}

const message = args.join(" ");

if(!message){
    console.log("Usage: node idlelog.js [--tag tag] <message>");
    process.exit(1);
}

const parts = [timestamp];

if(tag) parts.push(tag);

parts.push(message);

data = parts.join(" | " )+"\n";

fs.appendFileSync("idle.log", data);